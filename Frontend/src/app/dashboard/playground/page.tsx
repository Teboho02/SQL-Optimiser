"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, Alert } from "antd";
import SchemaPanel from "./SchemaPanel/SchemaPanel";
import EditorPanel from "./EditorPanel/EditorPanel";
import ExecutionInfoPanel from "./ExecutionInfoPanel/ExecutionInfoPanel";
import { useStyles } from "./style/styles";
import { executeQuery, getSchema, ISchemaTable } from "@/services/queryService";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";

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

    useEffect(() => {
        if (selectedConnectionId) {
            void loadSchema(selectedConnectionId);
        } else {
            setSchemaTables([]);
        }
    }, [selectedConnectionId, loadSchema]);

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
        }
    };

    const handleExplain = (): void => {
        // todo: call backend explain API
    };

    const handleAiAnalyse = (): void => {
        // todo: call backend AI analysis API
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
        </>
    );
}
