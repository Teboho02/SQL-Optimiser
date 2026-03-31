"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, Alert } from "antd";
import SchemaPanel from "./SchemaPanel/SchemaPanel";
import EditorPanel from "./EditorPanel/EditorPanel";
import ExecutionInfoPanel from "./ExecutionInfoPanel/ExecutionInfoPanel";
import HistoryPanel from "./HistoryPanel/HistoryPanel";
import { useStyles } from "./style/styles";
import { executeQuery, getSchema, ISchemaTable } from "@/services/queryService";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";
import {
    getQueryHistory,
    addQueryHistory,
    deleteQueryHistory,
    IQueryHistoryDto,
} from "@/services/queryHistoryService";

interface IQueryResult {
    columns: string[];
    rows: Record<string, string | number>[];
    rowCount: number;
    executionTimeMs: number;
}

interface IExecutionInfo {
    status: "success" | "error" | "idle";
    executionTimeMs: number | null;
    queryPlan: string | null;
}

const IDLE_EXECUTION_INFO: IExecutionInfo = {
    status: "idle",
    executionTimeMs: null,
    queryPlan: null,
};

const DEFAULT_SQL = "SELECT * FROM ";

/** Converts milliseconds to a .NET TimeSpan string (HH:MM:SS.fffffff). */
function msToTimeSpan(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    const frac = Math.round((ms % 1000) * 10000).toString().padStart(7, "0");
    return `${h}:${m}:${s}.${frac}`;
}

/** SQL Playground — write and execute queries directly against a restored local database. */
export default function PlaygroundPage(): React.JSX.Element {
    const { styles } = useStyles();

    const [connections, setConnections] = useState<IDatabaseConnectionDto[]>([]);
    const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
    const [schemaTables, setSchemaTables] = useState<ISchemaTable[]>([]);
    const [isLoadingSchema, setIsLoadingSchema] = useState(false);
    const [schemaError, setSchemaError] = useState<string | null>(null);

    const [sqlText, setSqlText] = useState<string>(DEFAULT_SQL);
    const [queryResult, setQueryResult] = useState<IQueryResult | null>(null);
    const [executionInfo, setExecutionInfo] = useState<IExecutionInfo>(IDLE_EXECUTION_INFO);
    const [queryError, setQueryError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const [history, setHistory] = useState<IQueryHistoryDto[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Load restored connections on mount
    useEffect(() => {
        void getDatabaseConnections().then((items) => {
            const restored = items.filter((c) => c.restoreStatus === 3);
            setConnections(restored);
            if (restored.length === 1) {
                setSelectedConnectionId(restored[0].id);
            }
        });
    }, []);

    // Reload schema when connection changes
    const loadSchema = useCallback(async (connectionId: string): Promise<void> => {
        setIsLoadingSchema(true);
        setSchemaError(null);
        try {
            const tables = await getSchema(connectionId);
            setSchemaTables(tables);
        } catch {
            setSchemaError("Failed to load schema.");
            setSchemaTables([]);
        } finally {
            setIsLoadingSchema(false);
        }
    }, []);

    // Reload history when connection changes
    const loadHistory = useCallback(async (connectionId: string): Promise<void> => {
        setIsLoadingHistory(true);
        try {
            const entries = await getQueryHistory(connectionId);
            setHistory(entries);
        } catch {
            setHistory([]);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        if (selectedConnectionId) {
            void loadSchema(selectedConnectionId);
            void loadHistory(selectedConnectionId);
        } else {
            setSchemaTables([]);
            setHistory([]);
        }
    }, [selectedConnectionId, loadSchema, loadHistory]);

    const handleRun = async (): Promise<void> => {
        if (!sqlText.trim() || !selectedConnectionId) return;

        setIsRunning(true);
        setQueryResult(null);
        setQueryError(null);
        setExecutionInfo(IDLE_EXECUTION_INFO);

        const result = await executeQuery({ connectionId: selectedConnectionId, sql: sqlText });

        setIsRunning(false);

        if (result.error) {
            setQueryError(result.error);
            setExecutionInfo({ status: "error", executionTimeMs: null, queryPlan: null });

            void addQueryHistory({
                databaseConnectionId: selectedConnectionId,
                queryText: sqlText,
                errorMessage: result.error,
                executionTime: "00:00:00.0000000",
            }).then(() => void loadHistory(selectedConnectionId));
        } else {
            setQueryResult({
                columns: result.columns,
                rows: result.rows,
                rowCount: result.rowsAffected,
                executionTimeMs: result.executionTimeMs,
            });
            setExecutionInfo({
                status: "success",
                executionTimeMs: result.executionTimeMs,
                queryPlan: null,
            });

            void addQueryHistory({
                databaseConnectionId: selectedConnectionId,
                queryText: sqlText,
                resultSummary: `${result.rowsAffected} rows`,
                executionTime: msToTimeSpan(result.executionTimeMs),
            }).then(() => void loadHistory(selectedConnectionId));
        }
    };

    const handleExplain = (): void => {
        // todo: call backend explain API
    };

    const handleAiAnalyse = (): void => {
        // todo: call backend AI analysis API
    };

    const handleHistorySelect = (query: string): void => {
        setSqlText(query);
    };

    const handleHistoryDelete = async (entryId: string): Promise<void> => {
        await deleteQueryHistory(entryId);
        if (selectedConnectionId) {
            void loadHistory(selectedConnectionId);
        }
    };

    const connectionOptions = connections.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 500, flexShrink: 0 }}>Connection</span>
                <Select
                    style={{ width: 280 }}
                    placeholder="Select a restored connection..."
                    options={connectionOptions}
                    value={selectedConnectionId}
                    onChange={setSelectedConnectionId}
                    notFoundContent="No restored connections found"
                />
            </div>
            {queryError && (
                <Alert
                    type="error"
                    message={queryError}
                    closable
                    onClose={() => setQueryError(null)}
                    style={{ marginBottom: 12 }}
                />
            )}
            <div className={styles.threeColumnLayout}>
                <SchemaPanel
                    tables={schemaTables}
                    isLoading={isLoadingSchema}
                    error={schemaError}
                    hasConnection={!!selectedConnectionId}
                />
                <EditorPanel
                    sqlText={sqlText}
                    onSqlChange={setSqlText}
                    onRun={() => void handleRun()}
                    onExplain={handleExplain}
                    onAiAnalyse={handleAiAnalyse}
                    isRunning={isRunning}
                    queryResult={queryResult}
                />
                <ExecutionInfoPanel executionInfo={executionInfo} />
            </div>
            <div style={{ marginTop: 16, height: 320 }}>
                <HistoryPanel
                    history={history}
                    isLoading={isLoadingHistory}
                    hasConnection={!!selectedConnectionId}
                    onSelect={handleHistorySelect}
                    onDelete={(id) => void handleHistoryDelete(id)}
                />
            </div>
        </>
    );
}
