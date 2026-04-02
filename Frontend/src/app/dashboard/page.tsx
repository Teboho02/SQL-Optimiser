import React from "react";
import AlertBanner from "./SystemOverview/AlertBanner/AlertBanner";
import SystemOverviewContent from "./SystemOverview/SystemOverviewContent";
import SystemOverviewHeader from "./SystemOverview/SystemOverviewHeader/SystemOverviewHeader";

/** Dashboard main content — System Overview page. */
export default function DashboardPage(): React.JSX.Element {
    return (
        <>
            <SystemOverviewHeader />
            <SystemOverviewContent />
        </>
    );
}
