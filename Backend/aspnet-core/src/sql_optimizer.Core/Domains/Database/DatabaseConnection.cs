using System;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;

namespace sql_optimizer.Core.Domains.Database;

/// <summary>
/// Represents a saved database connection configuration for a tenant.
/// </summary>
public class DatabaseConnection : FullAuditedEntity<Guid>
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; }

    [Required]
    [MaxLength(200)]
    public string DbHost { get; set; }

    public int DbPort { get; set; }

    [Required]
    [MaxLength(100)]
    public string DbUser { get; set; }

    [Required]
    [MaxLength(500)]
    public string DbPassword { get; set; }

    public DatabaseType DatabaseType { get; set; }

    public DateTime LastSyncTime { get; set; }
}
