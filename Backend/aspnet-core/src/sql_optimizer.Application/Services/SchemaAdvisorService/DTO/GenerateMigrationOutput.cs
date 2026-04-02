namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class GenerateMigrationOutput
{
    public string MigrationSql { get; set; }
    public string EfCoreMigration { get; set; }
    public string RollbackSql { get; set; }
    public string Error { get; set; }
}
