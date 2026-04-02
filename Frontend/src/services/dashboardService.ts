import { API_CONSTANTS } from "@/constants/ApiConstants";
import { apiFetch } from "@/utils/apiFetch";

/** A single recent query entry for the activity feed and recent analyses table. */
export interface IRecentActivityItemDto {
    id: string;
    queryPreview: string;
    connectionName: string;
    wasOptimised: boolean;
    timestamp: string;
}

/** Aggregated statistics for the dashboard overview page. */
export interface IDashboardStatsDto {
    totalQueriesRun: number;
    queriesOptimised: number;
    activeConnections: number;
    /** Null when no benchmark results have been recorded. */
    averageImprovementPercent: number | null;
    recentActivity: IRecentActivityItemDto[];
}

/** Fetches aggregated dashboard statistics for the current tenant. */
export async function getDashboardStats(): Promise<IDashboardStatsDto> {
    const response = await apiFetch(API_CONSTANTS.GET_DASHBOARD_STATS);
    const json = await response.json();
    return json.result as IDashboardStatsDto;
}
