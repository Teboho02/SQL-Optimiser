"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Spin, Tabs, Table, Tag, Button, Popconfirm, Alert, Typography, Modal } from "antd";
import type { TableProps } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryTable from "./HistoryTable/HistoryTable";
import HistoryPagination from "./HistoryPagination/HistoryPagination";
import { IQueryHistoryDto } from "@/services/queryHistoryService";
import { IMigrationHistoryDto, getAllMigrationHistory, rollbackMigration } from "@/services/migrationHistoryService";
import { useDatabaseConnectionState, useDatabaseConnectionActions } from "@/providers/databaseConnection";
import { useQueryHistoryState, useQueryHistoryActions } from "@/providers/queryHistory";
import { useStyles } from "./style/styles";

const { Text } = Typography;

type HistoryStatus = "success" | "warning" | "critical";

interface IHistoryEntry {
    id: string;
    queryPreview: string;
    database: string;
    improvement: string | null;
    status: HistoryStatus;
    date: string;
}

const PAGE_SIZE = 6;

function toHistoryEntry(dto: IQueryHistoryDto, connectionMap: Map<string, string>): IHistoryEntry {
    const connectionName = connectionMap.get(dto.databaseConnectionId) ?? dto.databaseConnectionId.slice(0, 8);
    const status: HistoryStatus = dto.errorMessage ? "critical" : dto.suggestedQuery ? "warning" : "success";
    const date = new Date(dto.creationTime).toLocaleString([], {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
    return {
        id: dto.id.slice(0, 8).toUpperCase(),
        queryPreview: dto.queryText,
        database: connectionName,
        improvement: dto.suggestedQuery ? "Has suggestion" : null,
        status,
        date,
    };
}

/** Analysis History page — paginated log of query executions and applied schema migrations. */
export default function HistoryPage(): React.JSX.Element {
    const { styles } = useStyles();
    const { connections } = useDatabaseConnectionState();
    const { getConnections } = useDatabaseConnectionActions();
    const { entries, isPending } = useQueryHistoryState();
    const { getAllHistory } = useQueryHistoryActions();

    const [currentPage, setCurrentPage] = useState<number>(1);

    // Applied Migrations tab state
    const [migrations, setMigrations] = useState<IMigrationHistoryDto[]>([]);
    const [migrationsLoading, setMigrationsLoading] = useState(false);
    const [rollbackError, setRollbackError] = useState<string | null>(null);
    const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null);
    const [rollingBackId, setRollingBackId] = useState<string | null>(null);
    const [sqlModalRecord, setSqlModalRecord] = useState<IMigrationHistoryDto | null>(null);

    const loadMigrations = useCallback(async () => {
        setMigrationsLoading(true);
        try {
            const data = await getAllMigrationHistory();
            setMigrations(data);
        } finally {
            setMigrationsLoading(false);
        }
    }, []);

    useEffect(() => {
        void getConnections();
        void getAllHistory();
        void loadMigrations();
    }, [getConnections, getAllHistory, loadMigrations]);

    const connectionMap = new Map<string, string>(connections.map((c) => [c.id, c.name]));
    const mappedEntries = entries.map((dto) => toHistoryEntry(dto, connectionMap));

    const totalEntries = mappedEntries.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const rangeStart = totalEntries === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(safePage * PAGE_SIZE, totalEntries);
    const pageEntries = mappedEntries.slice(rangeStart - 1, rangeEnd);

    const handleRollback = async (migrationId: string): Promise<void> => {
        setRollingBackId(migrationId);
        setRollbackError(null);
        setRollbackSuccess(null);
        try {
            const result = await rollbackMigration(migrationId);
            if (result.error) {
                setRollbackError(result.error);
            } else {
                setRollbackSuccess("Migration rolled back successfully.");
                await loadMigrations();
            }
        } catch (err) {
            setRollbackError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setRollingBackId(null);
        }
    };

    const migrationColumns: TableProps<IMigrationHistoryDto>["columns"] = [
        {
            title: "Connection",
            dataIndex: "connectionName",
            key: "connectionName",
            sorter: (a, b) => a.connectionName.localeCompare(b.connectionName),
        },
        {
            title: "Recommendation",
            dataIndex: "recommendationTitle",
            key: "recommendationTitle",
            render: (value: string) => <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{value}</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (value: number) => (
                <Tag color={value === 0 ? "success" : "default"}>
                    {value === 0 ? "Applied" : "Rolled Back"}
                </Tag>
            ),
        },
        {
            title: "Applied At",
            dataIndex: "creationTime",
            key: "creationTime",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.creationTime.localeCompare(b.creationTime),
            render: (value: string) =>
                new Date(value).toLocaleString([], {
                    year: "numeric", month: "2-digit", day: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                }),
        },
        {
            title: "Rolled Back At",
            dataIndex: "rolledBackAt",
            key: "rolledBackAt",
            render: (value: string | null) =>
                value
                    ? new Date(value).toLocaleString([], {
                          year: "numeric", month: "2-digit", day: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                      })
                    : "—",
        },
        {
            title: "SQL",
            key: "sql",
            render: (_, record) => (
                <Button size="small" type="link" onClick={() => setSqlModalRecord(record)}>
                    View SQL
                </Button>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) =>
                record.status === 0 ? (
                    <Popconfirm
                        title="Roll back migration"
                        description={
                            <>
                                <p>This will execute the rollback SQL on the live database.</p>
                            </>
                        }
                        onConfirm={() => void handleRollback(record.id)}
                        okText="Roll Back"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            size="small"
                            danger
                            icon={<RollbackOutlined />}
                            loading={rollingBackId === record.id}
                        >
                            Roll Back
                        </Button>
                    </Popconfirm>
                ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
                ),
        },
    ];

    const queryHistoryTab = (
        <>
            {isPending && entries.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <HistoryTable entries={pageEntries} />
                    <HistoryPagination
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        totalEntries={totalEntries}
                        currentPage={safePage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </>
    );

    const migrationsTab = (
        <>
            {rollbackSuccess && (
                <Alert type="success" title={rollbackSuccess} closable onClose={() => setRollbackSuccess(null)} style={{ marginBottom: 16 }} />
            )}
            {rollbackError && (
                <Alert type="error" title={`Rollback failed: ${rollbackError}`} closable onClose={() => setRollbackError(null)} style={{ marginBottom: 16 }} />
            )}
            {migrationsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <Table<IMigrationHistoryDto>
                        columns={migrationColumns}
                        dataSource={migrations.map((m) => ({ ...m, key: m.id }))}
                        pagination={{ pageSize: PAGE_SIZE }}
                        size="middle"
                        locale={{ emptyText: "No migrations have been applied yet." }}
                    />
                </div>
            )}
        </>
    );

    return (
        <>
            <HistoryHeader onFilter={() => {}} onExportCsv={() => {}} />
            <Tabs
                defaultActiveKey="queries"
                items={[
                    { key: "queries", label: "Query History", children: queryHistoryTab },
                    { key: "migrations", label: "Applied Migrations", children: migrationsTab },
                ]}
            />

            <Modal
                title="Migration SQL"
                open={sqlModalRecord !== null}
                onCancel={() => setSqlModalRecord(null)}
                width={760}
                footer={[
                    <Button key="close" type="primary" onClick={() => setSqlModalRecord(null)}>Close</Button>,
                ]}
            >
                {sqlModalRecord && (
                    <Tabs
                        items={[
                            {
                                key: "migration",
                                label: "Migration SQL",
                                children: (
                                    <pre style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", maxHeight: 400, whiteSpace: "pre-wrap" }}>
                                        {sqlModalRecord.migrationSql}
                                    </pre>
                                ),
                            },
                            {
                                key: "rollback",
                                label: "Rollback SQL",
                                children: (
                                    <pre style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.6, overflow: "auto", maxHeight: 400, whiteSpace: "pre-wrap" }}>
                                        {sqlModalRecord.rollbackSql || "No rollback SQL stored."}
                                    </pre>
                                ),
                            },
                        ]}
                    />
                )}
            </Modal>
        </>
    );
}
