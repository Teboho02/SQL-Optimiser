using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class SchemaTableDto
{
    public string Name { get; set; }
    public List<string> Columns { get; set; } = [];
}
