using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class GenerateTestDataOutput
{
    public bool Success { get; set; }
    /// <summary>Number of rows inserted per table name.</summary>
    public Dictionary<string, int> InsertedCounts { get; set; } = [];
    public string Error { get; set; }
}
