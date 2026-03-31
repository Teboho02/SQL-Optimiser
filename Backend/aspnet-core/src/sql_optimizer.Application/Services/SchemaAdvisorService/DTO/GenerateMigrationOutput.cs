namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class GenerateMigrationOutput
{
    public string MigrationSql { get; set; }
    public string Error { get; set; }
}
