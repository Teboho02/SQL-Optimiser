"use client";

import { Skeleton } from "antd";
import {
    BarChartOutlined,
    ThunderboltOutlined,
    ApiOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import React from "react";
import { useStyles } from "../style/styles";

interface IDatabaseCardsProps {
    totalQueriesRun: number;
    queriesOptimised: number;
    activeConnections: number;
    averageImprovementPercent: number | null;
    loading: boolean;
}

/** Four stat cards showing total queries, optimised queries, active connections, and avg improvement. */
const DatabaseCards: React.FC<IDatabaseCardsProps> = ({
    totalQueriesRun,
    queriesOptimised,
    activeConnections,
    averageImprovementPercent,
    loading,
}) => {
    const { styles } = useStyles();

    if (loading) {
        return (
            <div className={styles.cardsRow}>
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={styles.statCard}>
                        <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 1 }} />
                    </div>
                ))}
            </div>
        );
    }

    const improvementDisplay = averageImprovementPercent !== null
        ? `${averageImprovementPercent}%`
        : "N/A";

    return (
        <div className={styles.cardsRow}>
            <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                    <span className={styles.statCardName}>
                        <BarChartOutlined className={styles.statCardIcon} />
                        Total Queries Run
                    </span>
                </div>
                <div className={styles.statValueFormatted}>
                    {totalQueriesRun.toLocaleString()}
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                    <span className={styles.statCardName}>
                        <ThunderboltOutlined className={styles.statCardIcon} />
                        Queries Optimised
                    </span>
                </div>
                <div className={styles.statValueFormatted}>
                    {queriesOptimised.toLocaleString()}
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                    <span className={styles.statCardName}>
                        <ApiOutlined className={styles.statCardIcon} />
                        Active Connections
                    </span>
                </div>
                <div className={styles.statValueFormatted}>
                    {activeConnections.toLocaleString()}
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                    <span className={styles.statCardName}>
                        <RiseOutlined className={styles.statCardIcon} />
                        Avg Improvement
                    </span>
                </div>
                <div className={styles.statValueFormatted}>
                    {improvementDisplay}
                </div>
            </div>
        </div>
    );
};

export default DatabaseCards;
