using System;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class GetBenchmarkPlanInput
{
    public Guid ConnectionId { get; set; }
    public string RecommendationJson { get; set; }
}
