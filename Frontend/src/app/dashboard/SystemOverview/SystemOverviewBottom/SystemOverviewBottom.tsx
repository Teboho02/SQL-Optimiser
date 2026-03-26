"use client";

import React from "react";
import { useStyles } from "../style/styles";

interface ISystemOverviewBottomProps {
    recentAnalyses: React.ReactNode;
    activityFeed: React.ReactNode;
}

/** Two-column layout wrapper for Recent Analyses (left) and Activity Feed (right). */
const SystemOverviewBottom: React.FC<ISystemOverviewBottomProps> = ({ recentAnalyses, activityFeed }) => {
    const { styles } = useStyles();

    return (
        <div className={styles.bottomRow}>
            {recentAnalyses}
            {activityFeed}
        </div>
    );
};

export default SystemOverviewBottom;
