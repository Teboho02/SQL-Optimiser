using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Npgsql;
using OpenAI.Chat;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.Services.QueryExecutionService.DTO;

namespace sql_optimizer.Services.QueryExecutionService;

/// <summary>
/// Executes SQL queries and retrieves schema information from a restored local database.
/// </summary>
[AbpAuthorize]
public class QueryExecutionAppService : ApplicationService, IQueryExecutionAppService
{
    private const int QueryTimeoutSeconds = 30;

    private readonly IRepository<DatabaseConnection, Guid> _connectionRepository;

    public QueryExecutionAppService(IRepository<DatabaseConnection, Guid> connectionRepository)
    {
        _connectionRepository = connectionRepository;
    }

    /// <inheritdoc />
    public async Task<ExecuteQueryOutput> ExecuteAsync(ExecuteQueryInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new ExecuteQueryOutput { Error = "This connection has not been restored to the local database yet." };

        var sw = Stopwatch.StartNew();

        try
        {
            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            await using var cmd = new NpgsqlCommand(input.Sql, conn)
            {
                CommandTimeout = QueryTimeoutSeconds
            };

            await using var reader = await cmd.ExecuteReaderAsync();

            var columns = new List<string>();
            for (var i = 0; i < reader.FieldCount; i++)
                columns.Add(reader.GetName(i));

            var rows = new List<Dictionary<string, object>>();
            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                for (var i = 0; i < reader.FieldCount; i++)
                    row[columns[i]] = reader.IsDBNull(i) ? null : reader.GetValue(i).ToString();
                rows.Add(row);
            }

            sw.Stop();

            return new ExecuteQueryOutput
            {
                Columns = columns,
                Rows = rows,
                RowsAffected = rows.Count,
                ExecutionTimeMs = sw.ElapsedMilliseconds,
            };
        }
        catch (Exception ex)
        {
            Logger.Error($"[QueryExecution] Query failed for connection {input.ConnectionId}: {ex.Message}", ex);
            return new ExecuteQueryOutput { Error = ex.Message };
        }
    }

    /// <inheritdoc />
    public async Task<List<SchemaTableDto>> GetSchemaAsync(Guid connectionId)
    {
        var connectionString = await GetLocalConnectionStringAsync(connectionId);
        if (connectionString is null)
            throw new UserFriendlyException("The local database for this connection no longer exists. Please re-run the restore.");

        try
        {
            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            const string sql = """
                SELECT
                    CASE WHEN t.table_schema = 'public' THEN t.table_name
                         ELSE t.table_schema || '.' || t.table_name
                    END AS table_name,
                    c.column_name
                FROM information_schema.tables t
                JOIN information_schema.columns c
                    ON c.table_schema = t.table_schema
                    AND c.table_name  = t.table_name
                WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                  AND t.table_schema NOT LIKE 'pg_temp_%'
                  AND t.table_schema NOT LIKE 'pg_toast_temp_%'
                  AND t.table_type = 'BASE TABLE'
                ORDER BY t.table_schema, t.table_name, c.ordinal_position;
                """;

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            var tables = new Dictionary<string, SchemaTableDto>();
            while (await reader.ReadAsync())
            {
                var tableName = reader.GetString(0);
                var columnName = reader.GetString(1);

                if (!tables.TryGetValue(tableName, out var table))
                {
                    table = new SchemaTableDto { Name = tableName };
                    tables[tableName] = table;
                }

                table.Columns.Add(columnName);
            }

            return [.. tables.Values];
        }
        catch (Exception ex)
        {
            Logger.Error($"[QueryExecution] Schema fetch failed for connection {connectionId}: {ex.Message}", ex);
            throw new UserFriendlyException($"Could not read schema: {ex.Message}");
        }
    }

    /// <inheritdoc />
    public async Task<SchemaWithRelationshipsDto> GetSchemaWithRelationshipsAsync(Guid connectionId)
    {
        var connectionString = await GetLocalConnectionStringAsync(connectionId);
        if (connectionString is null)
            throw new UserFriendlyException("The local database for this connection has not been restored yet.");

        try
        {
            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            // Columns with PK info
            const string columnSql = """
                SELECT
                    CASE WHEN c.table_schema = 'public' THEN c.table_name
                         ELSE c.table_schema || '.' || c.table_name
                    END AS table_name,
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    c.character_maximum_length,
                    CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_primary_key
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON t.table_schema = c.table_schema AND t.table_name = c.table_name
                LEFT JOIN (
                    SELECT kcu.table_schema, kcu.table_name, kcu.column_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu
                        ON kcu.constraint_name = tc.constraint_name
                        AND kcu.table_schema = tc.table_schema
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                ) pk ON pk.table_schema = c.table_schema AND pk.table_name = c.table_name AND pk.column_name = c.column_name
                WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                  AND t.table_schema NOT LIKE 'pg_temp_%'
                  AND t.table_type = 'BASE TABLE'
                ORDER BY c.table_schema, c.table_name, c.ordinal_position;
                """;

            // FK relationships
            const string fkSql = """
                SELECT
                    CASE WHEN kcu.table_schema = 'public' THEN kcu.table_name
                         ELSE kcu.table_schema || '.' || kcu.table_name
                    END AS from_table,
                    kcu.column_name AS from_column,
                    CASE WHEN ccu.table_schema = 'public' THEN ccu.table_name
                         ELSE ccu.table_schema || '.' || ccu.table_name
                    END AS to_table,
                    ccu.column_name AS to_column
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON kcu.constraint_name = tc.constraint_name AND kcu.table_schema = tc.table_schema
                JOIN information_schema.constraint_column_usage ccu
                    ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY';
                """;

            var tables = new Dictionary<string, SchemaTableDetailDto>();

            await using (var cmd = new NpgsqlCommand(columnSql, conn))
            await using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    var tableName = reader.GetString(0);
                    if (!tables.TryGetValue(tableName, out var table))
                    {
                        table = new SchemaTableDetailDto { Name = tableName };
                        tables[tableName] = table;
                    }

                    table.Columns.Add(new SchemaColumnDto
                    {
                        Name = reader.GetString(1),
                        DataType = reader.GetString(2),
                        IsNullable = reader.GetString(3) == "YES",
                        MaxLength = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                        IsPrimaryKey = reader.GetBoolean(5),
                    });
                }
            }

            var relationships = new List<SchemaRelationshipDto>();

            await using (var cmd = new NpgsqlCommand(fkSql, conn))
            await using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    var fromTable = reader.GetString(0);
                    var fromColumn = reader.GetString(1);
                    var toTable = reader.GetString(2);
                    var toColumn = reader.GetString(3);

                    relationships.Add(new SchemaRelationshipDto
                    {
                        FromTable = fromTable,
                        FromColumn = fromColumn,
                        ToTable = toTable,
                        ToColumn = toColumn,
                    });

                    // Annotate FK info onto columns
                    if (tables.TryGetValue(fromTable, out var table))
                    {
                        var col = table.Columns.FirstOrDefault(c => c.Name == fromColumn);
                        if (col is not null)
                        {
                            col.ReferencesTable = toTable;
                            col.ReferencesColumn = toColumn;
                        }
                    }
                }
            }

            return new SchemaWithRelationshipsDto
            {
                Tables = [.. tables.Values],
                Relationships = relationships,
            };
        }
        catch (Exception ex)
        {
            Logger.Error($"[Schema] GetSchemaWithRelationships failed for {connectionId}: {ex.Message}", ex);
            throw new UserFriendlyException($"Could not read schema: {ex.Message}");
        }
    }

    /// <inheritdoc />
    public async Task<GenerateTestDataOutput> GenerateTestDataAsync(GenerateTestDataInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new GenerateTestDataOutput { Error = "This connection has not been restored to the local database yet." };

        var openAiKey = Environment.GetEnvironmentVariable("OPENAI_KEY");
        if (string.IsNullOrWhiteSpace(openAiKey))
            return new GenerateTestDataOutput { Error = "OPENAI_KEY environment variable is not configured." };

        // Build schema context for requested tables only
        SchemaWithRelationshipsDto schema;
        try
        {
            schema = await GetSchemaWithRelationshipsAsync(input.ConnectionId);
        }
        catch (Exception ex)
        {
            return new GenerateTestDataOutput { Error = $"Could not read schema: {ex.Message}" };
        }

        var requestedNames = new HashSet<string>(input.Tables.Select(t => t.TableName), StringComparer.OrdinalIgnoreCase);
        var requestedTables = schema.Tables.Where(t => requestedNames.Contains(t.Name)).ToList();

        if (requestedTables.Count == 0)
            return new GenerateTestDataOutput { Error = "None of the requested tables were found in the schema." };

        // Topological sort by FK dependencies so parents are inserted before children
        var sorted = TopologicalSort(requestedTables, schema.Relationships);

        // Build prompt
        var schemaText = string.Join("\n", sorted.Select(t =>
        {
            var cols = string.Join(", ", t.Columns.Select(c =>
            {
                var desc = $"{c.Name} {c.DataType}";
                if (c.IsPrimaryKey) desc += " PK";
                if (!c.IsNullable) desc += " NOT NULL";
                if (c.ReferencesTable != null) desc += $" FK->{c.ReferencesTable}.{c.ReferencesColumn}";
                return desc;
            }));
            var rowCount = input.Tables.FirstOrDefault(r => string.Equals(r.TableName, t.Name, StringComparison.OrdinalIgnoreCase))?.RowCount ?? 10;
            return $"  {t.Name}({cols}) -- generate {rowCount} rows";
        }));

        var relevantFks = schema.Relationships
            .Where(r => requestedNames.Contains(r.FromTable) && requestedNames.Contains(r.ToTable))
            .ToList();

        var fkText = relevantFks.Count > 0
            ? string.Join("\n", relevantFks.Select(r => $"  {r.FromTable}.{r.FromColumn} -> {r.ToTable}.{r.ToColumn}"))
            : "  (none)";

        var systemPrompt = """
            You are a PostgreSQL test data generator.
            Given a schema and FK constraints, generate SQL INSERT statements that:
            - Respect column data types
            - Respect NOT NULL constraints
            - Insert parent table rows before child table rows (FK order is already provided)
            - Use realistic but fictional values
            - Do NOT include any markdown, code fences, or explanations — only raw SQL statements separated by semicolons
            - Use single quotes for string literals; escape apostrophes as ''
            - Do not include a trailing semicolon after the last statement
            """;

        var userMessage = $"""
            Schema (in FK-safe insertion order):
            {schemaText}

            Foreign key relationships:
            {fkText}

            Generate the INSERT statements now.
            """;

        string insertSql;
        try
        {
            var chatClient = new ChatClient("gpt-4o-mini", openAiKey);
            var response = await chatClient.CompleteChatAsync(
            [
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userMessage),
            ]);
            insertSql = response.Value.Content[0].Text.Trim();
        }
        catch (Exception ex)
        {
            Logger.Error($"[DataGen] OpenAI call failed: {ex.Message}", ex);
            return new GenerateTestDataOutput { Error = $"AI generation failed: {ex.Message}" };
        }

        // Execute inside a transaction
        var insertedCounts = new Dictionary<string, int>();
        try
        {
            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            await using var tx = await conn.BeginTransactionAsync();

            var statements = insertSql
                .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            foreach (var stmt in statements)
            {
                await using var cmd = new NpgsqlCommand(stmt + ";", conn, tx) { CommandTimeout = 30 };
                await cmd.ExecuteNonQueryAsync();

                // Track counts per table
                var lower = stmt.ToLowerInvariant();
                var intoIdx = lower.IndexOf("into ", StringComparison.Ordinal);
                if (intoIdx >= 0)
                {
                    var afterInto = stmt[(intoIdx + 5)..].TrimStart();
                    var tableName = afterInto.Split([' ', '('], StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? "unknown";
                    tableName = tableName.Trim('"');
                    insertedCounts[tableName] = insertedCounts.GetValueOrDefault(tableName) + 1;
                }
            }

            await tx.CommitAsync();

            return new GenerateTestDataOutput { Success = true, InsertedCounts = insertedCounts };
        }
        catch (Exception ex)
        {
            Logger.Error($"[DataGen] INSERT execution failed: {ex.Message}", ex);
            return new GenerateTestDataOutput { Error = $"Failed to insert data: {ex.Message}" };
        }
    }

    /// <summary>Topologically sorts tables so FK parents come before children.</summary>
    private static List<SchemaTableDetailDto> TopologicalSort(
        List<SchemaTableDetailDto> tables,
        List<SchemaRelationshipDto> relationships)
    {
        var names = new HashSet<string>(tables.Select(t => t.Name), StringComparer.OrdinalIgnoreCase);
        var inDegree = tables.ToDictionary(t => t.Name, _ => 0, StringComparer.OrdinalIgnoreCase);
        var dependents = tables.ToDictionary(t => t.Name, _ => new List<string>(), StringComparer.OrdinalIgnoreCase);

        foreach (var rel in relationships.Where(r => names.Contains(r.FromTable) && names.Contains(r.ToTable)))
        {
            // FromTable depends on ToTable (child -> parent)
            inDegree[rel.FromTable]++;
            dependents[rel.ToTable].Add(rel.FromTable);
        }

        var queue = new Queue<string>(inDegree.Where(kv => kv.Value == 0).Select(kv => kv.Key));
        var sorted = new List<SchemaTableDetailDto>();
        var tableMap = tables.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);

        while (queue.Count > 0)
        {
            var name = queue.Dequeue();
            sorted.Add(tableMap[name]);
            foreach (var dep in dependents[name])
            {
                if (--inDegree[dep] == 0) queue.Enqueue(dep);
            }
        }

        // Append any remaining (cycles) at the end
        foreach (var t in tables.Where(t => !sorted.Any(s => s.Name == t.Name)))
            sorted.Add(t);

        return sorted;
    }

    /// <inheritdoc />
    public async Task<AnalyseQueryOutput> AnalyseAsync(AnalyseQueryInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new AnalyseQueryOutput { Error = "This connection has not been restored to the local database yet." };

        var openAiKey = Environment.GetEnvironmentVariable("OPENAI_KEY");
        if (string.IsNullOrWhiteSpace(openAiKey))
            return new AnalyseQueryOutput { Error = "OPENAI_KEY environment variable is not configured." };

        // 1. Run EXPLAIN ANALYZE to get the execution plan
        List<string> planLines;
        try
        {
            var planResult = await ExecuteAsync(new ExecuteQueryInput
            {
                ConnectionId = input.ConnectionId,
                Sql = $"EXPLAIN ANALYZE {input.Sql}",
            });

            if (planResult.Error != null)
                return new AnalyseQueryOutput { Error = $"Could not run EXPLAIN ANALYZE: {planResult.Error}" };

            planLines = planResult.Rows.Select(r => r.Values.FirstOrDefault()?.ToString() ?? "").ToList();
        }
        catch (Exception ex)
        {
            return new AnalyseQueryOutput { Error = $"Could not run EXPLAIN ANALYZE: {ex.Message}" };
        }

        // 2. Fetch schema for context
        var schema = await GetSchemaAsync(input.ConnectionId);
        var schemaText = string.Join("\n", schema.Select(t =>
            $"  {t.Name}({string.Join(", ", t.Columns)})"));

        // 3. Build the prompt and call OpenAI
        var systemPrompt = """
            You are an expert PostgreSQL performance engineer.
            The user will provide a SQL query, its EXPLAIN ANALYZE output, and the database schema.
            Respond with a JSON object in this exact format (no markdown, no code fences):
            {
              "suggestedQuery": "<optimised SQL or original if already optimal>",
              "explanation": "<concise explanation of issues found and changes made>"
            }
            """;

        var intentSection = string.IsNullOrWhiteSpace(input.Intent)
            ? ""
            : $"\n\nUser intent: {input.Intent}";

        var userMessage = $"""
            SQL query:
            {input.Sql}
            {intentSection}

            EXPLAIN ANALYZE output:
            {string.Join("\n", planLines)}

            Database schema:
            {schemaText}
            """;

        try
        {
            var chatClient = new ChatClient("gpt-4o-mini", openAiKey);
            var response = await chatClient.CompleteChatAsync(
            [
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userMessage),
            ]);

            var content = response.Value.Content[0].Text;
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            return new AnalyseQueryOutput
            {
                ExecutionPlan = planLines,
                SuggestedQuery = root.GetProperty("suggestedQuery").GetString(),
                Explanation = root.GetProperty("explanation").GetString(),
            };
        }
        catch (Exception ex)
        {
            Logger.Error($"[QueryAnalysis] OpenAI call failed: {ex.Message}", ex);
            return new AnalyseQueryOutput
            {
                ExecutionPlan = planLines,
                Error = $"AI analysis failed: {ex.Message}",
            };
        }
    }

    /// <inheritdoc />
    public async Task<BenchmarkOutput> BenchmarkAsync(BenchmarkInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new BenchmarkOutput { Error = "This connection has not been restored to the local database yet." };

        var runs = Math.Clamp(input.Runs, 1, 10);

        try
        {
            var originalTimes = new List<long>(runs);
            var suggestedTimes = new List<long>(runs);

            for (var i = 0; i < runs; i++)
            {
                var originalResult = await ExecuteAsync(new ExecuteQueryInput
                {
                    ConnectionId = input.ConnectionId,
                    Sql = input.OriginalSql,
                });

                if (originalResult.Error != null)
                    return new BenchmarkOutput { Error = $"Original query failed: {originalResult.Error}" };

                originalTimes.Add(originalResult.ExecutionTimeMs);

                var suggestedResult = await ExecuteAsync(new ExecuteQueryInput
                {
                    ConnectionId = input.ConnectionId,
                    Sql = input.SuggestedSql,
                });

                if (suggestedResult.Error != null)
                    return new BenchmarkOutput { Error = $"Suggested query failed: {suggestedResult.Error}" };

                suggestedTimes.Add(suggestedResult.ExecutionTimeMs);
            }

            var originalAvg = (long)originalTimes.Average();
            var suggestedAvg = (long)suggestedTimes.Average();
            var improvement = originalAvg > 0
                ? Math.Round((1.0 - (double)suggestedAvg / originalAvg) * 100, 1)
                : 0;

            return new BenchmarkOutput
            {
                OriginalAvgMs = originalAvg,
                SuggestedAvgMs = suggestedAvg,
                ImprovementPercent = improvement,
            };
        }
        catch (Exception ex)
        {
            Logger.Error($"[Benchmark] Failed for connection {input.ConnectionId}: {ex.Message}", ex);
            return new BenchmarkOutput { Error = ex.Message };
        }
    }

    private async Task<string> GetLocalConnectionStringAsync(Guid connectionId)
    {
        var connection = await _connectionRepository.GetAsync(connectionId);

        if (connection.RestoreStatus != RestoreStatus.Completed ||
            string.IsNullOrWhiteSpace(connection.LocalConnectionString))
            return null;

        return connection.LocalConnectionString;
    }
}
