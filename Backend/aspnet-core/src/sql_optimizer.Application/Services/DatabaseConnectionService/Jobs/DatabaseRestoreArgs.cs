using System;

namespace sql_optimizer.Services.DatabaseConnectionService.Jobs;

/// <summary>Arguments passed to the database restore background job.</summary>
public class DatabaseRestoreArgs
{
    public Guid ConnectionId { get; set; }
}
