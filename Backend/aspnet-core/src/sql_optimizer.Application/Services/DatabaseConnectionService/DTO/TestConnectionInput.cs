using System.ComponentModel.DataAnnotations;
using sql_optimizer.Core.Domains.Database;

namespace sql_optimizer.Services.DatabaseConnectionService.DTO;

/// <summary>
/// Input for testing whether a database connection can be established.
/// </summary>
public class TestConnectionInput
{
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

    /// <summary>Whether SSL is required for this connection. Defaults to true.</summary>
    public bool RequireSsl { get; set; } = true;
}
