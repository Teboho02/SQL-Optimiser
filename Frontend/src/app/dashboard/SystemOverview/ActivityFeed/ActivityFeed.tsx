"use client";

import React from "react";
import { useStyles } from "../style/styles";

interface IActivityItem {
    id: number;
    text: string;
    time: string;
    dotColor: string;
}

const ACTIVITY_ITEMS: IActivityItem[] = [
    { id: 1, text: "Index idx_user_email created on prod-main", time: "10m ago", dotColor: "#4ade80" },
    { id: 2, text: "Slow query detected (>5s) on prod-analytics", time: "1h ago", dotColor: "#f87171" },
    { id: 3, text: "Schema sync completed for staging-1", time: "2h ago", dotColor: "#22d3ee" },
    { id: 4, text: "New team member invited by Admin", time: "5h ago", dotColor: "#22d3ee" },
];

/** Timestamped list of recent system events with colored status dots. */
const ActivityFeed: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div>
            <h2 className={styles.sectionTitle}>Activity Feed</h2>
            <div className={styles.activityCard}>
                {ACTIVITY_ITEMS.map((item) => (
                    <div key={item.id} className={styles.activityItem}>
                        <div
                            className={styles.activityDot}
                            // sets CSS variable used by the dot class — not a style declaration
                            style={{ "--dot-color": item.dotColor } as React.CSSProperties}
                        />
                        <div>
                            <p className={styles.activityText}>{item.text}</p>
                            <p className={styles.activityTime}>{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
