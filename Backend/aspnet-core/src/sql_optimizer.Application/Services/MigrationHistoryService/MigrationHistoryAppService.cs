using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Npgsql;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.Core.Domains.Migration;
using sql_optimizer.Services.MigrationHistoryService.DTO;

namespace sql_optimizer.Services.MigrationHistoryService;

[AbpAuthorize]
public class MigrationHistoryAppService : ApplicationService, IMigrationHistoryAppService
{
    private readonly IRepository<MigrationHistory, Guid> _migrationHistoryRepository;
    private readonly IRepository<DatabaseConnection, Guid> _connectionRepository;

    public MigrationHistoryAppService(
        IRepository<MigrationHistory, Guid> migrationHistoryRepository,
        IRepository<DatabaseConnection, Guid> connectionRepository)
    {
        _migrationHistoryRepository = migrationHistoryRepository;
        _connectionRepository = connectionRepository;
    }

    public async Task<List<MigrationHistoryDto>> GetAllMigrationHistoryAsync()
    {
        var entries = await _migrationHistoryRepository.GetAllListAsync();
        return entries
            .OrderByDescending(m => m.CreationTime)
            .Select(m => ObjectMapper.Map<MigrationHistoryDto>(m))
            .ToList();
    }

    public async Task<RollbackMigrationOutput> RollbackMigrationAsync(RollbackMigrationInput input)
    {
        var record = await _migrationHistoryRepository.GetAsync(input.MigrationHistoryId);

        if (record.Status == MigrationStatus.RolledBack)
            return new RollbackMigrationOutput { Error = "This migration has already been rolled back." };

        if (string.IsNullOrWhiteSpace(record.RollbackSql))
            return new RollbackMigrationOutput { Error = "No rollback SQL is stored for this migration." };

        var connection = await _connectionRepository.GetAsync(record.ConnectionId);
        var liveConnectionString = BuildLiveConnectionString(connection);

        try
        {
            await using var conn = new NpgsqlConnection(liveConnectionString);
            await conn.OpenAsync();
            await using var cmd = new NpgsqlCommand(record.RollbackSql, conn) { CommandTimeout = 120 };
            await cmd.ExecuteNonQueryAsync();

            record.Status = MigrationStatus.RolledBack;
            record.RolledBackAt = DateTime.UtcNow;
            await _migrationHistoryRepository.UpdateAsync(record);
            await CurrentUnitOfWork.SaveChangesAsync();

            Logger.Info($"[MigrationHistory] Rolled back migration {record.Id} for connection {record.ConnectionId}.");
            return new RollbackMigrationOutput { Success = true };
        }
        catch (Exception ex)
        {
            Logger.Error($"[MigrationHistory] Rollback failed for migration {record.Id}: {ex.Message}", ex);
            return new RollbackMigrationOutput { Error = ex.Message };
        }
    }

    private static string BuildLiveConnectionString(DatabaseConnection connection)
    {
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = connection.DbHost,
            Port = connection.DbPort,
            Username = connection.DbUser,
            Password = connection.DbPassword,
            Database = string.IsNullOrWhiteSpace(connection.DatabaseName) ? null : connection.DatabaseName,
        };
        return builder.ConnectionString;
    }
}
