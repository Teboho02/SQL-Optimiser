"use client";

import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { useStyles } from "../style/styles";

interface IAnalysisRow {
    key: string;
    id: string;
    queryPreview: string;
    database: string;
    improvement: string;
    status: "success" | "warning" | "error";
}

const ANALYSES_DATA: IAnalysisRow[] = [
    { key: "1", id: "ANL-892", queryPreview: "SELECT * FROM users JOIN orders...", database: "prod-main", improvement: "+85%", status: "success" },
    { key: "2", id: "ANL-891", queryPreview: "UPDATE inventory SET stock = ...", database: "prod-main", improvement: "+12%", status: "success" },
    { key: "3", id: "ANL-890", queryPreview: "SELECT COUNT(*) FROM events WHERE...", database: "prod-analytics", improvement: "N/A", status: "warning" },
    { key: "4", id: "ANL-889", queryPreview: "DELETE FROM sessions WHERE...", database: "staging-1", improvement: "+99%", status: "success" },
];

const STATUS_COLOR: Record<IAnalysisRow["status"], string> = {
    success: "success",
    warning: "warning",
    error: "error",
};

/** Table listing recent query analyses with ID, preview, database, improvement, and status. */
const RecentAnalyses: React.FC = () => {
    const { styles } = useStyles();

    const columns: ColumnsType<IAnalysisRow> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (value: string) => <span className={styles.idCell}>{value}</span>,
        },
        {
            title: "Query Preview",
            dataIndex: "queryPreview",
            key: "queryPreview",
            render: (value: string) => <span className={styles.queryCell}>{value}</span>,
        },
        {
            title: "Database",
            dataIndex: "database",
            key: "database",
        },
        {
            title: "Improvement",
            dataIndex: "improvement",
            key: "improvement",
            render: (value: string) => (
                <span className={value === "N/A" ? styles.improvementNeutral : styles.improvementPositive}>
                    {value}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (value: IAnalysisRow["status"]) => (
                <Tag color={STATUS_COLOR[value]}>{value}</Tag>
            ),
        },
    ];

    return (
        <div>
            <h2 className={styles.sectionTitle}>Recent Analyses</h2>
            <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={ANALYSES_DATA}
                    pagination={false}
                    size="middle"
                />
            </div>
        </div>
    );
};

export default RecentAnalyses;
