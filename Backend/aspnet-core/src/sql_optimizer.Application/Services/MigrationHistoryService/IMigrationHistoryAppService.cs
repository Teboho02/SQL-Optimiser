using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.MigrationHistoryService.DTO;

namespace sql_optimizer.Services.MigrationHistoryService;

public interface IMigrationHistoryAppService : IApplicationService
{
    /// <summary>Returns all applied migration records, newest first.</summary>
    Task<List<MigrationHistoryDto>> GetAllMigrationHistoryAsync();

    /// <summary>Executes the stored rollback SQL and marks the record as rolled back.</summary>
    Task<RollbackMigrationOutput> RollbackMigrationAsync(RollbackMigrationInput input);
}
