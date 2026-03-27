using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Npgsql;
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
    public async Task<List<SchemaTableDto>> GetSchemaAsync(GetSchemaInput input)
    {
        var connectionString = await GetLocalConnectionStringAsync(input.ConnectionId);
        if (connectionString is null)
            return [];

        try
        {
            await using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            const string sql = """
                SELECT
                    t.table_name,
                    c.column_name
                FROM information_schema.tables t
                JOIN information_schema.columns c
                    ON c.table_schema = t.table_schema
                    AND c.table_name  = t.table_name
                WHERE t.table_schema = 'public'
                  AND t.table_type   = 'BASE TABLE'
                ORDER BY t.table_name, c.ordinal_position;
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
            Logger.Error($"[QueryExecution] Schema fetch failed for connection {input.ConnectionId}: {ex.Message}", ex);
            return [];
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
