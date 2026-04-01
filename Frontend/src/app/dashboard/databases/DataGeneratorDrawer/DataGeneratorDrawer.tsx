"use client";

import React, { useEffect, useState } from "react";
import { Alert, Button, Collapse, Drawer, InputNumber, Spin, Table, Tag, Typography } from "antd";
import { KeyOutlined, LinkOutlined } from "@ant-design/icons";
import {
    ISchemaColumn,
    ISchemaWithRelationships,
    getSchemaWithRelationships,
    generateTestData,
} from "@/services/queryService";

const { Text } = Typography;

interface IDataGeneratorDrawerProps {
    connectionId: string | null;
    connectionName: string;
    onClose: () => void;
}

const DataGeneratorDrawer: React.FC<IDataGeneratorDrawerProps> = ({ connectionId, connectionName, onClose }) => {
    const [schema, setSchema] = useState<ISchemaWithRelationships | null>(null);
    const [isLoadingSchema, setIsLoadingSchema] = useState(false);
    const [schemaError, setSchemaError] = useState<string | null>(null);
    const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateResult, setGenerateResult] = useState<{ success: boolean; counts: Record<string, number>; error: string | null } | null>(null);

    useEffect(() => {
        if (!connectionId) return;
        setSchema(null);
        setSchemaError(null);
        setGenerateResult(null);
        setIsLoadingSchema(true);

        getSchemaWithRelationships(connectionId)
            .then((data) => {
                setSchema(data);
                const defaults: Record<string, number> = {};
                data.tables.forEach((t) => { defaults[t.name] = 10; });
                setRowCounts(defaults);
            })
            .catch((err: unknown) => {
                setSchemaError(err instanceof Error ? err.message : "Failed to load schema.");
            })
            .finally(() => setIsLoadingSchema(false));
    }, [connectionId]);

    const handleGenerate = async (): Promise<void> => {
        if (!connectionId || !schema) return;
        setIsGenerating(true);
        setGenerateResult(null);
        try {
            const result = await generateTestData({
                connectionId,
                tables: schema.tables.map((t) => ({ tableName: t.name, rowCount: rowCounts[t.name] ?? 10 })),
            });
            setGenerateResult({ success: result.success, counts: result.insertedCounts ?? {}, error: result.error ?? null });
        } catch (err: unknown) {
            setGenerateResult({ success: false, counts: {}, error: err instanceof Error ? err.message : "Unexpected error." });
        } finally {
            setIsGenerating(false);
        }
    };

    const columnDefs = [
        {
            title: "Column",
            dataIndex: "name",
            key: "name",
            render: (name: string, col: ISchemaColumn) => (
                <span>
                    {col.isPrimaryKey && <KeyOutlined style={{ color: "var(--ant-color-warning)", marginRight: 4 }} />}
                    {col.referencesTable && <LinkOutlined style={{ color: "var(--ant-color-primary)", marginRight: 4 }} />}
                    {name}
                </span>
            ),
        },
        {
            title: "Type",
            dataIndex: "dataType",
            key: "dataType",
            render: (t: string) => <Text code>{t}</Text>,
        },
        {
            title: "Nullable",
            dataIndex: "isNullable",
            key: "isNullable",
            render: (v: boolean) => v ? <Tag color="default">NULL</Tag> : <Tag color="red">NOT NULL</Tag>,
        },
        {
            title: "References",
            key: "ref",
            render: (_: unknown, col: ISchemaColumn) =>
                col.referencesTable
                    ? <Text type="secondary">{col.referencesTable}.{col.referencesColumn}</Text>
                    : null,
        },
    ];

    return (
        <Drawer
            title={`Generate Data — ${connectionName}`}
            width={720}
            open={!!connectionId}
            onClose={onClose}
            footer={
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        loading={isGenerating}
                        disabled={!schema || isLoadingSchema}
                        onClick={() => void handleGenerate()}
                    >
                        Generate
                    </Button>
                </div>
            }
        >
            {isLoadingSchema && (
                <div style={{ textAlign: "center", padding: 48 }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 12, color: "var(--ant-color-text-secondary)" }}>Loading schema…</p>
                </div>
            )}

            {schemaError && <Alert type="error" message={schemaError} style={{ marginBottom: 16 }} />}

            {generateResult && (
                <Alert
                    type={generateResult.success ? "success" : "error"}
                    message={generateResult.success ? "Data generated successfully" : "Generation failed"}
                    description={
                        generateResult.success
                            ? Object.entries(generateResult.counts).map(([t, n]) => `${t}: ${n} row(s)`).join(" · ") || "No rows counted."
                            : generateResult.error
                    }
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                />
            )}

            {schema && (
                <>
                    {schema.relationships.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Relationships</Text>
                            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {schema.relationships.map((r, i) => (
                                    <Tag key={i} color="blue">
                                        {r.fromTable}.{r.fromColumn} → {r.toTable}.{r.toColumn}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}

                    <Collapse
                        size="small"
                        items={schema.tables.map((table) => ({
                            key: table.name,
                            label: (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text strong>{table.name}</Text>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Rows:</Text>
                                        <InputNumber
                                            size="small"
                                            min={1}
                                            max={1000}
                                            value={rowCounts[table.name] ?? 10}
                                            onChange={(v) => setRowCounts((prev) => ({ ...prev, [table.name]: v ?? 10 }))}
                                            style={{ width: 70 }}
                                        />
                                    </div>
                                </div>
                            ),
                            children: (
                                <Table<ISchemaColumn>
                                    dataSource={table.columns}
                                    columns={columnDefs}
                                    rowKey="name"
                                    size="small"
                                    pagination={false}
                                />
                            ),
                        }))}
                    />
                </>
            )}
        </Drawer>
    );
};

export default DataGeneratorDrawer;
