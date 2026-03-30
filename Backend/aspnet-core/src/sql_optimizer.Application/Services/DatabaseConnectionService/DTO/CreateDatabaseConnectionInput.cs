using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;
using sql_optimizer.Core.Domains.Database;

namespace sql_optimizer.Services.DatabaseConnectionService.DTO;

/// <summary>
/// Input for creating a new database connection. Includes the password field
/// which is intentionally excluded from read DTOs.
/// </summary>
[AutoMap(typeof(DatabaseConnection))]
public class CreateDatabaseConnectionInput
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

    [MaxLength(100)]
    public string DatabaseName { get; set; }

    public DatabaseType DatabaseType { get; set; }

    /// <summary>Whether SSL is required for this connection.</summary>
    public bool RequireSsl { get; set; } = true;

    /// <summary>When true, only the schema (DDL) is dumped — no row data.</summary>
    public bool SchemaOnly { get; set; } = false;
}
