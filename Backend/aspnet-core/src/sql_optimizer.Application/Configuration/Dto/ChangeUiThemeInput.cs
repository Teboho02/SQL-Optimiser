using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
