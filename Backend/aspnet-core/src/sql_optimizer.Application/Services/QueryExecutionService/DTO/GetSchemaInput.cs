using System;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class GetSchemaInput
{
    [Required]
    public Guid ConnectionId { get; set; }
}
