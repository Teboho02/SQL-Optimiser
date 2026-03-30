using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.DatabaseConnectionService.DTO;

/// <summary>
/// Input for updating the editable settings of an existing connection —
/// currently DatabaseName and SchemaOnly.
/// </summary>
public class UpdateConnectionSettingsInput
{
    [Required]
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string DatabaseName { get; set; }

    public bool SchemaOnly { get; set; }
}
