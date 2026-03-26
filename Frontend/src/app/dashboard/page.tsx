import AlertBanner from "./SystemOverview/AlertBanner/AlertBanner";
import DatabaseCards from "./SystemOverview/DatabaseCards/DatabaseCards";
import RecentAnalyses from "./SystemOverview/RecentAnalyses/RecentAnalyses";
import ActivityFeed from "./SystemOverview/ActivityFeed/ActivityFeed";
import SystemOverviewHeader from "./SystemOverview/SystemOverviewHeader/SystemOverviewHeader";
import SystemOverviewBottom from "./SystemOverview/SystemOverviewBottom/SystemOverviewBottom";

/** Dashboard main content — System Overview page. */
export default function DashboardPage(): React.JSX.Element {
    return (
        <>
            <SystemOverviewHeader />
            <AlertBanner />
            <DatabaseCards />
            <SystemOverviewBottom
                recentAnalyses={<RecentAnalyses />}
                activityFeed={<ActivityFeed />}
            />
        </>
    );
}
