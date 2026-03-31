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
    /// Asks the AI to generate a benchmark DDL and representative read + write query pairs
    /// for the user to review and edit before running.
    /// </summary>
    Task<GetBenchmarkPlanOutput> GetBenchmarkPlanAsync(GetBenchmarkPlanInput input);

    /// <summary>
    /// Runs the benchmark using user-confirmed query pairs.
    /// Applies the DDL inside a transaction, measures read and write performance on both schemas,
    /// uses savepoints to undo write test data, then rolls back — leaving the database unchanged.
    /// Returns per-query results and a weighted overall improvement score.
    /// </summary>
    Task<BenchmarkRecommendationOutput> BenchmarkRecommendationAsync(BenchmarkRecommendationInput input);
}
