"use client";

import React from "react";
import ConnectionCard, { IDatabase } from "../ConnectionCard/ConnectionCard";
import { useStyles } from "../style/styles";

const DATABASES: IDatabase[] = [
    {
        id: "prod-main",
        name: "prod-main",
        engine: "PostgreSQL",
        version: 15,
        host: "db-main.internal.aws",
        latency: "12ms",
        status: "connected",
    },
    {
        id: "prod-analytics",
        name: "prod-analytics",
        engine: "PostgreSQL",
        version: 14,
        host: "db-analytics.internal.aws",
        latency: "45ms",
        status: "connected",
    },
    {
        id: "staging-1",
        name: "staging-1",
        engine: "PostgreSQL",
        version: 15,
        host: "staging.internal.aws",
        latency: "-",
        status: "disconnected",
    },
];

/** Grid of all registered database connection cards. */
const ConnectionCardList: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.cardsGrid}>
            {DATABASES.map((database) => (
                <ConnectionCard key={database.id} database={database} />
            ))}
        </div>
    );
};

export default ConnectionCardList;
