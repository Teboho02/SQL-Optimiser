"use client";

import { RightOutlined, ThunderboltFilled } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

const ORIGINAL_QUERY = `SELECT u.*, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id;`;

const OPTIMISED_QUERY = `SELECT u.*, o.order_count
FROM users u
LEFT JOIN LATERAL (
    SELECT COUNT(id) as order_count
    FROM orders
    WHERE user_id = u.id
) o ON true
WHERE u.status = 'active';`;

interface IStatItem {
    value: string;
    label: string;
    colorClass: "cyan" | "green";
}

const STATS: IStatItem[] = [
    { value: "99%", label: "Faster Execution", colorClass: "cyan" },
    { value: "175×", label: "Fewer Rows Scanned", colorClass: "cyan" },
    { value: "100%", label: "Verified Correctness", colorClass: "green" },
];

/** Side-by-side SQL demo showing original vs optimised query with performance metrics. */
const DemoSection: React.FC = () => {
    const { styles } = useStyles();

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <div className={styles.cardsRow}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Original Query</span>
                            <span className={styles.badgeSlow}>↑ 4823ms</span>
                        </div>
                        <pre className={styles.codeBlock}>{ORIGINAL_QUERY}</pre>
                    </div>
                    <div className={styles.arrowDivider}>
                        <RightOutlined />
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitleOptimised}>
                                <ThunderboltFilled className={styles.optimisedIcon} />
                                Optimised
                            </span>
                            <span className={styles.badgeFast}>↓ 47ms</span>
                        </div>
                        <pre className={styles.codeBlock}>{OPTIMISED_QUERY}</pre>
                    </div>
                </div>
                <div className={styles.statsRow}>
                    {STATS.map((stat) => (
                        <div key={stat.label} className={styles.statItem}>
                            <span className={`${styles.statValue} ${stat.colorClass === "cyan" ? styles.statValueCyan : styles.statValueGreen}`}>
                                {stat.value}
                            </span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DemoSection;
