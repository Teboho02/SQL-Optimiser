using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}