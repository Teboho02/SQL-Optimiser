using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class AnalyseQueryInput
{
    [Required]
    public Guid ConnectionId { get; set; }

    [Required]
    public string Sql { get; set; }

    /// <summary>Optional plain-English description of what the query is supposed to do.</summary>
    public string Intent { get; set; }
}
