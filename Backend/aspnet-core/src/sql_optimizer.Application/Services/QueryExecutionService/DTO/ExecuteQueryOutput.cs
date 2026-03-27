using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class ExecuteQueryOutput
{
    public List<string> Columns { get; set; } = [];
    public List<Dictionary<string, object>> Rows { get; set; } = [];
    public int RowsAffected { get; set; }
    public long ExecutionTimeMs { get; set; }
    public string Error { get; set; }
}
