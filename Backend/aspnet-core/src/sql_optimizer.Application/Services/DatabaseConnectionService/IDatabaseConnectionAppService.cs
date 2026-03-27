using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.DatabaseConnectionService.DTO;

namespace sql_optimizer.Services.DatabaseConnectionService;

/// <summary>
/// Application service contract for managing saved database connections.
/// </summary>
public interface IDatabaseConnectionAppService
    : IAsyncCrudAppService<DatabaseConnectionDto, Guid>
{
    /// <summary>
    /// Tests whether a connection can be established using the supplied credentials.
    /// </summary>
    Task<TestConnectionOutput> TestConnectionAsync(TestConnectionInput input);

    /// <summary>
    /// Tests the connection first, then saves it if successful.
    /// Throws a UserFriendlyException if the connection test fails.
    /// </summary>
    Task<DatabaseConnectionDto> SaveConnectionAsync(CreateDatabaseConnectionInput input);
}
