"use client";

import React from "react";
import { Tag } from "antd";
import { SplitCellsOutlined, PlusOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** Impact level of a schema recommendation. */
type ImpactLevel = "high" | "medium" | "low";

/** A single schema improvement recommendation. */
interface IRecommendation {
    /** Unique identifier. */
    id: string;
    /** Short title of the recommendation. */
    title: string;
    /** Relative impact level. */
    impact: ImpactLevel;
    /** Human-readable description of the problem and proposed fix. */
    description: string;
    /** Estimated downtime string, e.g. "Est. downtime: 0s (Online DDL)". */
    estimatedDowntime: string;
}

interface IRecommendationListProps {
    /** All available recommendations. */
    recommendations: IRecommendation[];
    /** ID of the currently selected recommendation. */
    selectedId: string;
    /** Called when the user selects a recommendation card. */
    onSelect: (id: string) => void;
}

const IMPACT_TAG_COLORS: Record<ImpactLevel, string> = {
    high: "purple",
    medium: "warning",
    low: "default",
};

const IMPACT_LABELS: Record<ImpactLevel, string> = {
    high: "High Impact",
    medium: "Medium Impact",
    low: "Low Impact",
};

const CARD_ICONS: Record<string, React.ReactNode> = {
    split: <SplitCellsOutlined />,
    denormalize: <PlusOutlined />,
};

/** Left panel listing all active schema recommendations as selectable cards. */
const RecommendationList: React.FC<IRecommendationListProps> = ({
    recommendations,
    selectedId,
    onSelect,
}) => {
    const { styles } = useStyles();

    return (
        <div>
            <h2 className={styles.sectionTitle}>Active Recommendations</h2>
            {recommendations.map((recommendation) => {
                const isActive = recommendation.id === selectedId;
                const iconKey = recommendation.id.split("-")[0];
                return (
                    <div
                        key={recommendation.id}
                        className={`${styles.recommendationCard} ${isActive ? styles.recommendationCardActive : ""}`}
                        onClick={() => onSelect(recommendation.id)}
                        role="button"
                        aria-pressed={isActive}
                    >
                        <div className={styles.cardTitleRow}>
                            <span className={styles.cardIcon}>
                                {CARD_ICONS[iconKey] ?? <SplitCellsOutlined />}
                            </span>
                            <span className={styles.cardTitle}>{recommendation.title}</span>
                            <Tag color={IMPACT_TAG_COLORS[recommendation.impact]}>
                                {IMPACT_LABELS[recommendation.impact]}
                            </Tag>
                        </div>
                        <p className={styles.cardDescription}>{recommendation.description}</p>
                        <p className={styles.cardDowntime}>{recommendation.estimatedDowntime}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default RecommendationList;
