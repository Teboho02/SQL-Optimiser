"use client";

import React from "react";
import { Button, Spin } from "antd";
import { ThunderboltOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";
import { IBenchmarkResponse } from "@/services/queryService";

interface IAnalysisResult {
    executionPlan: string[];
    suggestedQuery: string | null;
    explanation: string | null;
}

interface IResultsPanelProps {
    /** Whether analysis is currently running. */
    isAnalysing: boolean;
    /** Whether analysis results are available to display. */
    hasResults: boolean;
    /** Analysis result returned by the AI, or null when not yet run. */
    result: IAnalysisResult | null;
    /** Error message from the last analyse run, or null. */
    error: string | null;
    /** Called when the user clicks Benchmark. */
    onBenchmark: () => void;
    /** Whether the benchmark is currently running. */
    isBenchmarking: boolean;
    /** Benchmark result, or null when not yet run. */
    benchmarkResult: IBenchmarkResponse | null;
    /** Error message from the last benchmark run, or null. */
    benchmarkError: string | null;
}

/** Right panel that shows the empty state, loading state, or analysis results. */
const ResultsPanel: React.FC<IResultsPanelProps> = ({
    isAnalysing,
    hasResults,
    result,
    error,
    onBenchmark,
    isBenchmarking,
    benchmarkResult,
    benchmarkError,
}) => {
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

    if (error) {
        return (
            <div className={styles.resultsPanel}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyStateTitle} style={{ color: "var(--ant-color-error)" }}>Analysis Error</p>
                    <pre className={styles.planBlock}>{error}</pre>
                </div>
            </div>
        );
    }

    if (!hasResults || !result) {
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

    const improvement = benchmarkResult?.improvementPercent ?? 0;
    const improvementColor = improvement > 0
        ? "var(--ant-color-success)"
        : improvement < 0
            ? "var(--ant-color-error)"
            : "var(--ant-color-text-secondary)";
    const improvementLabel = improvement > 0
        ? `${improvement}% faster`
        : improvement < 0
            ? `${Math.abs(improvement)}% slower`
            : "No change";

    return (
        <div className={styles.resultsPanel}>
            {result.explanation && (
                <>
                    <div className={styles.planHeader}>AI Analysis</div>
                    <p className={styles.explanationText}>{result.explanation}</p>
                </>
            )}
            {result.suggestedQuery && (
                <>
                    <div className={styles.planHeader} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Suggested Query</span>
                        <Button
                            size="small"
                            icon={<FieldTimeOutlined />}
                            loading={isBenchmarking}
                            onClick={onBenchmark}
                        >
                            Benchmark
                        </Button>
                    </div>
                    <pre className={styles.planBlock} style={{ flex: "none" }}>{result.suggestedQuery}</pre>
                </>
            )}
            {benchmarkError && (
                <div style={{ padding: "8px 16px", color: "var(--ant-color-error)", fontSize: 13 }}>
                    Benchmark error: {benchmarkError}
                </div>
            )}
            {benchmarkResult && !benchmarkError && (
                <div className={styles.benchmarkCard}>
                    <div className={styles.benchmarkGrid}>
                        <div className={styles.benchmarkCol}>
                            <p className={styles.benchmarkLabel}>Original</p>
                            <p className={styles.benchmarkTime}>{benchmarkResult.originalAvgMs} ms</p>
                        </div>
                        <div className={styles.benchmarkCol}>
                            <p className={styles.benchmarkLabel}>Suggested</p>
                            <p className={styles.benchmarkTime}>{benchmarkResult.suggestedAvgMs} ms</p>
                        </div>
                    </div>
                    <div className={styles.benchmarkImprovement} style={{ color: improvementColor }}>
                        {improvementLabel} (avg of 3 runs)
                    </div>
                </div>
            )}
            {result.executionPlan.length > 0 && (
                <>
                    <div className={styles.planHeader}>Execution Plan</div>
                    <pre className={styles.planBlock}>{result.executionPlan.join("\n")}</pre>
                </>
            )}
        </div>
    );
};

export default ResultsPanel;
