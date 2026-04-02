using System;
using System.Collections.Generic;

namespace sql_optimizer.Services.DashboardService.DTO;

/// <summary>Aggregated statistics for the dashboard overview page.</summary>
public class DashboardStatsDto
{
    public int TotalQueriesRun { get; set; }
    public int QueriesOptimised { get; set; }
    public int ActiveConnections { get; set; }

    /// <summary>
    /// Average improvement percentage across all benchmark results.
    /// Null when no benchmark results have been recorded.
    /// </summary>
    public double? AverageImprovementPercent { get; set; }

    public List<RecentActivityItemDto> RecentActivity { get; set; } = [];
}

/// <summary>A single recent query entry for the activity feed and recent analyses table.</summary>
public class RecentActivityItemDto
{
    public Guid Id { get; set; }
    public string QueryPreview { get; set; }
    public string ConnectionName { get; set; }
    public bool WasOptimised { get; set; }
    public DateTime Timestamp { get; set; }
}
