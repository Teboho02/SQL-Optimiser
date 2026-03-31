using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using sql_optimizer.Core.Domains.SchemaAdvisor;
using sql_optimizer.Services.SchemaAdvisorHistoryService.DTO;

namespace sql_optimizer.Services.SchemaAdvisorHistoryService;

[AbpAuthorize]
public class SchemaAdvisorHistoryAppService : ApplicationService, ISchemaAdvisorHistoryAppService
{
    private readonly IRepository<SchemaAdvisorScan, Guid> _scanRepository;

    public SchemaAdvisorHistoryAppService(IRepository<SchemaAdvisorScan, Guid> scanRepository)
    {
        _scanRepository = scanRepository;
    }

    public async Task<List<SchemaAdvisorScanDto>> GetAllScansAsync()
    {
        var entries = await _scanRepository.GetAllListAsync();
        return entries
            .OrderByDescending(s => s.CreationTime)
            .Select(s => ObjectMapper.Map<SchemaAdvisorScanDto>(s))
            .ToList();
    }

    public async Task<List<SchemaAdvisorScanDto>> GetScansByConnectionAsync(Guid connectionId)
    {
        var entries = await _scanRepository.GetAllListAsync(s => s.DatabaseConnectionId == connectionId);
        return entries
            .OrderByDescending(s => s.CreationTime)
            .Select(s => ObjectMapper.Map<SchemaAdvisorScanDto>(s))
            .ToList();
    }

    public async Task<SchemaAdvisorScanDto> AddScanAsync(SchemaAdvisorScanDto input)
    {
        var entity = ObjectMapper.Map<SchemaAdvisorScan>(input);
        var inserted = await _scanRepository.InsertAsync(entity);
        await CurrentUnitOfWork.SaveChangesAsync();
        Logger.Info($"[SchemaAdvisorHistory] Saved scan for connection {input.DatabaseConnectionId} ({input.RecommendationCount} recommendations).");
        return ObjectMapper.Map<SchemaAdvisorScanDto>(inserted);
    }

    public async Task DeleteScanAsync(Guid scanId)
    {
        await _scanRepository.DeleteAsync(scanId);
        await CurrentUnitOfWork.SaveChangesAsync();
        Logger.Info($"[SchemaAdvisorHistory] Deleted scan {scanId}.");
    }
}
