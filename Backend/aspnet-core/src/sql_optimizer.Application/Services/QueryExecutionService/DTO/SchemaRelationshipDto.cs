namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class SchemaRelationshipDto
{
    public string FromTable { get; set; }
    public string FromColumn { get; set; }
    public string ToTable { get; set; }
    public string ToColumn { get; set; }
}
