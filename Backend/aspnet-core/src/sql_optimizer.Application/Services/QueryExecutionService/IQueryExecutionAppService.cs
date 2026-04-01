using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.QueryExecutionService.DTO;

namespace sql_optimizer.Services.QueryExecutionService;

/// <summary>
/// Application service contract for executing SQL queries against a restored local database.
/// </summary>
public interface IQueryExecutionAppService : IApplicationService
{
    /// <summary>
    /// Executes a SQL query against the local copy of the given connection's database.
    /// </summary>
    Task<ExecuteQueryOutput> ExecuteAsync(ExecuteQueryInput input);

    /// <summary>
    /// Returns all user tables and their columns from the local copy of the given connection's database.
    /// </summary>
    Task<List<SchemaTableDto>> GetSchemaAsync(Guid connectionId);

    /// <summary>
    /// Returns all user tables with detailed column metadata (type, nullable, PK, FK) and FK relationships.
    /// </summary>
    Task<SchemaWithRelationshipsDto> GetSchemaWithRelationshipsAsync(Guid connectionId);

    /// <summary>
    /// Uses AI to generate and insert test data into the local database respecting FK constraints.
    /// </summary>
    Task<GenerateTestDataOutput> GenerateTestDataAsync(GenerateTestDataInput input);

    /// <summary>
    /// Runs EXPLAIN ANALYZE on the query, then asks the AI to suggest an optimised version.
    /// </summary>
    Task<AnalyseQueryOutput> AnalyseAsync(AnalyseQueryInput input);

    /// <summary>
    /// Executes both the original and the AI-suggested query N times each and returns averaged timings.
    /// </summary>
    Task<BenchmarkOutput> BenchmarkAsync(BenchmarkInput input);
}
