using System;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class ApplyMigrationInput
{
    /// <summary>The saved connection whose live database credentials will be used.</summary>
    public Guid ConnectionId { get; set; }

    /// <summary>The raw PostgreSQL migration SQL to execute against the live database.</summary>
    public string MigrationSql { get; set; }

    /// <summary>The PostgreSQL rollback SQL to store so the migration can be reversed later.</summary>
    public string RollbackSql { get; set; }

    /// <summary>Human-readable title of the recommendation this migration implements.</summary>
    public string RecommendationTitle { get; set; }
}
