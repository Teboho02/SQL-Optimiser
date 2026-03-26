"use client";

import {
    DatabaseOutlined,
    LineChartOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

interface IFeature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FEATURES: IFeature[] = [
    {
        icon: <DatabaseOutlined />,
        title: "Schema-Aware AI",
        description: "Connects to your DB to understand indexes, types, and constraints before suggesting fixes.",
    },
    {
        icon: <LineChartOutlined />,
        title: "Intent Detection",
        description: "Understands what your query is actually trying to do, not just how it is written.",
    },
    {
        icon: <CheckCircleOutlined />,
        title: "Verified Correctness",
        description: "Mathematically proves the new query returns identical results to the original.",
    },
    {
        icon: <ThunderboltOutlined />,
        title: "Index Recommendations",
        description: "Suggests exact CREATE INDEX statements with estimated performance impact.",
    },
];

/** Four-column feature cards highlighting product capabilities. */
const FeaturesSection: React.FC = () => {
    const { styles } = useStyles();

    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {FEATURES.map((feature) => (
                    <div key={feature.title} className={styles.card}>
                        <div className={styles.iconWrapper}>{feature.icon}</div>
                        <h3 className={styles.cardTitle}>{feature.title}</h3>
                        <p className={styles.cardDescription}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
