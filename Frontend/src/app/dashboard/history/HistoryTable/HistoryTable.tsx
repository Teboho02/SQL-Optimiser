"use client";

import React from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useStyles } from "../style/styles";

/** Status of a historical analysis entry. */
type HistoryStatus = "success" | "warning" | "critical";

/** A single entry in the analysis history log. */
interface IHistoryEntry {
    /** Unique analysis reference ID (e.g. ANL-892). */
    id: string;
    /** Truncated SQL query preview. */
    queryPreview: string;
    /** Connected database name. */
    database: string;
    /** Performance improvement percentage, or null when not applicable. */
    improvement: string | null;
    /** Outcome status of the analysis. */
    status: HistoryStatus;
    /** Formatted date and time string. */
    date: string;
}

interface IHistoryTableProps {
    /** Rows to display in the table. */
    entries: IHistoryEntry[];
}

const STATUS_COLORS: Record<HistoryStatus, string> = {
    success: "success",
    warning: "warning",
    critical: "error",
};

/** Renders improvement value with appropriate colour styling. */
const ImprovementCell: React.FC<{ value: string | null; styles: Record<string, string> }> = ({ value, styles }) => {
    if (!value) { return <span className={styles.improvementNeutral}>N/A</span>; }
    if (value === "Error") { return <span className={styles.improvementError}>Error</span>; }
    return <span className={styles.improvementPositive}>{value}</span>;
};

/** Sortable data table listing historical analysis entries. */
const HistoryTable: React.FC<IHistoryTableProps> = ({ entries }) => {
    const { styles } = useStyles();

    const columns: TableProps<IHistoryEntry>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: "Query Preview",
            dataIndex: "queryPreview",
            key: "queryPreview",
            render: (value: string) => (
                <span className={styles.queryPreview}>{value}</span>
            ),
        },
        {
            title: "Database",
            dataIndex: "database",
            key: "database",
            sorter: (a, b) => a.database.localeCompare(b.database),
        },
        {
            title: "Improvement",
            dataIndex: "improvement",
            key: "improvement",
            sorter: (a, b) => {
                const parse = (value: string | null): number => {
                    if (!value || value === "Error") { return -Infinity; }
                    return parseFloat(value.replace("%", "").replace("+", ""));
                };
                return parse(a.improvement) - parse(b.improvement);
            },
            render: (value: string | null) => (
                <ImprovementCell value={value} styles={styles} />
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (value: HistoryStatus) => (
                <Tag color={STATUS_COLORS[value]}>{value}</Tag>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
    ];

    return (
        <div className={styles.tableWrapper}>
            <Table<IHistoryEntry>
                columns={columns}
                dataSource={entries.map((entry) => ({ ...entry, key: entry.id }))}
                pagination={false}
                size="middle"
            />
        </div>
    );
};

export default HistoryTable;
