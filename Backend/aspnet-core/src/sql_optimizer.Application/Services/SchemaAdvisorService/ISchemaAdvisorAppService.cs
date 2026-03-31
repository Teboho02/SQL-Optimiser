using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.SchemaAdvisorService.DTO;

namespace sql_optimizer.Services.SchemaAdvisorService;

public interface ISchemaAdvisorAppService : IApplicationService
{
    /// <summary>
    /// Introspects the schema of the restored local database, then uses AI to produce
    /// normalisation and structural improvement recommendations.
    /// </summary>
    Task<ScanSchemaOutput> ScanSchemaAsync(ScanSchemaInput input);

    /// <summary>
    /// Generates a PostgreSQL migration script for the supplied recommendation.
    /// </summary>
    Task<GenerateMigrationOutput> GenerateMigrationAsync(GenerateMigrationInput input);
}
