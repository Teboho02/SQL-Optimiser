using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class BenchmarkInput
{
    [Required]
    public Guid ConnectionId { get; set; }

    [Required]
    public string OriginalSql { get; set; }

    [Required]
    public string SuggestedSql { get; set; }

    /// <summary>Number of times each query is executed; results are averaged. Clamped to 1–10.</summary>
    public int Runs { get; set; } = 3;
}
