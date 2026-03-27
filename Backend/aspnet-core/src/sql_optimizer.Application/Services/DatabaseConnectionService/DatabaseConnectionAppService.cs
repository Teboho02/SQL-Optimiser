using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Npgsql;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.Services.DatabaseConnectionService.DTO;

namespace sql_optimizer.Services.DatabaseConnectionService;

/// <summary>
/// Manages CRUD operations for saved database connections and connection testing.
/// ABP automatically exposes this as a REST API.
/// </summary>
[AbpAuthorize]
public class DatabaseConnectionAppService
    : AsyncCrudAppService<DatabaseConnection, DatabaseConnectionDto, Guid>,
      IDatabaseConnectionAppService
{
    public DatabaseConnectionAppService(IRepository<DatabaseConnection, Guid> repository)
        : base(repository)
    {
    }

    /// <summary>
    /// Tests whether a connection can be established using the supplied credentials.
    /// </summary>
    public async Task<TestConnectionOutput> TestConnectionAsync(TestConnectionInput input)
    {
        Logger.Debug($"[TestConnection] Starting connection test. Host={input.DbHost}, Port={input.DbPort}, User={input.DbUser}, Type={input.DatabaseType}");

        if (input.DatabaseType != DatabaseType.PostgreSql)
        {
            Logger.Warn($"[TestConnection] Unsupported database type requested: {input.DatabaseType}");
            return new TestConnectionOutput
            {
                Success = false,
                Message = $"Database type '{input.DatabaseType}' is not yet supported for connection testing."
            };
        }

        return await TestPostgresConnectionAsync(input);
    }

    /// <summary>
    /// Tests the connection first, then saves it if the test passes.
    /// Throws a UserFriendlyException if the connection test fails.
    /// </summary>
    public async Task<DatabaseConnectionDto> SaveConnectionAsync(CreateDatabaseConnectionInput input)
    {
        Logger.Debug($"[SaveConnection] Testing connection before saving. Host={input.DbHost}, User={input.DbUser}");

        var testInput = new TestConnectionInput
        {
            DbHost = input.DbHost,
            DbPort = input.DbPort,
            DbUser = input.DbUser,
            DbPassword = input.DbPassword,
            DatabaseName = input.DatabaseName,
            DatabaseType = input.DatabaseType,
            RequireSsl = input.RequireSsl,
        };

        var testResult = await TestConnectionAsync(testInput);

        if (!testResult.Success)
        {
            Logger.Warn($"[SaveConnection] Connection test failed, aborting save. Host={input.DbHost}. Reason: {testResult.Message}");
            throw new UserFriendlyException("Connection test failed. Please check your credentials.", testResult.Message);
        }

        Logger.Info($"[SaveConnection] Connection test passed. Saving connection '{input.Name}'.");

        var entity = ObjectMapper.Map<DatabaseConnection>(input);
        entity.LastSyncTime = DateTime.UtcNow;

        await Repository.InsertAsync(entity);
        await CurrentUnitOfWork.SaveChangesAsync();

        Logger.Info($"[SaveConnection] Connection '{input.Name}' saved successfully. Id={entity.Id}");

        return ObjectMapper.Map<DatabaseConnectionDto>(entity);
    }

    /// <summary>
    /// Opens and immediately closes a Npgsql connection to verify the credentials.
    /// </summary>
    private async Task<TestConnectionOutput> TestPostgresConnectionAsync(TestConnectionInput input)
    {
        var sslMode = input.RequireSsl ? "Require" : "Disable";
        var database = string.IsNullOrWhiteSpace(input.DatabaseName) ? "postgres" : input.DatabaseName;
        var connectionString = $"Host={input.DbHost};Port={input.DbPort};Database={database};Username={input.DbUser};Password={input.DbPassword};Timeout=5;SSL Mode={sslMode};Trust Server Certificate=true;";

        Logger.Debug($"[TestConnection] Attempting PostgreSQL connection. Host={input.DbHost}, Port={input.DbPort}");

        try
        {
            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            Logger.Info($"[TestConnection] Connection successful. Host={input.DbHost}, Port={input.DbPort}, User={input.DbUser}");
            return new TestConnectionOutput { Success = true, Message = "Connection successful." };
        }
        catch (Exception ex)
        {
            Logger.Error($"[TestConnection] Connection failed. Host={input.DbHost}, Port={input.DbPort}, User={input.DbUser}. Error: {ex.Message}", ex);
            return new TestConnectionOutput { Success = false, Message = ex.Message };
        }
    }
}
