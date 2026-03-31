using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Core.Domains.SchemaAdvisor;

public class SchemaAdvisorScan : FullAuditedEntity<Guid>
{
    [Required]
    public Guid DatabaseConnectionId { get; set; }

    /// <summary>
    /// Number of recommendations returned by the scan (0 if the scan errored).
    /// </summary>
    public int RecommendationCount { get; set; }

    /// <summary>
    /// Full JSON of the recommendations array so the session can be restored client-side.
    /// Null when the scan produced an error.
    /// </summary>
    public string RecommendationsJson { get; set; }

    /// <summary>
    /// Error message if the scan failed; null on success.
    /// </summary>
    public string ErrorMessage { get; set; }
}
