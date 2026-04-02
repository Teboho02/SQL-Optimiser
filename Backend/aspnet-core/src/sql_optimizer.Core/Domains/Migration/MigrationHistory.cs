using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;

namespace sql_optimizer.Core.Domains.Migration;

/// <summary>Records a schema migration applied to a live database, including its rollback SQL.</summary>
public class MigrationHistory : FullAuditedEntity<Guid>
{
    [Required]
    public Guid ConnectionId { get; set; }

    [Required]
    [MaxLength(200)]
    public string ConnectionName { get; set; }

    [Required]
    [MaxLength(500)]
    public string RecommendationTitle { get; set; }

    [Required]
    public string MigrationSql { get; set; }

    [Required]
    public string RollbackSql { get; set; }

    public MigrationStatus Status { get; set; } = MigrationStatus.Applied;

    public DateTime? RolledBackAt { get; set; }
}
