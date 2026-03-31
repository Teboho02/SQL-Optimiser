using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.SchemaAdvisorHistoryService.DTO;

namespace sql_optimizer.Services.SchemaAdvisorHistoryService;

public interface ISchemaAdvisorHistoryAppService : IApplicationService
{
    /// <summary>Returns all scans ordered newest-first.</summary>
    Task<List<SchemaAdvisorScanDto>> GetAllScansAsync();

    /// <summary>Returns all scans for a specific connection, ordered newest-first.</summary>
    Task<List<SchemaAdvisorScanDto>> GetScansByConnectionAsync(Guid connectionId);

    /// <summary>Saves the result of a schema scan.</summary>
    Task<SchemaAdvisorScanDto> AddScanAsync(SchemaAdvisorScanDto input);

    /// <summary>Deletes a saved scan entry.</summary>
    Task DeleteScanAsync(Guid scanId);
}
