"use client";

import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** Execution result information for a completed query run. */
interface IExecutionInfo {
    /** Whether the query succeeded, failed, or has not yet been run. */
    status: "success" | "error" | "idle";
    /** Execution time in milliseconds, or null when idle. */
    executionTimeMs: number | null;
    /** Query plan summary text, or null when idle. */
    queryPlan: string | null;
}

interface IExecutionInfoPanelProps {
    /** Execution info to display. */
    executionInfo: IExecutionInfo;
}

/** Right panel displaying query execution status, timing, and query plan summary. */
const ExecutionInfoPanel: React.FC<IExecutionInfoPanelProps> = ({ executionInfo }) => {
    const { styles } = useStyles();
    const isIdle = executionInfo.status === "idle";

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <CaretRightOutlined />
                Execution Info
            </div>
            {isIdle ? (
                <div className={styles.idleState}>
                    Run a query to see execution details
                </div>
            ) : (
                <div className={styles.infoSection}>
                    <p className={styles.infoLabel}>Status</p>
                    <div className={styles.statusRow}>
                        <span className={styles.statusDot} />
                        {executionInfo.status === "success" ? "Success" : "Error"}
                    </div>
                    {executionInfo.executionTimeMs !== null && (
                        <>
                            <p className={styles.infoLabel}>Execution Time</p>
                            <p className={styles.executionTimeValue}>{executionInfo.executionTimeMs}ms</p>
                        </>
                    )}
                    {executionInfo.queryPlan && (
                        <>
                            <p className={styles.infoLabel}>Query Plan Summary</p>
                            <pre className={styles.queryPlanBlock}>{executionInfo.queryPlan}</pre>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExecutionInfoPanel;
