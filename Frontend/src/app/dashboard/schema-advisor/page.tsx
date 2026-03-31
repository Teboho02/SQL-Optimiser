"use client";

import React, { useState, useEffect } from "react";
import { Button, Select, Alert, Modal, Spin, Empty, Typography, Input, Table } from "antd";
import type { TableProps } from "antd";
import { ScanOutlined, CopyOutlined, ThunderboltOutlined, ExperimentOutlined } from "@ant-design/icons";
import RecommendationList from "./RecommendationList/RecommendationList";
import RefactoringPanel from "./RefactoringPanel/RefactoringPanel";
import { useStyles } from "./style/styles";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";
import {
    scanSchema,
    generateMigration,
    benchmarkRecommendation,
    IRecommendationDto,
    IQueryPairResult,
} from "@/services/schemaAdvisorService";
import { executeQuery } from "@/services/queryService";

const { Text } = Typography;

/** Schema Advisor page — AI-driven recommendations for normalisation and structural improvements. */
export default function SchemaAdvisorPage(): React.JSX.Element {
    const { styles } = useStyles();

    const [connections, setConnections] = useState<IDatabaseConnectionDto[]>([]);
    const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

    const [recommendations, setRecommendations] = useState<IRecommendationDto[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
    const [migrationSql, setMigrationSql] = useState<string | null>(null);
    const [migrationError, setMigrationError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
    const [benchmarkSql, setBenchmarkSql] = useState("");
    const [benchmarkRuns, setBenchmarkRuns] = useState<number[]>([]);
    const [isBenchmarking, setIsBenchmarking] = useState(false);
    const [benchmarkError, setBenchmarkError] = useState<string | null>(null);

    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [compareResults, setCompareResults] = useState<IQueryPairResult[]>([]);
    const [isComparing, setIsComparing] = useState(false);
    const [compareError, setCompareError] = useState<string | null>(null);

    useEffect(() => {
        void getDatabaseConnections().then((items) => {
            const restored = items.filter((c) => c.restoreStatus === 3);
            setConnections(restored);
            if (restored.length === 1) {
                setSelectedConnectionId(restored[0].id);
            }
        });
    }, []);

    const handleScanSchema = async (): Promise<void> => {
        if (!selectedConnectionId) return;

        setIsScanning(true);
        setScanError(null);
        setRecommendations([]);
        setSelectedId(null);

        try {
            const output = await scanSchema(selectedConnectionId);

            if (output.error) {
                setScanError(output.error);
                return;
            }

            setRecommendations(output.recommendations);
            if (output.recommendations.length > 0) {
                setSelectedId(output.recommendations[0].id);
            }
        } catch (err) {
            setScanError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleGenerateMigration = async (): Promise<void> => {
        if (!selectedConnectionId || !selectedRecommendation) return;

        setIsMigrationModalOpen(true);
        setIsGenerating(true);
        setMigrationSql(null);
        setMigrationError(null);

        try {
            const output = await generateMigration(selectedConnectionId, selectedRecommendation);

            if (output.error) {
                setMigrationError(output.error);
            } else {
                setMigrationSql(output.migrationSql ?? null);
            }
        } catch (err) {
            setMigrationError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopySql = (): void => {
        if (migrationSql) {
            void navigator.clipboard.writeText(migrationSql);
        }
    };

    const handleOpenBenchmark = (): void => {
        if (!selectedRecommendation) return;
        // Pre-fill with a simple SELECT on the current table, stripping the "(Current)" label suffix
        const tableName = selectedRecommendation.currentTable.label.replace(/\s*\(.*\)$/, "").trim();
        setBenchmarkSql(`SELECT * FROM ${tableName} LIMIT 1000;`);
        setBenchmarkRuns([]);
        setBenchmarkError(null);
        setIsBenchmarkModalOpen(true);
    };

    const handleOpenCompare = (): void => {
        setCompareResults([]);
        setCompareError(null);
        setIsCompareModalOpen(true);
        void (async () => {
            if (!selectedConnectionId || !selectedRecommendation) return;
            setIsComparing(true);
            try {
                const output = await benchmarkRecommendation(selectedConnectionId, selectedRecommendation);
                if (output.error) {
                    setCompareError(output.error);
                } else {
                    setCompareResults(output.results);
                }
            } catch (err) {
                setCompareError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setIsComparing(false);
            }
        })();
    };

    const handleRunBenchmark = async (): Promise<void> => {
        if (!selectedConnectionId || !benchmarkSql.trim()) return;

        setIsBenchmarking(true);
        setBenchmarkRuns([]);
        setBenchmarkError(null);

        try {
            const times: number[] = [];
            for (let i = 0; i < 3; i++) {
                const result = await executeQuery({ connectionId: selectedConnectionId, sql: benchmarkSql });
                if (result.error) {
                    setBenchmarkError(result.error);
                    return;
                }
                times.push(result.executionTimeMs);
                setBenchmarkRuns([...times]);
            }
        } catch (err) {
            setBenchmarkError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsBenchmarking(false);
        }
    };

    const selectedRecommendation = recommendations.find((r) => r.id === selectedId) ?? null;

    const connectionOptions = connections.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    const refactoringDetail = selectedRecommendation
        ? {
              title: `Refactoring: ${selectedRecommendation.title}`,
              currentTable: selectedRecommendation.currentTable,
              newTables: selectedRecommendation.newTables,
              metrics: selectedRecommendation.metrics,
          }
        : null;

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Schema Advisor</h1>
                    <p className={styles.pageSubtitle}>AI-driven recommendations for normalisation and structural improvements.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Select
                        style={{ width: 240 }}
                        placeholder="Select a connection..."
                        options={connectionOptions}
                        value={selectedConnectionId}
                        onChange={setSelectedConnectionId}
                        notFoundContent="No restored connections found"
                    />
                    <Button
                        icon={<ScanOutlined />}
                        size="large"
                        type="primary"
                        loading={isScanning}
                        disabled={!selectedConnectionId}
                        onClick={() => void handleScanSchema()}
                    >
                        Scan Schema
                    </Button>
                </div>
            </div>

            {scanError && (
                <Alert
                    type="error"
                    message={scanError}
                    closable
                    onClose={() => setScanError(null)}
                    style={{ marginBottom: 16 }}
                />
            )}

            {isScanning && (
                <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                    <Spin size="large" tip="Analysing schema with AI..." />
                </div>
            )}

            {!isScanning && recommendations.length === 0 && !scanError && (
                <div style={{ padding: "80px 0" }}>
                    <Empty
                        description={
                            selectedConnectionId
                                ? "Select a connection and click Scan Schema to get AI-powered recommendations."
                                : "Select a connection and click Scan Schema to get AI-powered recommendations."
                        }
                    />
                </div>
            )}

            {!isScanning && recommendations.length > 0 && refactoringDetail && selectedId && (
                <div className={styles.twoColumnLayout}>
                    <RecommendationList
                        recommendations={recommendations}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                    <RefactoringPanel
                        detail={refactoringDetail}
                        onGenerateMigration={() => void handleGenerateMigration()}
                        onBenchmark={handleOpenBenchmark}
                        onCompare={handleOpenCompare}
                    />
                </div>
            )}

            <Modal
                title="Generated Migration Script"
                open={isMigrationModalOpen}
                onCancel={() => setIsMigrationModalOpen(false)}
                width={760}
                footer={
                    migrationSql
                        ? [
                              <Button key="copy" icon={<CopyOutlined />} onClick={handleCopySql}>
                                  Copy SQL
                              </Button>,
                              <Button key="close" type="primary" onClick={() => setIsMigrationModalOpen(false)}>
                                  Close
                              </Button>,
                          ]
                        : [
                              <Button key="close" type="primary" onClick={() => setIsMigrationModalOpen(false)}>
                                  Close
                              </Button>,
                          ]
                }
            >
                {isGenerating && (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                        <Spin tip="Generating migration script..." />
                    </div>
                )}
                {migrationError && <Alert type="error" message={migrationError} />}
                {migrationSql && (
                    <pre
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            padding: 16,
                            fontSize: 12,
                            lineHeight: 1.6,
                            overflow: "auto",
                            maxHeight: 480,
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        <Text code>{migrationSql}</Text>
                    </pre>
                )}
            </Modal>
            <Modal
                title={
                    <span>
                        <ThunderboltOutlined style={{ marginRight: 8 }} />
                        Benchmark Query
                    </span>
                }
                open={isBenchmarkModalOpen}
                onCancel={() => setIsBenchmarkModalOpen(false)}
                width={680}
                footer={[
                    <Button
                        key="run"
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        loading={isBenchmarking}
                        disabled={!benchmarkSql.trim()}
                        onClick={() => void handleRunBenchmark()}
                    >
                        Run Benchmark
                    </Button>,
                    <Button key="close" onClick={() => setIsBenchmarkModalOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                <p style={{ marginBottom: 8, fontSize: 13 }}>
                    Enter a query that exercises the affected table. It will be run <strong>3 times</strong> and the results compared against the AI&#39;s estimated improvement.
                </p>
                <Input.TextArea
                    value={benchmarkSql}
                    onChange={(e) => setBenchmarkSql(e.target.value)}
                    rows={4}
                    style={{ fontFamily: "monospace", fontSize: 13, marginBottom: 16 }}
                    placeholder="SELECT * FROM table_name WHERE ..."
                />

                {benchmarkError && (
                    <Alert type="error" message={benchmarkError} style={{ marginBottom: 16 }} />
                )}

                {isBenchmarking && benchmarkRuns.length === 0 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                        <Spin tip="Running benchmark..." />
                    </div>
                )}

                {benchmarkRuns.length > 0 && (() => {
                    const avg = Math.round(benchmarkRuns.reduce((a, b) => a + b, 0) / benchmarkRuns.length);
                    const tableData = [
                        ...benchmarkRuns.map((ms, i) => ({ key: i, run: `Run ${i + 1}`, timeMs: ms })),
                        { key: "avg", run: "Average", timeMs: avg },
                    ];
                    const columns: TableProps<typeof tableData[number]>["columns"] = [
                        { title: "Run", dataIndex: "run", key: "run", width: 100 },
                        {
                            title: "Execution Time",
                            dataIndex: "timeMs",
                            key: "timeMs",
                            render: (ms: number, record) => (
                                <Text strong={record.key === "avg"}>{ms} ms</Text>
                            ),
                        },
                    ];

                    return (
                        <>
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                size="small"
                                style={{ marginBottom: 16 }}
                            />
                            {selectedRecommendation && selectedRecommendation.metrics.length > 0 && (
                                <Alert
                                    type="info"
                                    message="AI Estimated Improvement"
                                    description={
                                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                                            {selectedRecommendation.metrics.map((m) => (
                                                <li key={m.label}>
                                                    {m.label}: <strong>{m.before}</strong> → <strong>{m.after}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                />
                            )}
                        </>
                    );
                })()}
            </Modal>
            <Modal
                title={
                    <span>
                        <ExperimentOutlined style={{ marginRight: 8 }} />
                        Compare Schemas — AI Query Benchmark
                    </span>
                }
                open={isCompareModalOpen}
                onCancel={() => setIsCompareModalOpen(false)}
                width={860}
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsCompareModalOpen(false)}>Close</Button>,
                ]}
            >
                {isComparing && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12 }}>
                        <Spin size="large" />
                        <Text style={{ fontSize: 13 }}>
                            AI is generating query suggestions and running benchmarks on both schemas…
                        </Text>
                    </div>
                )}

                {compareError && <Alert type="error" message={compareError} />}

                {!isComparing && compareResults.map((result, idx) => (
                    <div key={idx} style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <Text strong style={{ fontSize: 14 }}>
                                {idx + 1}. {result.description}
                            </Text>
                            {result.error
                                ? <Alert type="error" message={result.error} style={{ padding: "2px 8px" }} />
                                : (
                                    <Text
                                        strong
                                        style={{
                                            color: result.improvementPercent >= 0 ? "#52c41a" : "#ff4d4f",
                                            fontSize: 15,
                                        }}
                                    >
                                        {result.improvementPercent >= 0 ? "+" : ""}{result.improvementPercent}% faster
                                    </Text>
                                )
                            }
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
                                    ORIGINAL QUERY (current schema)
                                </Text>
                                <pre style={{ background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 6, padding: 10, fontSize: 12, margin: 0, whiteSpace: "pre-wrap", maxHeight: 160, overflow: "auto" }}>
                                    {result.originalQuery}
                                </pre>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
                                    ADAPTED QUERY (new schema)
                                </Text>
                                <pre style={{ background: "rgba(60,255,100,0.06)", border: "1px solid rgba(60,200,100,0.2)", borderRadius: 6, padding: 10, fontSize: 12, margin: 0, whiteSpace: "pre-wrap", maxHeight: 160, overflow: "auto" }}>
                                    {result.adaptedQuery}
                                </pre>
                            </div>
                        </div>

                        {!result.error && (
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 20px", textAlign: "center" }}>
                                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Original Avg</Text>
                                    <Text strong style={{ fontSize: 18 }}>{result.originalAvgMs.toFixed(1)} ms</Text>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>→</div>
                                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "8px 20px", textAlign: "center" }}>
                                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Adapted Avg</Text>
                                    <Text strong style={{ fontSize: 18, color: result.adaptedAvgMs < result.originalAvgMs ? "#52c41a" : "#ff4d4f" }}>
                                        {result.adaptedAvgMs.toFixed(1)} ms
                                    </Text>
                                </div>
                            </div>
                        )}

                        {idx < compareResults.length - 1 && <hr style={{ marginTop: 20, border: "none", borderTop: "1px solid rgba(255,255,255,0.06)" }} />}
                    </div>
                ))}
            </Modal>
        </>
    );
}
