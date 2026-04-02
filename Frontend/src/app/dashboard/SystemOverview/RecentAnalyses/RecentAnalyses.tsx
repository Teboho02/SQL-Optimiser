"use client";

import { Table, Tag, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { useStyles } from "../style/styles";
import { IRecentActivityItemDto } from "@/services/dashboardService";

interface IAnalysisRow {
    key: string;
    shortId: string;
    queryPreview: string;
    connectionName: string;
    wasOptimised: boolean;
    timestamp: string;
}

interface IRecentAnalysesProps {
    activity: IRecentActivityItemDto[];
    loading: boolean;
}

/** Table listing recent query history with ID, preview, connection, status, and timestamp. */
const RecentAnalyses: React.FC<IRecentAnalysesProps> = ({ activity, loading }) => {
    const { styles } = useStyles();

    const columns: ColumnsType<IAnalysisRow> = [
        {
            title: "ID",
            dataIndex: "shortId",
            key: "shortId",
            render: (value: string) => <span className={styles.idCell}>{value}</span>,
        },
        {
            title: "Query Preview",
            dataIndex: "queryPreview",
            key: "queryPreview",
            render: (value: string) => <span className={styles.queryCell}>{value}</span>,
        },
        {
            title: "Connection",
            dataIndex: "connectionName",
            key: "connectionName",
        },
        {
            title: "Status",
            dataIndex: "wasOptimised",
            key: "wasOptimised",
            render: (value: boolean) => (
                <Tag color={value ? "success" : "default"}>{value ? "Optimised" : "Executed"}</Tag>
            ),
        },
        {
            title: "Time",
            dataIndex: "timestamp",
            key: "timestamp",
        },
    ];

    const data: IAnalysisRow[] = activity.map((item) => ({
        key: item.id,
        shortId: item.id.slice(0, 8).toUpperCase(),
        queryPreview: item.queryPreview,
        connectionName: item.connectionName,
        wasOptimised: item.wasOptimised,
        timestamp: new Date(item.timestamp).toLocaleString(),
    }));

    return (
        <div>
            <h2 className={styles.sectionTitle}>Recent Analyses</h2>
            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className={styles.skeletonWrapper}>
                        <Skeleton active paragraph={{ rows: 5 }} />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        size="middle"
                    />
                )}
            </div>
        </div>
    );
};

export default RecentAnalyses;
