"use client";

import React, { useState, useEffect } from "react";
import { Button, Select, Alert, Modal, Spin, Empty, Typography } from "antd";
import { ScanOutlined, CopyOutlined } from "@ant-design/icons";
import RecommendationList from "./RecommendationList/RecommendationList";
import RefactoringPanel from "./RefactoringPanel/RefactoringPanel";
import { useStyles } from "./style/styles";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";
import {
    scanSchema,
    generateMigration,
    IRecommendationDto,
} from "@/services/schemaAdvisorService";

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

        const output = await scanSchema(selectedConnectionId);

        setIsScanning(false);

        if (output.error) {
            setScanError(output.error);
            return;
        }

        setRecommendations(output.recommendations);
        if (output.recommendations.length > 0) {
            setSelectedId(output.recommendations[0].id);
        }
    };

    const handleGenerateMigration = async (): Promise<void> => {
        if (!selectedConnectionId || !selectedRecommendation) return;

        setIsMigrationModalOpen(true);
        setIsGenerating(true);
        setMigrationSql(null);
        setMigrationError(null);

        const output = await generateMigration(selectedConnectionId, selectedRecommendation);

        setIsGenerating(false);

        if (output.error) {
            setMigrationError(output.error);
        } else {
            setMigrationSql(output.migrationSql ?? null);
        }
    };

    const handleCopySql = (): void => {
        if (migrationSql) {
            void navigator.clipboard.writeText(migrationSql);
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
        </>
    );
}
