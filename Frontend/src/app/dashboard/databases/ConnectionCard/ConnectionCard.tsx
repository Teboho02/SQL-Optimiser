"use client";

import React from "react";
import { Button, Tag, Tooltip } from "antd";
import { DatabaseOutlined, EditOutlined, CloudDownloadOutlined, ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** Connection status values for a database card. */
export type TConnectionStatus = "connected" | "disconnected";

/** Shape of a single database connection entry. */
export interface IDatabase {
    /** Unique identifier for the connection. */
    id: string;
    /** Display name of the connection. */
    name: string;
    /** Database engine name (e.g. PostgreSQL). */
    engine: string;
    /** Engine major version. */
    version: number;
    /** Hostname or address of the database. */
    host: string;
    /** Measured round-trip latency, or "-" if unavailable. */
    latency: string;
    /** Whether the connection is currently active. */
    status: TConnectionStatus;
    /** Human-readable restore status label. */
    restoreStatus: string;
    /** Whether a local copy of the database is ready to query. */
    isLocalReady: boolean;
    /** Raw dump status enum value (0=None,1=Pending,2=InProgress,3=Completed,4=Failed). */
    dumpStatus: number;
    /** Raw restore status enum value (0=None,1=Pending,2=InProgress,3=Completed,4=Failed). */
    restoreStatusRaw: number;
    /** Whether this connection was configured to dump schema only (no row data). */
    schemaOnly: boolean;
}

interface IConnectionCardProps {
    database: IDatabase;
    onEdit: () => void;
    onDump: () => void;
    onRebuild: () => void;
    onGenerateData: () => void;
    isDumping: boolean;
    isRebuilding: boolean;
}

/** Card displaying a single database connection's metadata and status. */
const ConnectionCard: React.FC<IConnectionCardProps> = ({ database, onEdit, onDump, onRebuild, onGenerateData, isDumping, isRebuilding }) => {
    const { styles } = useStyles();

    const dumpBusy = isDumping || database.dumpStatus === 1 || database.dumpStatus === 2;
    const rebuildBusy = isRebuilding || database.restoreStatusRaw === 1 || database.restoreStatusRaw === 2;
    const canRebuild = database.dumpStatus === 3;

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIconWrapper}>
                    <DatabaseOutlined />
                </div>
                <div>
                    <p className={styles.cardName}>{database.name}</p>
                    <p className={styles.cardEngine}>{database.engine} {database.version}</p>
                </div>
            </div>
            <div className={styles.cardMeta}>
                <div className={styles.cardMetaRow}>
                    <span className={styles.cardMetaLabel}>Host</span>
                    <span className={styles.cardMetaValue}>{database.host}</span>
                </div>
                <div className={styles.cardMetaRow}>
                    <span className={styles.cardMetaLabel}>Latency</span>
                    <span className={styles.cardMetaValue}>{database.latency}</span>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <span className={database.status === "connected" ? styles.badgeConnected : styles.badgeDisconnected}>
                    {database.status}
                </span>
                <span className={database.isLocalReady ? styles.badgeConnected : styles.badgeDisconnected}>
                    {database.restoreStatus}
                </span>
                {database.schemaOnly && <Tag color="blue">Schema Only</Tag>}
            </div>
            <div className={styles.cardActions}>
                <Tooltip title="Dump — capture a fresh snapshot from the live database">
                    <Button
                        size="small"
                        icon={<CloudDownloadOutlined />}
                        loading={dumpBusy}
                        disabled={dumpBusy}
                        onClick={onDump}
                    >
                        Dump
                    </Button>
                </Tooltip>
                <Tooltip title={canRebuild ? "Rebuild — restore the latest dump to the local server" : "A completed dump is required before rebuilding"}>
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        loading={rebuildBusy}
                        disabled={rebuildBusy || !canRebuild}
                        onClick={onRebuild}
                    >
                        Rebuild
                    </Button>
                </Tooltip>
                {database.schemaOnly && database.isLocalReady && (
                    <Tooltip title="Browse tables and generate AI test data for this schema-only database">
                        <Button
                            size="small"
                            icon={<ThunderboltOutlined />}
                            onClick={onGenerateData}
                        >
                            Generate Data
                        </Button>
                    </Tooltip>
                )}
                <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
            </div>
        </div>
    );
};

export default ConnectionCard;
