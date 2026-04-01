using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class TableRowCountInput
{
    [Required]
    public string TableName { get; set; }

    [Range(1, 1000)]
    public int RowCount { get; set; } = 10;
}

public class GenerateTestDataInput
{
    [Required]
    public Guid ConnectionId { get; set; }

    [Required]
    public List<TableRowCountInput> Tables { get; set; } = [];
}
