using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.Core.Domains.QueryHistory;
using sql_optimizer.Services.DashboardService.DTO;

namespace sql_optimizer.Services.DashboardService;

/// <summary>Aggregates data for the dashboard overview page.</summary>
[AbpAuthorize]
public class DashboardAppService : ApplicationService, IDashboardAppService
{
    private const int RecentActivityCount = 10;

    private readonly IRepository<QueryHistory, Guid> _queryHistoryRepository;
    private readonly IRepository<DatabaseConnection, Guid> _connectionRepository;

    public DashboardAppService(
        IRepository<QueryHistory, Guid> queryHistoryRepository,
        IRepository<DatabaseConnection, Guid> connectionRepository)
    {
        _queryHistoryRepository = queryHistoryRepository;
        _connectionRepository = connectionRepository;
    }

    /// <summary>Returns aggregated dashboard statistics and recent activity for the current tenant.</summary>
    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var historyEntries = await _queryHistoryRepository.GetAllListAsync();
        var connections = await _connectionRepository.GetAllListAsync();

        var connectionNameMap = connections.ToDictionary(c => c.Id, c => c.Name);
        var activeConnections = connections.Count(c => c.RestoreStatus == RestoreStatus.Completed);

        var totalQueriesRun = historyEntries.Count;
        var queriesOptimised = historyEntries.Count(q => !string.IsNullOrWhiteSpace(q.SuggestedQuery));

        var recentActivity = historyEntries
            .OrderByDescending(q => q.CreationTime)
            .Take(RecentActivityCount)
            .Select(q => new RecentActivityItemDto
            {
                Id = q.Id,
                QueryPreview = TruncateQuery(q.QueryText),
                ConnectionName = connectionNameMap.TryGetValue(q.DatabaseConnectionId, out var name) ? name : "Unknown",
                WasOptimised = !string.IsNullOrWhiteSpace(q.SuggestedQuery),
                Timestamp = q.CreationTime,
            })
            .ToList();

        return new DashboardStatsDto
        {
            TotalQueriesRun = totalQueriesRun,
            QueriesOptimised = queriesOptimised,
            ActiveConnections = activeConnections,
            AverageImprovementPercent = null, // populated once benchmark results are persisted
            RecentActivity = recentActivity,
        };
    }

    /// <summary>Truncates a SQL query to a short single-line preview string.</summary>
    private static string TruncateQuery(string query)
    {
        const int maxLength = 60;
        if (string.IsNullOrWhiteSpace(query)) {
            return "";
        }
        var singleLine = query.Replace('\n', ' ').Replace('\r', ' ');
        return singleLine.Length <= maxLength ? singleLine : singleLine[..maxLength] + "...";
    }
}
