using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Npgsql;
using OpenAI.Chat;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.Services.SchemaAdvisorService.DTO;

namespace sql_optimizer.Services.SchemaAdvisorService;

/// <summary>
/// Scans a restored local database schema and uses AI to produce normalisation
/// and structural improvement recommendations with migration script generation.
/// </summary>
[AbpAuthorize]
public class SchemaAdvisorAppService : ApplicationService, ISchemaAdvisorAppService
{
    private readonly IRepository<DatabaseConnection, Guid> _connectionRepository;

    public SchemaAdvisorAppService(IRepository<DatabaseConnection, Guid> connectionRepository)
    {
        _connectionRepository = connectionRepository;
    }

    /// <inheritdoc />
    public async Task<ScanSchemaOutput> ScanSchemaAsync(ScanSchemaInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new ScanSchemaOutput { Error = "This connection has not been restored to the local database yet." };

        var openAiKey = Environment.GetEnvironmentVariable("OPENAI_KEY");
        if (string.IsNullOrWhiteSpace(openAiKey))
            return new ScanSchemaOutput { Error = "OPENAI_KEY environment variable is not configured." };

        string schemaContext;
        try
        {
            schemaContext = await BuildSchemaContextAsync(connectionString);
        }
        catch (Exception ex)
        {
            Logger.Error($"[SchemaAdvisor] Schema introspection failed for connection {input.ConnectionId}: {ex.Message}", ex);
            return new ScanSchemaOutput { Error = $"Could not read schema: {ex.Message}" };
        }

        var systemPrompt = """
            You are an expert PostgreSQL database architect specialising in normalisation and performance.
            Analyse the schema provided and return a JSON object with improvement recommendations.
            Respond with ONLY valid JSON — no markdown, no code fences, no extra text.

            Required format:
            {
              "recommendations": [
                {
                  "id": "unique-kebab-case-id",
                  "title": "Action: table_name",
                  "impact": "high|medium|low",
                  "description": "Clear description of the problem and proposed solution.",
                  "estimatedDowntime": "Est. downtime: 0s (Online DDL)",
                  "currentTable": {
                    "label": "table_name (Current)",
                    "variant": "current",
                    "columns": [
                      { "name": "col_name", "type": "data_type", "highlight": "warning|new|null" }
                    ]
                  },
                  "newTables": [
                    {
                      "label": "new_table_name",
                      "variant": "new",
                      "columns": [
                        { "name": "col_name", "type": "data_type", "highlight": "warning|new|null" }
                      ]
                    }
                  ],
                  "metrics": [
                    { "label": "Metric Name", "before": "old_value", "after": "estimated_new_value" }
                  ]
                }
              ]
            }

            Rules:
            - "highlight": "warning" for problematic columns (large types, no index on FK, redundant data).
            - "highlight": "new" for newly introduced columns in the proposed schema.
            - "highlight": null for ordinary columns with no change.
            - Return 2–4 recommendations maximum, ordered by impact descending.
            - Focus on: missing indexes on foreign keys or high-cardinality columns, wide tables with large column types, tables that would benefit from normalisation or a materialised view, columns storing multiple values in a single field.
            - Provide realistic before/after metric estimates based on the row counts and column types visible in the schema.
            """;

        var userMessage = $"Database schema:\n\n{schemaContext}";

        try
        {
            var chatClient = new ChatClient("gpt-4o-mini", openAiKey);
            var response = await chatClient.CompleteChatAsync(
            [
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userMessage),
            ]);

            var content = response.Value.Content[0].Text;
            return ParseScanResponse(content);
        }
        catch (Exception ex)
        {
            Logger.Error($"[SchemaAdvisor] OpenAI call failed for connection {input.ConnectionId}: {ex.Message}", ex);
            return new ScanSchemaOutput { Error = $"AI analysis failed: {ex.Message}" };
        }
    }

    /// <inheritdoc />
    public async Task<GenerateMigrationOutput> GenerateMigrationAsync(GenerateMigrationInput input)
    {
        var openAiKey = Environment.GetEnvironmentVariable("OPENAI_KEY");
        if (string.IsNullOrWhiteSpace(openAiKey))
            return new GenerateMigrationOutput { Error = "OPENAI_KEY environment variable is not configured." };

        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        var dbLabel = connectionString is not null ? "the restored local database" : "the target database";

        var systemPrompt = $"""
            You are an expert PostgreSQL DBA. Generate a complete, production-safe migration script for the recommendation below.
            The script will run against {dbLabel}.

            Requirements:
            - Use a transaction (BEGIN / COMMIT).
            - Include a rollback section commented out at the bottom.
            - Use CREATE TABLE IF NOT EXISTS and ALTER TABLE ... ADD COLUMN IF NOT EXISTS where applicable.
            - Include CREATE INDEX CONCURRENTLY for new indexes so the migration is online with zero downtime.
            - Add inline SQL comments explaining each step.
            - Output ONLY the raw SQL — no markdown, no code fences, no extra explanation.
            """;

        var userMessage = $"Recommendation:\n{input.RecommendationJson}";

        try
        {
            var chatClient = new ChatClient("gpt-4o-mini", openAiKey);
            var response = await chatClient.CompleteChatAsync(
            [
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(userMessage),
            ]);

            return new GenerateMigrationOutput { MigrationSql = response.Value.Content[0].Text };
        }
        catch (Exception ex)
        {
            Logger.Error($"[SchemaAdvisor] Migration generation failed: {ex.Message}", ex);
            return new GenerateMigrationOutput { Error = $"Migration generation failed: {ex.Message}" };
        }
    }

    /// <inheritdoc />
    public async Task<BenchmarkRecommendationOutput> BenchmarkRecommendationAsync(BenchmarkRecommendationInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return new BenchmarkRecommendationOutput { Error = "This connection has not been restored to the local database yet." };

        var openAiKey = Environment.GetEnvironmentVariable("OPENAI_KEY");
        if (string.IsNullOrWhiteSpace(openAiKey))
            return new BenchmarkRecommendationOutput { Error = "OPENAI_KEY environment variable is not configured." };

        // Step 1 — Ask AI to generate benchmark DDL + representative query pairs
        var aiResult = await GenerateBenchmarkPlanAsync(input.RecommendationJson, openAiKey);
        if (aiResult.Error != null)
            return new BenchmarkRecommendationOutput { Error = aiResult.Error };

        var runs = Math.Clamp(input.Runs, 1, 5);
        var results = new List<QueryPairResult>();

        await using var conn = new NpgsqlConnection(connectionString);
        await conn.OpenAsync();

        // Step 2 — Baseline: run all original queries on the unmodified schema
        foreach (var pair in aiResult.QueryPairs)
        {
            var result = new QueryPairResult
            {
                Description = pair.Description,
                OriginalQuery = pair.OriginalQuery,
                AdaptedQuery = pair.AdaptedQuery,
            };

            try
            {
                var times = new List<long>(runs);
                for (var i = 0; i < runs; i++)
                {
                    var sw = Stopwatch.StartNew();
                    await using var cmd = new NpgsqlCommand(pair.OriginalQuery, conn) { CommandTimeout = 30 };
                    await using var reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync()) { }
                    sw.Stop();
                    times.Add(sw.ElapsedMilliseconds);
                }
                result.OriginalAvgMs = times.Average();
            }
            catch (Exception ex)
            {
                result.Error = $"Original query failed: {ex.Message}";
            }

            results.Add(result);
        }

        // Step 3 — Apply benchmark DDL inside a transaction, run adapted queries, then ROLLBACK
        await using var tx = await conn.BeginTransactionAsync();
        try
        {
            await using var ddlCmd = new NpgsqlCommand(aiResult.BenchmarkDdl, conn, tx) { CommandTimeout = 60 };
            await ddlCmd.ExecuteNonQueryAsync();

            foreach (var result in results.Where(r => r.Error is null))
            {
                try
                {
                    var times = new List<long>(runs);
                    for (var i = 0; i < runs; i++)
                    {
                        var sw = Stopwatch.StartNew();
                        await using var cmd = new NpgsqlCommand(result.AdaptedQuery, conn, tx) { CommandTimeout = 30 };
                        await using var reader = await cmd.ExecuteReaderAsync();
                        while (await reader.ReadAsync()) { }
                        sw.Stop();
                        times.Add(sw.ElapsedMilliseconds);
                    }
                    result.AdaptedAvgMs = times.Average();
                    result.ImprovementPercent = result.OriginalAvgMs > 0
                        ? Math.Round((1.0 - result.AdaptedAvgMs / result.OriginalAvgMs) * 100, 1)
                        : 0;
                }
                catch (Exception ex)
                {
                    result.Error = $"Adapted query failed: {ex.Message}";
                }
            }
        }
        catch (Exception ex)
        {
            Logger.Error($"[SchemaAdvisor] Benchmark DDL failed: {ex.Message}", ex);
            foreach (var r in results.Where(r => r.Error is null))
                r.Error = $"Schema migration for benchmark failed: {ex.Message}";
        }
        finally
        {
            // Always rollback — the database must be left unchanged
            await tx.RollbackAsync();
            Logger.Info($"[SchemaAdvisor] Benchmark transaction rolled back for connection {input.ConnectionId}.");
        }

        return new BenchmarkRecommendationOutput { Results = results };
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private record BenchmarkPlan(string BenchmarkDdl, List<QueryPair> QueryPairs, string Error = null);
    private record QueryPair(string Description, string OriginalQuery, string AdaptedQuery);

    private async Task<BenchmarkPlan> GenerateBenchmarkPlanAsync(string recommendationJson, string openAiKey)
    {
        var systemPrompt = """
            You are an expert PostgreSQL DBA and query optimiser.

            Given a schema recommendation, produce TWO things and return ONLY valid JSON (no markdown, no code fences):

            1. "benchmarkDdl": SQL that sets up the proposed schema INSIDE an already-open transaction.
               Rules for the DDL:
               - Use regular CREATE INDEX (NOT CONCURRENTLY) so it can run inside a transaction.
               - Do NOT include BEGIN, COMMIT, or ROLLBACK — the transaction is managed externally.
               - Create all new tables from the recommendation.
               - Populate new tables with data migrated from existing tables using INSERT INTO ... SELECT.
               - Apply any ALTER TABLE changes (e.g. drop redundant columns) AFTER data migration.
               - The goal is a realistic schema state so JOIN queries return actual rows.

            2. "queryPairs": 2–3 representative queries that demonstrate the performance difference.
               Each pair MUST include at least one JOIN query.
               Rules:
               - "originalQuery": a SELECT that works on the CURRENT schema (before DDL).
               - "adaptedQuery": the equivalent SELECT adapted to the NEW schema (after DDL), using JOINs where the schema was split.
               - Both queries must be safe read-only SELECTs with a LIMIT 500 clause.
               - "description": one sentence explaining what the query tests.

            Return exactly:
            {
              "benchmarkDdl": "<sql string>",
              "queryPairs": [
                {
                  "description": "...",
                  "originalQuery": "SELECT ... LIMIT 500;",
                  "adaptedQuery": "SELECT ... JOIN ... LIMIT 500;"
                }
              ]
            }
            """;

        var userMessage = $"Recommendation:\n{recommendationJson}";

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

            var ddl = root.GetProperty("benchmarkDdl").GetString();
            var pairs = root.GetProperty("queryPairs").EnumerateArray()
                .Select(p => new QueryPair(
                    p.GetProperty("description").GetString(),
                    p.GetProperty("originalQuery").GetString(),
                    p.GetProperty("adaptedQuery").GetString()))
                .ToList();

            return new BenchmarkPlan(ddl, pairs);
        }
        catch (Exception ex)
        {
            Logger.Error($"[SchemaAdvisor] Benchmark plan generation failed: {ex.Message}", ex);
            return new BenchmarkPlan(null, null, $"AI failed to generate benchmark plan: {ex.Message}");
        }
    }

    private async Task<string> BuildSchemaContextAsync(string connectionString)
    {
        await using var conn = new NpgsqlConnection(connectionString);
        await conn.OpenAsync();

        var tables = await FetchColumnsAsync(conn);
        var indexes = await FetchIndexesAsync(conn);
        var foreignKeys = await FetchForeignKeysAsync(conn);
        var rowCounts = await FetchRowCountsAsync(conn);

        var sb = new StringBuilder();

        sb.AppendLine("=== Tables and Columns ===");
        foreach (var (tableName, columns) in tables)
        {
            sb.AppendLine($"{tableName}:");
            foreach (var (colName, colType, isNullable) in columns)
                sb.AppendLine($"  - {colName}: {colType}{(isNullable == "YES" ? " (nullable)" : "")}");
        }

        sb.AppendLine("\n=== Existing Indexes ===");
        if (indexes.Count == 0)
        {
            sb.AppendLine("  (none found)");
        }
        else
        {
            foreach (var (tableName, indexName, columns, isUnique) in indexes)
                sb.AppendLine($"  {tableName}: {indexName} ({columns}){(isUnique ? " [UNIQUE]" : "")}");
        }

        sb.AppendLine("\n=== Foreign Keys ===");
        if (foreignKeys.Count == 0)
        {
            sb.AppendLine("  (none found)");
        }
        else
        {
            foreach (var (table, col, refTable, refCol) in foreignKeys)
                sb.AppendLine($"  {table}.{col} → {refTable}.{refCol}");
        }

        sb.AppendLine("\n=== Approximate Row Counts ===");
        foreach (var (tableName, rowEstimate) in rowCounts)
            sb.AppendLine($"  {tableName}: ~{rowEstimate:N0} rows");

        return sb.ToString();
    }

    private static async Task<Dictionary<string, List<(string Name, string Type, string Nullable)>>> FetchColumnsAsync(NpgsqlConnection conn)
    {
        const string sql = """
            SELECT
                CASE WHEN t.table_schema = 'public' THEN t.table_name
                     ELSE t.table_schema || '.' || t.table_name
                END AS table_name,
                c.column_name,
                c.udt_name,
                c.is_nullable
            FROM information_schema.tables t
            JOIN information_schema.columns c
                ON c.table_schema = t.table_schema AND c.table_name = t.table_name
            WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
              AND t.table_schema NOT LIKE 'pg_temp_%'
              AND t.table_type = 'BASE TABLE'
            ORDER BY t.table_schema, t.table_name, c.ordinal_position;
            """;

        await using var cmd = new NpgsqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var result = new Dictionary<string, List<(string, string, string)>>();
        while (await reader.ReadAsync())
        {
            var table = reader.GetString(0);
            var col = reader.GetString(1);
            var type = reader.GetString(2);
            var nullable = reader.GetString(3);

            if (!result.TryGetValue(table, out var cols))
            {
                cols = new List<(string, string, string)>();
                result[table] = cols;
            }

            cols.Add((col, type, nullable));
        }

        return result;
    }

    private static async Task<List<(string Table, string Index, string Columns, bool IsUnique)>> FetchIndexesAsync(NpgsqlConnection conn)
    {
        const string sql = """
            SELECT
                t.relname AS table_name,
                i.relname AS index_name,
                string_agg(a.attname, ', ' ORDER BY x.n) AS columns,
                ix.indisunique AS is_unique
            FROM pg_class t
            JOIN pg_index ix ON t.oid = ix.indrelid
            JOIN pg_class i ON i.oid = ix.indexrelid
            JOIN pg_namespace n ON n.oid = t.relnamespace
            JOIN LATERAL unnest(ix.indkey) WITH ORDINALITY AS x(attnum, n) ON TRUE
            JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = x.attnum
            WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
              AND t.relkind = 'r'
              AND NOT ix.indisprimary
            GROUP BY t.relname, i.relname, ix.indisunique
            ORDER BY t.relname, i.relname;
            """;

        await using var cmd = new NpgsqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var result = new List<(string, string, string, bool)>();
        while (await reader.ReadAsync())
            result.Add((reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetBoolean(3)));

        return result;
    }

    private static async Task<List<(string Table, string Col, string RefTable, string RefCol)>> FetchForeignKeysAsync(NpgsqlConnection conn)
    {
        const string sql = """
            SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY tc.table_name;
            """;

        await using var cmd = new NpgsqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var result = new List<(string, string, string, string)>();
        while (await reader.ReadAsync())
            result.Add((reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3)));

        return result;
    }

    private static async Task<List<(string Table, long Rows)>> FetchRowCountsAsync(NpgsqlConnection conn)
    {
        const string sql = """
            SELECT c.relname, c.reltuples::bigint
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
              AND c.relkind = 'r'
            ORDER BY c.reltuples DESC;
            """;

        await using var cmd = new NpgsqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        var result = new List<(string, long)>();
        while (await reader.ReadAsync())
            result.Add((reader.GetString(0), reader.GetInt64(1)));

        return result;
    }

    private static ScanSchemaOutput ParseScanResponse(string content)
    {
        using var doc = JsonDocument.Parse(content);
        var root = doc.RootElement;

        var recommendations = new List<RecommendationDto>();

        foreach (var rec in root.GetProperty("recommendations").EnumerateArray())
        {
            var currentTableEl = rec.GetProperty("currentTable");
            var recommendation = new RecommendationDto
            {
                Id = rec.GetProperty("id").GetString(),
                Title = rec.GetProperty("title").GetString(),
                Impact = rec.GetProperty("impact").GetString(),
                Description = rec.GetProperty("description").GetString(),
                EstimatedDowntime = rec.GetProperty("estimatedDowntime").GetString(),
                CurrentTable = ParseTableDef(currentTableEl),
                NewTables = rec.GetProperty("newTables").EnumerateArray()
                    .Select(ParseTableDef).ToList(),
                Metrics = rec.GetProperty("metrics").EnumerateArray()
                    .Select(m => new MetricDto
                    {
                        Label = m.GetProperty("label").GetString(),
                        Before = m.GetProperty("before").GetString(),
                        After = m.GetProperty("after").GetString(),
                    }).ToList(),
            };

            recommendations.Add(recommendation);
        }

        return new ScanSchemaOutput { Recommendations = recommendations };
    }

    private static SchemaTableDefDto ParseTableDef(JsonElement el)
    {
        return new SchemaTableDefDto
        {
            Label = el.GetProperty("label").GetString(),
            Variant = el.GetProperty("variant").GetString(),
            Columns = el.GetProperty("columns").EnumerateArray().Select(c => new SchemaColumnDto
            {
                Name = c.GetProperty("name").GetString(),
                Type = c.GetProperty("type").GetString(),
                Highlight = c.TryGetProperty("highlight", out var h) && h.ValueKind != JsonValueKind.Null
                    ? h.GetString()
                    : null,
            }).ToList(),
        };
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
