using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class ExecuteQueryInput
{
    [Required]
    public Guid ConnectionId { get; set; }

    [Required]
    public string Sql { get; set; }
}
