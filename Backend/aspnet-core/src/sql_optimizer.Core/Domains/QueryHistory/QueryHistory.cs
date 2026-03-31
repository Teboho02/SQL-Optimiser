using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System;

namespace sql_optimizer.Core.Domains.QueryHistory;

public class QueryHistory : FullAuditedEntity<Guid>
{
    [Required]
    public Guid DatabaseConnectionId { get; set; }

    [Required]
    public string QueryText { get; set; }

    public string SuggestedQuery { get; set; }

    public string ResultSummary { get; set; }

    public string ErrorMessage { get; set; } = null;

    public TimeSpan ExecutionTime { get; set; }

}