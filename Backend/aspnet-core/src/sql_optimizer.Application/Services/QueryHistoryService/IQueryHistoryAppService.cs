using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.QueryHistoryService.DTO;

namespace sql_optimizer.Services.QueryHistoryService;

public interface IQueryHistoryAppService : IApplicationService
{
    Task<List<QueryHistoryDto>> GetAllQueryHistoryAsync();
    Task<List<QueryHistoryDto>> GetQueryHistoryByConnectionIdAsync(Guid connectionId);
    Task DeleteQueryHistoryEntryAsync(Guid entryId);
    Task AddQueryHistoryEntryAsync(QueryHistoryDto queryHistory);
}
