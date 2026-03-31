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

    /// <summary>
    /// AI-generates representative query pairs (original + adapted for the new schema),
    /// applies the structural changes inside a transaction, benchmarks both variants
    /// against real data, then rolls back — leaving the database unchanged.
    /// </summary>
    Task<BenchmarkRecommendationOutput> BenchmarkRecommendationAsync(BenchmarkRecommendationInput input);
}
