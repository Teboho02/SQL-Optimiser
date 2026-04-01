"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Select, Alert, Modal, Spin, Empty, Typography, Input, Table, Slider, Tag, Divider, Tooltip } from "antd";
import type { TableProps } from "antd";
import { ScanOutlined, CopyOutlined, ThunderboltOutlined, ExperimentOutlined, PlusOutlined, DeleteOutlined, HistoryOutlined, ClockCircleOutlined } from "@ant-design/icons";
import RecommendationList from "./RecommendationList/RecommendationList";
import RefactoringPanel from "./RefactoringPanel/RefactoringPanel";
import { useStyles } from "./style/styles";
import {
    scanSchema,
    generateMigration,
    getBenchmarkPlan,
    benchmarkRecommendation,
    IRecommendationDto,
    IQueryPairResult,
    IBenchmarkQueryPair,
} from "@/services/schemaAdvisorService";
import { ISchemaAdvisorScanDto } from "@/services/schemaAdvisorHistoryService";
import { executeQuery } from "@/services/queryService";
import { useDatabaseConnectionState, useDatabaseConnectionActions } from "@/providers/databaseConnection";
import { useSchemaAdvisorHistoryState, useSchemaAdvisorHistoryActions } from "@/providers/schemaAdvisorHistory";

const { Text } = Typography;

/** Schema Advisor page — AI-driven recommendations for normalisation and structural improvements. */
export default function SchemaAdvisorPage(): React.JSX.Element {
    const { styles } = useStyles();

    const { connections, selectedConnectionId } = useDatabaseConnectionState();
    const { getConnections, setSelectedConnectionId } = useDatabaseConnectionActions();
    const { scans: scanHistory, activeScanId } = useSchemaAdvisorHistoryState();
    const { getScansByConnection, addScan, deleteScan, setActiveScanId } = useSchemaAdvisorHistoryActions();

    const restoredConnections = connections.filter((c) => c.restoreStatus === 3);

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

    // Compare Schemas modal state
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    // "setup" → user reviews/edits query pairs; "running" → benchmark in progress; "results" → done
    const [compareStep, setCompareStep] = useState<"setup" | "running" | "results">("setup");
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);
    const [benchmarkDdl, setBenchmarkDdl] = useState("");
    const [involvesIndexes, setInvolvesIndexes] = useState(false);
    const [queryPairs, setQueryPairs] = useState<IBenchmarkQueryPair[]>([]);
    const [readRatio, setReadRatio] = useState(80); // percentage 0-100
    const [compareResults, setCompareResults] = useState<IQueryPairResult[]>([]);
    const [weightedImprovement, setWeightedImprovement] = useState<number | null>(null);
    const [compareError, setCompareError] = useState<string | null>(null);

    useEffect(() => {
        void getConnections();
    }, [getConnections]);

    useEffect(() => {
        if (restoredConnections.length === 1 && !selectedConnectionId) {
            setSelectedConnectionId(restoredConnections[0].id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connections]);

    useEffect(() => {
        if (selectedConnectionId) {
            void getScansByConnection(selectedConnectionId);
        }
    }, [selectedConnectionId, getScansByConnection]);

    const handleScanSchema = async (): Promise<void> => {
        if (!selectedConnectionId) return;

        setIsScanning(true);
        setScanError(null);
        setRecommendations([]);
        setSelectedId(null);
        setActiveScanId(null);

        try {
            const output = await scanSchema(selectedConnectionId);

            if (output.error) {
                setScanError(output.error);
                void addScan(selectedConnectionId, 0, null, output.error);
                return;
            }

            setRecommendations(output.recommendations);
            if (output.recommendations.length > 0) {
                setSelectedId(output.recommendations[0].id);
            }

            void addScan(
                selectedConnectionId,
                output.recommendations.length,
                JSON.stringify(output.recommendations),
                null,
            );
        } catch (err) {
            setScanError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleRestoreScan = (scan: ISchemaAdvisorScanDto): void => {
        if (!scan.recommendationsJson) return;
        try {
            const recs = JSON.parse(scan.recommendationsJson) as IRecommendationDto[];
            setRecommendations(recs);
            setSelectedId(recs.length > 0 ? recs[0].id : null);
            setScanError(null);
            setActiveScanId(scan.id);
        } catch {
            // malformed JSON — ignore
        }
    };

    const handleDeleteScan = (scanId: string): void => {
        void deleteScan(scanId);
        if (activeScanId === scanId) {
            setRecommendations([]);
            setSelectedId(null);
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
        if (!selectedConnectionId || !selectedRecommendation) return;
        setCompareStep("setup");
        setQueryPairs([]);
        setBenchmarkDdl("");
        setPlanError(null);
        setCompareError(null);
        setCompareResults([]);
        setWeightedImprovement(null);
        setIsCompareModalOpen(true);
        setIsLoadingPlan(true);

        void getBenchmarkPlan(selectedConnectionId, selectedRecommendation).then((plan) => {
            setIsLoadingPlan(false);
            if (plan.error) { setPlanError(plan.error); return; }
            setBenchmarkDdl(plan.benchmarkDdl ?? "");
            setInvolvesIndexes(plan.involvesIndexes);
            setQueryPairs(plan.queryPairs);
        });
    };

    const handleAddCustomPair = (): void => {
        setQueryPairs((prev) => [
            ...prev,
            { description: "", originalQuery: "", adaptedQuery: "", queryType: "read" },
        ]);
    };

    const handleUpdatePair = (index: number, field: keyof IBenchmarkQueryPair, value: string): void => {
        setQueryPairs((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const handleRemovePair = (index: number): void => {
        setQueryPairs((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRunComparison = async (): Promise<void> => {
        if (!selectedConnectionId || queryPairs.length === 0) return;
        setCompareStep("running");
        setCompareError(null);
        try {
            const output = await benchmarkRecommendation(
                selectedConnectionId,
                benchmarkDdl,
                queryPairs,
                readRatio / 100,
            );
            if (output.error) {
                setCompareError(output.error);
                setCompareStep("setup");
            } else {
                setCompareResults(output.results);
                setWeightedImprovement(output.weightedImprovementPercent ?? null);
                setCompareStep("results");
            }
        } catch (err) {
            setCompareError(err instanceof Error ? err.message : "An unexpected error occurred.");
            setCompareStep("setup");
        }
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

    const connectionOptions = restoredConnections.map((c) => ({
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
            {/* ── SCAN HISTORY ── */}
            {selectedConnectionId && (
                <div className={styles.historySection}>
                    <div className={styles.historyHeader}>
                        <h3 className={styles.historyTitle}>
                            <HistoryOutlined style={{ marginRight: 8 }} />
                            Scan History
                        </h3>
                    </div>
                    {scanHistory.length === 0 ? (
                        <p style={{ fontSize: 13, color: "var(--ant-color-text-secondary)", margin: 0 }}>
                            No previous scans for this connection. Run a scan to get started.
                        </p>
                    ) : (
                        scanHistory.map((scan) => (
                            <div
                                key={scan.id}
                                className={`${styles.historyItem}${activeScanId === scan.id ? ` ${styles.historyItemActive}` : ""}`}
                                onClick={() => scan.recommendationsJson ? handleRestoreScan(scan) : undefined}
                            >
                                <ClockCircleOutlined style={{ fontSize: 16, color: "var(--ant-color-text-secondary)", flexShrink: 0 }} />
                                <div className={styles.historyMeta}>
                                    <p className={styles.historyTimestamp}>
                                        {new Date(scan.creationTime).toLocaleString()}
                                    </p>
                                    <p className={styles.historyCount}>
                                        {scan.errorMessage
                                            ? `Error: ${scan.errorMessage}`
                                            : `${scan.recommendationCount} recommendation${scan.recommendationCount !== 1 ? "s" : ""}`}
                                    </p>
                                </div>
                                {scan.recommendationsJson && (
                                    <Tag color="purple" style={{ flexShrink: 0 }}>
                                        {scan.recommendationCount} rec{scan.recommendationCount !== 1 ? "s" : ""}
                                    </Tag>
                                )}
                                {scan.errorMessage && <Tag color="error" style={{ flexShrink: 0 }}>Failed</Tag>}
                                <Tooltip title="Delete this scan">
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => { e.stopPropagation(); void handleDeleteScan(scan.id); }}
                                    />
                                </Tooltip>
                            </div>
                        ))
                    )}
                </div>
            )}

            <Modal
                title={<span><ExperimentOutlined style={{ marginRight: 8 }} />Compare Schemas — AI Query Benchmark</span>}
                open={isCompareModalOpen}
                onCancel={() => setIsCompareModalOpen(false)}
                width={900}
                footer={
                    compareStep === "setup"
                        ? [
                              <Button key="add" icon={<PlusOutlined />} onClick={handleAddCustomPair}>Add Custom Query</Button>,
                              <Button
                                  key="run"
                                  type="primary"
                                  icon={<ExperimentOutlined />}
                                  disabled={queryPairs.length === 0 || isLoadingPlan}
                                  onClick={() => void handleRunComparison()}
                              >
                                  Run Benchmark
                              </Button>,
                          ]
                        : compareStep === "results"
                        ? [
                              <Button key="back" onClick={() => setCompareStep("setup")}>Edit Queries</Button>,
                              <Button key="close" type="primary" onClick={() => setIsCompareModalOpen(false)}>Close</Button>,
                          ]
                        : []
                }
            >
                {/* ── SETUP STEP ── */}
                {compareStep === "setup" && (
                    <>
                        {isLoadingPlan && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <Spin size="small" />
                                <Text type="secondary">AI is generating query suggestions…</Text>
                            </div>
                        )}
                        {planError && <Alert type="error" message={planError} style={{ marginBottom: 12 }} />}
                        {compareError && <Alert type="error" message={compareError} style={{ marginBottom: 12 }} />}

                        {involvesIndexes && (
                            <Alert
                                type="info"
                                style={{ marginBottom: 16 }}
                                message="This recommendation adds indexes — indexes speed up reads but slow down writes."
                                description={
                                    <div style={{ marginTop: 8 }}>
                                        <Text style={{ fontSize: 13 }}>Estimated read/write ratio for your workload:</Text>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                                            <Text strong style={{ minWidth: 80 }}>Reads {readRatio}%</Text>
                                            <Slider
                                                min={0} max={100} step={5}
                                                value={readRatio}
                                                onChange={setReadRatio}
                                                style={{ flex: 1 }}
                                            />
                                            <Text strong style={{ minWidth: 80, textAlign: "right" }}>Writes {100 - readRatio}%</Text>
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            This ratio is used to compute the weighted overall score.
                                        </Text>
                                    </div>
                                }
                            />
                        )}

                        {queryPairs.map((pair, idx) => (
                            <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <Tag color={pair.queryType === "write" ? "orange" : "blue"}>{pair.queryType.toUpperCase()}</Tag>
                                    <Input
                                        value={pair.description}
                                        onChange={(e) => handleUpdatePair(idx, "description", e.target.value)}
                                        placeholder="Description"
                                        size="small"
                                        style={{ flex: 1 }}
                                    />
                                    <Select
                                        size="small"
                                        value={pair.queryType}
                                        options={[{ value: "read", label: "Read" }, { value: "write", label: "Write" }]}
                                        onChange={(v) => handleUpdatePair(idx, "queryType", v)}
                                        style={{ width: 80 }}
                                    />
                                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemovePair(idx)} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>Original (current schema)</Text>
                                        <Input.TextArea
                                            value={pair.originalQuery}
                                            onChange={(e) => handleUpdatePair(idx, "originalQuery", e.target.value)}
                                            rows={3}
                                            style={{ fontFamily: "monospace", fontSize: 12, marginTop: 4 }}
                                        />
                                    </div>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 11 }}>Adapted (new schema)</Text>
                                        <Input.TextArea
                                            value={pair.adaptedQuery}
                                            onChange={(e) => handleUpdatePair(idx, "adaptedQuery", e.target.value)}
                                            rows={3}
                                            style={{ fontFamily: "monospace", fontSize: 12, marginTop: 4 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isLoadingPlan && queryPairs.length === 0 && !planError && (
                            <Empty description="No query pairs yet — click 'Add Custom Query' to add your own." />
                        )}
                    </>
                )}

                {/* ── RUNNING STEP ── */}
                {compareStep === "running" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12 }}>
                        <Spin size="large" />
                        <Text style={{ fontSize: 13 }}>Running benchmark on both schemas… this may take a moment.</Text>
                    </div>
                )}

                {/* ── RESULTS STEP ── */}
                {compareStep === "results" && (
                    <>
                        {weightedImprovement !== null && (
                            <Alert
                                type={weightedImprovement >= 0 ? "success" : "warning"}
                                style={{ marginBottom: 20 }}
                                message={
                                    <Text strong style={{ fontSize: 15 }}>
                                        Weighted Overall Score ({readRatio}% reads / {100 - readRatio}% writes):&nbsp;
                                        <span style={{ color: weightedImprovement >= 0 ? "#52c41a" : "#ff4d4f" }}>
                                            {weightedImprovement >= 0 ? "+" : ""}{weightedImprovement}%
                                        </span>
                                    </Text>
                                }
                            />
                        )}

                        {compareResults.map((result, idx) => (
                            <div key={idx} style={{ marginBottom: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <Tag color={result.queryType === "write" ? "orange" : "blue"}>{result.queryType.toUpperCase()}</Tag>
                                    <Text strong style={{ flex: 1 }}>{result.description}</Text>
                                    {result.error
                                        ? <Tag color="error">Error</Tag>
                                        : <Text strong style={{ color: result.improvementPercent >= 0 ? "#52c41a" : "#ff4d4f" }}>
                                            {result.improvementPercent >= 0 ? "+" : ""}{result.improvementPercent}%
                                          </Text>
                                    }
                                </div>

                                {result.error
                                    ? <Alert type="error" message={result.error} />
                                    : (
                                        <>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                                                <pre style={{ background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 6, padding: 10, fontSize: 12, margin: 0, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>
                                                    {result.originalQuery}
                                                </pre>
                                                <pre style={{ background: "rgba(60,255,100,0.06)", border: "1px solid rgba(60,200,100,0.2)", borderRadius: 6, padding: 10, fontSize: 12, margin: 0, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>
                                                    {result.adaptedQuery}
                                                </pre>
                                            </div>
                                            <div style={{ display: "flex", gap: 12 }}>
                                                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 18px", textAlign: "center" }}>
                                                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Original Avg</Text>
                                                    <Text strong style={{ fontSize: 16 }}>{result.originalAvgMs.toFixed(1)} ms</Text>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.3)" }}>→</div>
                                                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 18px", textAlign: "center" }}>
                                                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Adapted Avg</Text>
                                                    <Text strong style={{ fontSize: 16, color: result.adaptedAvgMs < result.originalAvgMs ? "#52c41a" : "#ff4d4f" }}>
                                                        {result.adaptedAvgMs.toFixed(1)} ms
                                                    </Text>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                {idx < compareResults.length - 1 && <Divider style={{ margin: "16px 0" }} />}
                            </div>
                        ))}
                    </>
                )}
            </Modal>
        </>
    );
}
