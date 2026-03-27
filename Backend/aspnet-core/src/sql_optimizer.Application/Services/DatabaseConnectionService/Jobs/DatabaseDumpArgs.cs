using System;

namespace sql_optimizer.Services.DatabaseConnectionService.Jobs;

/// <summary>Arguments passed to the database dump background job.</summary>
/// 
public class DatabaseDumpArgs
{
    public Guid ConnectionId { get; set; }
}
