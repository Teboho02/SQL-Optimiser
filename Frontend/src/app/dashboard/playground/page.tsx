"use client";

import React, { useState } from "react";
import SchemaPanel from "./SchemaPanel/SchemaPanel";
import EditorPanel from "./EditorPanel/EditorPanel";
import ExecutionInfoPanel from "./ExecutionInfoPanel/ExecutionInfoPanel";
import { useStyles } from "./style/styles";

interface ISchemaTable {
    name: string;
    columns: string[];
}

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

const SCHEMA_TABLES: ISchemaTable[] = [
    { name: "users", columns: ["id", "email", "name", "status", "created_at"] },
    { name: "orders", columns: ["id", "user_id", "total", "status", "created_at"] },
    { name: "products", columns: ["id", "name", "price", "stock"] },
];

// mock result used until backend query execution is wired up
const MOCK_QUERY_RESULT: IQueryResult = {
    columns: ["ID", "EMAIL", "NAME", "STATUS"],
    rows: [
        { ID: 1, EMAIL: "alice@example.com", NAME: "Alice Smith", STATUS: "active" },
        { ID: 2, EMAIL: "bob@example.com", NAME: "Bob Jones", STATUS: "inactive" },
        { ID: 3, EMAIL: "charlie@example.com", NAME: "Charlie Brown", STATUS: "active" },
    ],
    rowCount: 3,
    executionTimeMs: 12,
};

// mock execution info used until backend is wired up
const MOCK_EXECUTION_INFO: IExecutionInfo = {
    status: "success",
    executionTimeMs: 12.4,
    queryPlan: "Limit (cost=0.00..0.15 rows=10)\n→ Seq Scan on users",
};

const IDLE_EXECUTION_INFO: IExecutionInfo = {
    status: "idle",
    executionTimeMs: null,
    queryPlan: null,
};

const DEFAULT_SQL = "SELECT * FROM users LIMIT 10;";

/** SQL Playground — write and execute queries directly against a connected database. */
export default function PlaygroundPage(): React.JSX.Element {
    const { styles } = useStyles();
    const [sqlText, setSqlText] = useState<string>(DEFAULT_SQL);
    const [queryResult, setQueryResult] = useState<IQueryResult | null>(null);
    const [executionInfo, setExecutionInfo] = useState<IExecutionInfo>(IDLE_EXECUTION_INFO);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const handleRun = (): void => {
        if (!sqlText.trim()) { return; }
        setIsRunning(true);
        setQueryResult(null);
        setExecutionInfo(IDLE_EXECUTION_INFO);
        // todo: call backend query execution API and replace mock data
        setTimeout(() => {
            setIsRunning(false);
            setQueryResult(MOCK_QUERY_RESULT);
            setExecutionInfo(MOCK_EXECUTION_INFO);
        }, 800);
    };

    const handleExplain = (): void => {
        // todo: call backend explain API
    };

    const handleAiAnalyse = (): void => {
        // todo: call backend AI analysis API
    };

    return (
        <div className={styles.threeColumnLayout}>
            <SchemaPanel tables={SCHEMA_TABLES} />
            <EditorPanel
                sqlText={sqlText}
                onSqlChange={setSqlText}
                onRun={handleRun}
                onExplain={handleExplain}
                onAiAnalyse={handleAiAnalyse}
                isRunning={isRunning}
                queryResult={queryResult}
            />
            <ExecutionInfoPanel executionInfo={executionInfo} />
        </div>
    );
}
