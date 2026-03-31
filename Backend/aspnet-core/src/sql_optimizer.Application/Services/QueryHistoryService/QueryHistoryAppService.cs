using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using sql_optimizer.Core.Domains.QueryHistory;
using sql_optimizer.Services.QueryHistoryService.DTO;

namespace sql_optimizer.Services.QueryHistoryService;

[AbpAuthorize]
public class QueryHistoryAppService : ApplicationService, IQueryHistoryAppService
{
    private readonly IRepository<QueryHistory, Guid> _queryHistoryRepository;

    public QueryHistoryAppService(IRepository<QueryHistory, Guid> queryHistoryRepository)
    {
        _queryHistoryRepository = queryHistoryRepository;
    }

    public async Task<List<QueryHistoryDto>> GetAllQueryHistoryAsync()
    {
        var entries = await _queryHistoryRepository.GetAllListAsync();

        return entries
            .OrderByDescending(q => q.CreationTime)
            .Select(q => ObjectMapper.Map<QueryHistoryDto>(q))
            .ToList();
    }

    public async Task<List<QueryHistoryDto>> GetQueryHistoryByConnectionIdAsync(Guid connectionId)
    {
        var entries = await _queryHistoryRepository.GetAllListAsync(
            q => q.DatabaseConnectionId == connectionId);

        return entries
            .OrderByDescending(q => q.CreationTime)
            .Select(q => ObjectMapper.Map<QueryHistoryDto>(q))
            .ToList();
    }

    public async Task DeleteQueryHistoryEntryAsync(Guid entryId)
    {
        await _queryHistoryRepository.DeleteAsync(entryId);
        await CurrentUnitOfWork.SaveChangesAsync();
        Logger.Info($"[QueryHistory] Deleted entry {entryId}.");
    }

    public async Task AddQueryHistoryEntryAsync(QueryHistoryDto queryHistory)
    {
        var entity = ObjectMapper.Map<QueryHistory>(queryHistory);
        await _queryHistoryRepository.InsertAsync(entity);
        await CurrentUnitOfWork.SaveChangesAsync();
        Logger.Info($"[QueryHistory] Saved history entry for connection {queryHistory.DatabaseConnectionId}.");
    }
}
