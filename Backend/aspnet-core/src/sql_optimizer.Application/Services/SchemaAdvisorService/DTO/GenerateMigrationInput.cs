using System;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class GenerateMigrationInput
{
    public Guid ConnectionId { get; set; }

    /// <summary>
    /// Full JSON of the selected recommendation, as returned by ScanSchemaAsync.
    /// </summary>
    public string RecommendationJson { get; set; }
}
