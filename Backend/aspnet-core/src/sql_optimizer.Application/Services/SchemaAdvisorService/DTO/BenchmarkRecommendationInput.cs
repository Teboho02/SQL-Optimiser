using System;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class BenchmarkRecommendationInput
{
    public Guid ConnectionId { get; set; }

    /// <summary>
    /// Full JSON of the selected recommendation, as returned by ScanSchemaAsync.
    /// </summary>
    public string RecommendationJson { get; set; }

    /// <summary>
    /// Number of times each query is executed per schema variant. Clamped to 1–5. Defaults to 3.
    /// </summary>
    public int Runs { get; set; } = 3;
}
