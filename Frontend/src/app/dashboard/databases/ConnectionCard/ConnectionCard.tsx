"use client";

import React from "react";
import { Button } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
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
}

interface IConnectionCardProps {
    database: IDatabase;
}

/** Card displaying a single database connection's metadata and status. */
const ConnectionCard: React.FC<IConnectionCardProps> = ({ database }) => {
    const { styles } = useStyles();

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
                <Button type="text" size="small">Configure</Button>
            </div>
        </div>
    );
};

export default ConnectionCard;
