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
