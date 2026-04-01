using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class SchemaWithRelationshipsDto
{
    public List<SchemaTableDetailDto> Tables { get; set; } = [];
    public List<SchemaRelationshipDto> Relationships { get; set; } = [];
}
