using System;

namespace sql_optimizer.Services.MigrationHistoryService.DTO;

public class RollbackMigrationInput
{
    /// <summary>ID of the MigrationHistory record to roll back.</summary>
    public Guid MigrationHistoryId { get; set; }
}
