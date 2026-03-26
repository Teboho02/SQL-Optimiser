"use client";

import { Input, Select } from "antd";
import { DatabaseOutlined, SearchOutlined, BellOutlined, MenuOutlined } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

const CLUSTER_OPTIONS = [
    { value: "staging-cluster-1", label: "staging-cluster-1" },
    { value: "prod-main", label: "prod-main" },
    { value: "prod-analytics", label: "prod-analytics" },
];

interface IDashboardHeaderProps {
    /** Opens the mobile sidebar drawer. */
    onMenuClick: () => void;
}

/** Top header bar with hamburger (mobile), cluster selector, search, notifications, and avatar. */
const DashboardHeader: React.FC<IDashboardHeaderProps> = ({ onMenuClick }) => {
    const { styles } = useStyles();

    return (
        <header className={styles.header}>
            <div className={styles.leftGroup}>
                <MenuOutlined className={styles.menuButton} onClick={onMenuClick} />
                <div className={styles.clusterSelector}>
                    <DatabaseOutlined className={styles.clusterIcon} />
                    <Select
                        defaultValue="staging-cluster-1"
                        options={CLUSTER_OPTIONS}
                        className={styles.clusterSelect}
                    />
                </div>
            </div>
            <div className={styles.rightActions}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search queries, tables..."
                    suffix={<span className={styles.searchHint}>⌘ K</span>}
                    className={styles.searchBar}
                />
                <SearchOutlined className={styles.searchIconButton} />
                <BellOutlined className={styles.bellButton} />
                <div className={styles.avatar} />
            </div>
        </header>
    );
};

export default DashboardHeader;
