"use client";

import React from "react";
import { Spin } from "antd";
import ConnectionCard, { IDatabase } from "../ConnectionCard/ConnectionCard";
import { useStyles } from "../style/styles";

interface IConnectionCardListProps {
    databases: IDatabase[];
    isLoading: boolean;
}

/** Grid of all registered database connection cards. */
const ConnectionCardList: React.FC<IConnectionCardListProps> = ({ databases, isLoading }) => {
    const { styles } = useStyles();

    if (isLoading) {
        return (
            <div className={styles.loadingWrapper}>
                <Spin size="large" />
            </div>
        );
    }

    if (databases.length === 0) {
        return (
            <p className={styles.emptyState}>No database connections saved yet. Add one below.</p>
        );
    }

    return (
        <div className={styles.cardsGrid}>
            {databases.map((database) => (
                <ConnectionCard key={database.id} database={database} />
            ))}
        </div>
    );
};

export default ConnectionCardList;
