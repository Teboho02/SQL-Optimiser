"use client";

import React from "react";
import { Spin } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

interface IResultsPanelProps {
    /** Whether analysis is currently running. */
    isAnalysing: boolean;
    /** Whether analysis results are available to display. */
    hasResults: boolean;
    /** Execution plan lines returned by EXPLAIN ANALYZE, or null when not yet run. */
    executionPlan: string[] | null;
    /** Error message from the last analyse run, or null. */
    error: string | null;
}

/** Right panel that shows the empty state, loading state, or analysis results. */
const ResultsPanel: React.FC<IResultsPanelProps> = ({ isAnalysing, hasResults, executionPlan, error }) => {
    const { styles } = useStyles();

    if (isAnalysing) {
        return (
            <div className={styles.resultsPanel}>
                <div className={styles.emptyState}>
                    <div className={styles.spinnerWrapper}>
                        <Spin size="large" />
                    </div>
                    <p className={styles.emptyStateTitle}>Analysing your query...</p>
                    <p className={styles.emptyStateText}>
                        Inspecting execution plan, schema, and generating optimised alternatives.
                    </p>
                </div>
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className={styles.resultsPanel}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <ThunderboltOutlined />
                    </div>
                    <p className={styles.emptyStateTitle}>Ready to optimise</p>
                    <p className={styles.emptyStateText}>
                        Hit Analyse to let the AI engine inspect the execution plan, schema, and rewrite the query.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.resultsPanel}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateTitle} style={{ color: "var(--ant-color-error)" }}>Query Error</p>
                    <pre className={styles.planBlock}>{error}</pre>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.resultsPanel}>
            <div className={styles.planHeader}>Execution Plan</div>
            <pre className={styles.planBlock}>
                {executionPlan?.join("\n")}
            </pre>
        </div>
    );
};

export default ResultsPanel;
