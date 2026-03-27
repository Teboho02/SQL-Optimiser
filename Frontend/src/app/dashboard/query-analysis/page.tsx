"use client";

import React, { useState, useEffect } from "react";
import { Select } from "antd";
import QueryAnalysisHeader from "./QueryAnalysisHeader/QueryAnalysisHeader";
import QueryEditorPanel from "./QueryEditorPanel/QueryEditorPanel";
import ResultsPanel from "./ResultsPanel/ResultsPanel";
import { useStyles } from "./style/styles";
import { analyseQuery, benchmarkQuery, IBenchmarkResponse, IAnalyseQueryResponse } from "@/services/queryService";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";

/** Query Analysis page — paste SQL, trigger analysis, view optimisation results. */
export default function QueryAnalysisPage(): React.JSX.Element {
    const { styles } = useStyles();

    const [connections, setConnections] = useState<IDatabaseConnectionDto[]>([]);
    const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

    const [sqlText, setSqlText] = useState<string>("");
    const [intentText, setIntentText] = useState<string>("");
    const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<IAnalyseQueryResponse | null>(null);
    const [analyseError, setAnalyseError] = useState<string | null>(null);

    const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
    const [benchmarkResult, setBenchmarkResult] = useState<IBenchmarkResponse | null>(null);
    const [benchmarkError, setBenchmarkError] = useState<string | null>(null);

    useEffect(() => {
        void getDatabaseConnections().then((items) => {
            const restored = items.filter((c) => c.restoreStatus === 3);
            setConnections(restored);
            if (restored.length === 1) setSelectedConnectionId(restored[0].id);
        });
    }, []);

    const handleAnalyse = async (): Promise<void> => {
        if (!sqlText.trim() || !selectedConnectionId) return;

        setIsAnalysing(true);
        setAnalysisResult(null);
        setAnalyseError(null);

        const result = await analyseQuery({
            connectionId: selectedConnectionId,
            sql: sqlText,
            intent: intentText || undefined,
        });

        setIsAnalysing(false);

        if (result.error) {
            setAnalyseError(result.error);
        } else {
            setAnalysisResult(result);
        }
    };

    const handleFormat = (): void => {
        // todo: format SQL via backend or local formatter
    };

    const handleBenchmark = async (): Promise<void> => {
        if (!selectedConnectionId || !sqlText.trim() || !analysisResult?.suggestedQuery) return;

        setIsBenchmarking(true);
        setBenchmarkResult(null);
        setBenchmarkError(null);

        const result = await benchmarkQuery({
            connectionId: selectedConnectionId,
            originalSql: sqlText,
            suggestedSql: analysisResult.suggestedQuery,
        });

        setIsBenchmarking(false);

        if (result.error) {
            setBenchmarkError(result.error);
        } else {
            setBenchmarkResult(result);
        }
    };

    const handleClear = (): void => {
        setSqlText("");
        setIntentText("");
        setAnalysisResult(null);
        setAnalyseError(null);
        setBenchmarkResult(null);
        setBenchmarkError(null);
    };

    const selectedConnection = connections.find((c) => c.id === selectedConnectionId) ?? null;
    const connectionOptions = connections.map((c) => ({ value: c.id, label: c.name }));
    const hasResults = analysisResult !== null;

    return (
        <>
            <QueryAnalysisHeader onAnalyse={() => void handleAnalyse()} isAnalysing={isAnalysing} />
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
            <div className={styles.panelsRow}>
                <QueryEditorPanel
                    sqlText={sqlText}
                    onSqlChange={setSqlText}
                    intentText={intentText}
                    onIntentChange={setIntentText}
                    onFormat={handleFormat}
                    onClear={handleClear}
                    connectionName={selectedConnection?.name ?? null}
                />
                <ResultsPanel
                    isAnalysing={isAnalysing}
                    hasResults={hasResults}
                    result={analysisResult}
                    error={analyseError}
                    onBenchmark={() => void handleBenchmark()}
                    isBenchmarking={isBenchmarking}
                    benchmarkResult={benchmarkResult}
                    benchmarkError={benchmarkError}
                />
            </div>
        </>
    );
}
