"use client";

import { Tag } from "antd";
import {
    DatabaseOutlined,
    LineChartOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { useStyles } from "../style/styles";

interface IDatabaseCard {
    name: string;
    status: "Healthy" | "Critical";
    score: number;
    delta: number;
}

interface IAnalysisCard {
    total: number;
    avgTimeSaved: string;
}

const DATABASE_CARDS: IDatabaseCard[] = [
    { name: "prod-main", status: "Healthy", score: 92, delta: 2 },
    { name: "prod-analytics", status: "Critical", score: 45, delta: -12 },
];

const ANALYSIS_CARD: IAnalysisCard = { total: 1284, avgTimeSaved: "420ms" };

/** Three stat cards: two database health scores and a total analyses counter. */
const DatabaseCards: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.cardsRow}>
            {DATABASE_CARDS.map((card) => (
                <div key={card.name} className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <span className={styles.statCardName}>
                            <DatabaseOutlined className={styles.statCardIcon} />
                            {card.name}
                        </span>
                        <Tag color={card.status === "Healthy" ? "success" : "error"}>
                            {card.status}
                        </Tag>
                    </div>
                    <div className={styles.statValue}>
                        {card.score} <span>/ 100</span>
                    </div>
                    <div className={`${styles.statDelta} ${card.delta >= 0 ? styles.deltaPositive : styles.deltaNegative}`}>
                        {card.delta >= 0
                            ? <ArrowUpOutlined />
                            : <ArrowDownOutlined />
                        }
                        {card.delta >= 0 ? `+${card.delta}` : card.delta} from yesterday
                    </div>
                </div>
            ))}

            <div className={styles.statCard}>
                <div className={styles.statCardHeader}>
                    <span className={styles.statCardName}>
                        <LineChartOutlined className={styles.statCardIcon} />
                        Total Analyses
                    </span>
                    <span className={styles.statCardMeta}>This week</span>
                </div>
                <div className={styles.statValueFormatted}>
                    {ANALYSIS_CARD.total.toLocaleString()}
                </div>
                <div className={styles.statSubtext}>
                    <ClockCircleOutlined />
                    Avg time saved: {ANALYSIS_CARD.avgTimeSaved}
                </div>
            </div>
        </div>
    );
};

export default DatabaseCards;
