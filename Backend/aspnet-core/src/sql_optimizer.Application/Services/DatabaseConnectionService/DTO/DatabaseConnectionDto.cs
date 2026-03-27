using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using sql_optimizer.Core.Domains.Database;

namespace sql_optimizer.Services.DatabaseConnectionService.DTO;

/// <summary>
/// Data transfer object for a saved database connection.
/// </summary>
[AutoMap(typeof(DatabaseConnection))]
public class DatabaseConnectionDto : EntityDto<Guid>
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

    public DatabaseType DatabaseType { get; set; }

    public DateTime LastSyncTime { get; set; }
}
