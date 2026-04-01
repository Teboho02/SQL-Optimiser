using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class SchemaTableDetailDto
{
    public string Name { get; set; }
    public List<SchemaColumnDto> Columns { get; set; } = [];
}
