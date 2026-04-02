"use client";

import React, { useState, useEffect } from "react";
import { getDashboardStats, IDashboardStatsDto } from "@/services/dashboardService";
import DatabaseCards from "./DatabaseCards/DatabaseCards";
import RecentAnalyses from "./RecentAnalyses/RecentAnalyses";
import ActivityFeed from "./ActivityFeed/ActivityFeed";
import SystemOverviewBottom from "./SystemOverviewBottom/SystemOverviewBottom";

/** Fetches dashboard statistics and distributes them to the stat cards and activity sections. */
const SystemOverviewContent: React.FC = () => {
    const [stats, setStats] = useState<IDashboardStatsDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <DatabaseCards
                totalQueriesRun={stats?.totalQueriesRun ?? 0}
                queriesOptimised={stats?.queriesOptimised ?? 0}
                activeConnections={stats?.activeConnections ?? 0}
                averageImprovementPercent={stats?.averageImprovementPercent ?? null}
                loading={loading}
            />
            <SystemOverviewBottom
                recentAnalyses={<RecentAnalyses activity={stats?.recentActivity ?? []} loading={loading} />}
                activityFeed={<ActivityFeed activity={stats?.recentActivity ?? []} loading={loading} />}
            />
        </>
    );
};

export default SystemOverviewContent;
