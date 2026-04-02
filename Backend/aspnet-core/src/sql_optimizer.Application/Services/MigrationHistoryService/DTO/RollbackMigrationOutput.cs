namespace sql_optimizer.Services.MigrationHistoryService.DTO;

public class RollbackMigrationOutput
{
    public bool Success { get; set; }
    public string Error { get; set; }
}
