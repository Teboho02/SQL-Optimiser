namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class BenchmarkQueryPair
{
    public string Description { get; set; }
    public string OriginalQuery { get; set; }
    public string AdaptedQuery { get; set; }

    /// <summary>"read" or "write"</summary>
    public string QueryType { get; set; }
}
