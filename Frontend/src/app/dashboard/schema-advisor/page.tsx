"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { ScanOutlined } from "@ant-design/icons";
import RecommendationList from "./RecommendationList/RecommendationList";
import RefactoringPanel from "./RefactoringPanel/RefactoringPanel";
import { useStyles } from "./style/styles";

type ImpactLevel = "high" | "medium" | "low";

interface IRecommendation {
    id: string;
    title: string;
    impact: ImpactLevel;
    description: string;
    estimatedDowntime: string;
}

interface ISchemaColumn {
    name: string;
    type: string;
    highlight?: "warning" | "new";
}

interface ISchemaTableDef {
    label: string;
    variant: "current" | "new";
    columns: ISchemaColumn[];
}

interface IMetric {
    label: string;
    before: string;
    after: string;
}

interface IRefactoringDetail {
    title: string;
    currentTable: ISchemaTableDef;
    newTables: ISchemaTableDef[];
    metrics: IMetric[];
}

const RECOMMENDATIONS: IRecommendation[] = [
    {
        id: "split-events",
        title: "Split Table: events",
        impact: "high",
        description: "Table `events` has 450M rows and wide JSONB columns. Splitting payload data to a separate table will improve scan times by ~80%.",
        estimatedDowntime: "Est. downtime: 0s (Online DDL)",
    },
    {
        id: "denormalize-user_stats",
        title: "Denormalize: user_stats",
        impact: "medium",
        description: "Frequent aggregations on `orders` and `logins`. Create a materialized view or trigger-updated stats table.",
        estimatedDowntime: "Est. downtime: 0s (Online DDL)",
    },
];

// mock refactoring details keyed by recommendation id
const REFACTORING_DETAILS: Record<string, IRefactoringDetail> = {
    "split-events": {
        title: "Refactoring: events table",
        currentTable: {
            label: "events (Current)",
            variant: "current",
            columns: [
                { name: "id", type: "uuid" },
                { name: "user_id", type: "uuid" },
                { name: "type", type: "varchar" },
                { name: "payload", type: "jsonb (large)", highlight: "warning" },
                { name: "created_at", type: "timestamp" },
            ],
        },
        newTables: [
            {
                label: "events (New)",
                variant: "new",
                columns: [
                    { name: "id", type: "uuid" },
                    { name: "user_id", type: "uuid" },
                    { name: "type", type: "varchar" },
                    { name: "created_at", type: "timestamp" },
                ],
            },
            {
                label: "event_payloads",
                variant: "new",
                columns: [
                    { name: "event_id", type: "uuid (FK)", highlight: "new" },
                    { name: "payload", type: "jsonb", highlight: "new" },
                ],
            },
        ],
        metrics: [
            { label: "Sequential Scan Time", before: "12s", after: "1.5s" },
            { label: "Storage Size (Main Table)", before: "140GB", after: "12GB" },
        ],
    },
    "denormalize-user_stats": {
        title: "Refactoring: user_stats",
        currentTable: {
            label: "orders (Current)",
            variant: "current",
            columns: [
                { name: "id", type: "uuid" },
                { name: "user_id", type: "uuid" },
                { name: "total", type: "numeric" },
                { name: "status", type: "varchar" },
                { name: "created_at", type: "timestamp" },
            ],
        },
        newTables: [
            {
                label: "user_stats (New)",
                variant: "new",
                columns: [
                    { name: "user_id", type: "uuid (FK)", highlight: "new" },
                    { name: "order_count", type: "integer", highlight: "new" },
                    { name: "total_spend", type: "numeric", highlight: "new" },
                    { name: "updated_at", type: "timestamp", highlight: "new" },
                ],
            },
        ],
        metrics: [
            { label: "Aggregation Query Time", before: "8.2s", after: "0.4s" },
            { label: "Queries per Second", before: "12", after: "340" },
        ],
    },
};

/** Schema Advisor page — AI-driven recommendations for normalisation and structural improvements. */
export default function SchemaAdvisorPage(): React.JSX.Element {
    const { styles } = useStyles();
    const [selectedId, setSelectedId] = useState<string>(RECOMMENDATIONS[0].id);

    const handleScanSchema = (): void => {
        // todo: trigger backend schema scan
    };

    const handleGenerateMigration = (): void => {
        // todo: call backend migration generation API for selectedId
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Schema Advisor</h1>
                    <p className={styles.pageSubtitle}>AI-driven recommendations for normalisation and structural improvements.</p>
                </div>
                <Button icon={<ScanOutlined />} size="large" onClick={handleScanSchema}>
                    Scan Schema
                </Button>
            </div>
            <div className={styles.twoColumnLayout}>
                <RecommendationList
                    recommendations={RECOMMENDATIONS}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
                <RefactoringPanel
                    detail={REFACTORING_DETAILS[selectedId]}
                    onGenerateMigration={handleGenerateMigration}
                />
            </div>
        </>
    );
}
