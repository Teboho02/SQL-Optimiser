"use client";

import React from "react";
import { Button, Table, Spin } from "antd";
import { CaretRightFilled } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** Query result data returned from execution. */
interface IQueryResult {
    /** Ordered column names (uppercase). */
    columns: string[];
    /** Result rows keyed by column name. */
    rows: Record<string, string | number>[];
    /** Total number of rows returned. */
    rowCount: number;
    /** Execution time in milliseconds. */
    executionTimeMs: number;
}

interface IEditorPanelProps {
    /** Current SQL text in the editor. */
    sqlText: string;
    /** Called when the SQL text changes. */
    onSqlChange: (value: string) => void;
    /** Called when the user clicks Run. */
    onRun: () => void;
    /** Called when the user clicks Explain. */
    onExplain: () => void;
    /** Called when the user clicks AI Analyse. */
    onAiAnalyse: () => void;
    /** Whether a query is currently executing. */
    isRunning: boolean;
    /** Query result to display, or null when no query has been run. */
    queryResult: IQueryResult | null;
}

/** Centre panel containing the SQL editor and query results table. */
const EditorPanel: React.FC<IEditorPanelProps> = ({
    sqlText,
    onSqlChange,
    onRun,
    onExplain,
    onAiAnalyse,
    isRunning,
    queryResult,
}) => {
    const { styles } = useStyles();

    const tableColumns = queryResult?.columns.map((column) => ({
        title: column,
        dataIndex: column,
        key: column,
    })) ?? [];

    const showResults = isRunning || queryResult !== null;

    return (
        <div className={styles.panel}>
            <div className={styles.editorToolbar}>
                <div className={styles.editorToolbarLeft}>
                    <Button
                        type="primary"
                        icon={<CaretRightFilled />}
                        onClick={onRun}
                        loading={isRunning}
                    >
                        Run
                        <span className={styles.shortcutBadge}>⌘Enter</span>
                    </Button>
                    <Button onClick={onExplain} disabled={isRunning}>Explain</Button>
                </div>
                <button className={styles.aiAnalyseButton} onClick={onAiAnalyse}>
                    AI Analyse
                </button>
            </div>
            <div className={styles.editorWrapper}>
                <textarea
                    className={styles.sqlEditor}
                    value={sqlText}
                    onChange={(event) => onSqlChange(event.target.value)}
                    placeholder="-- Write your SQL query here..."
                    spellCheck={false}
                    aria-label="SQL editor"
                />
            </div>
            {showResults && (
                <div className={styles.resultsSection}>
                    <div className={styles.resultsHeader}>
                        <span>RESULTS</span>
                        {queryResult && (
                            <span className={styles.resultsMeta}>
                                {queryResult.rowCount} rows &bull; {queryResult.executionTimeMs}ms
                            </span>
                        )}
                    </div>
                    <div className={styles.resultsTableWrapper}>
                        {isRunning ? (
                            <div className={styles.resultsLoading}>
                                <Spin size="small" />
                            </div>
                        ) : (
                            <Table
                                columns={tableColumns}
                                dataSource={queryResult!.rows.map((row, index) => ({ ...row, key: index }))}
                                pagination={false}
                                size="small"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorPanel;
