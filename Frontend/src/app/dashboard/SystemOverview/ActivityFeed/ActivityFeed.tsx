"use client";

import React from "react";
import { Skeleton } from "antd";
import { useStyles } from "../style/styles";
import { IRecentActivityItemDto } from "@/services/dashboardService";

const OPTIMISED_DOT_COLOR = "#4ade80";
const EXECUTED_DOT_COLOR = "#22d3ee";

interface IActivityFeedProps {
    activity: IRecentActivityItemDto[];
    loading: boolean;
}

/** Timestamped list of recent query activity with colored status dots. */
const ActivityFeed: React.FC<IActivityFeedProps> = ({ activity, loading }) => {
    const { styles } = useStyles();

    return (
        <div>
            <h2 className={styles.sectionTitle}>Activity Feed</h2>
            <div className={styles.activityCard}>
                {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                    activity.map((item) => (
                        <div key={item.id} className={styles.activityItem}>
                            <div
                                className={styles.activityDot}
                                // sets CSS variable used by the dot class — not a style declaration
                                style={{ "--dot-color": item.wasOptimised ? OPTIMISED_DOT_COLOR : EXECUTED_DOT_COLOR } as React.CSSProperties}
                            />
                            <div>
                                <p className={styles.activityText}>
                                    {item.queryPreview} — <strong>{item.connectionName}</strong>
                                </p>
                                <p className={styles.activityTime}>
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
