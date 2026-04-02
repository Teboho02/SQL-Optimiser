"use client";

import React from "react";
import { Button } from "antd";
import { ArrowRightOutlined, TableOutlined, ExperimentOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** A single column in a schema table. */
interface ISchemaColumn {
    /** Column name. */
    name: string;
    /** Data type string (e.g. "uuid", "varchar", "jsonb (large)"). */
    type: string;
    /** Whether this column is visually highlighted as problematic or new. */
    highlight?: "warning" | "new";
}

/** A table shown in the schema diff diagram. */
interface ISchemaTableDef {
    /** Display name including state label, e.g. "events (Current)". */
    label: string;
    /** Whether this is the current (before) or a proposed new table. */
    variant: "current" | "new";
    /** Columns to display. */
    columns: ISchemaColumn[];
}

/** Before/after metric shown below the schema diff. */
interface IMetric {
    /** Metric label. */
    label: string;
    /** Value before the change. */
    before: string;
    /** Value after the change. */
    after: string;
}

/** Full detail data for a selected recommendation. */
interface IRefactoringDetail {
    /** Panel title, e.g. "Refactoring: events table". */
    title: string;
    /** The current (before) table definition. */
    currentTable: ISchemaTableDef;
    /** One or more proposed new tables. */
    newTables: ISchemaTableDef[];
    /** Before/after metrics. */
    metrics: IMetric[];
}

interface IRefactoringPanelProps {
    /** Detail data for the selected recommendation. */
    detail: IRefactoringDetail;
    /** Called when the user clicks Generate Migration. */
    onGenerateMigration: () => void;
    /** Called when the user clicks Compare Schemas. */
    onCompare: () => void;
}

/** Renders a single schema table box with header and column rows. */
const SchemaTableBox: React.FC<{ table: ISchemaTableDef; styles: Record<string, string> }> = ({ table, styles }) => {
    const headerClass = table.variant === "current" ? styles.schemaTableHeaderCurrent : styles.schemaTableHeaderNew;

    return (
        <div className={styles.schemaTable}>
            <div className={headerClass}>
                <TableOutlined />
                {table.label}
            </div>
            {table.columns.map((column) => {
                let rowClass = styles.schemaRow;
                if (column.highlight === "warning") { rowClass += ` ${styles.schemaRowHighlighted}`; }
                if (column.highlight === "new") { rowClass += ` ${styles.schemaRowNew}`; }
                return (
                    <div key={column.name} className={rowClass}>
                        <span>{column.name}</span>
                        <span className={styles.schemaColumnType}>{column.type}</span>
                    </div>
                );
            })}
        </div>
    );
};

/** Right panel showing the schema diff diagram and impact metrics for the selected recommendation. */
const RefactoringPanel: React.FC<IRefactoringPanelProps> = ({ detail, onGenerateMigration, onCompare }) => {
    const { styles } = useStyles();

    return (
        <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
                <h2 className={styles.detailTitle}>{detail.title}</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <Button icon={<ExperimentOutlined />} onClick={onCompare}>Compare Schemas</Button>
                    <Button type="primary" onClick={onGenerateMigration}>Generate Migration</Button>
                </div>
            </div>
            <div className={styles.schemaDiagram}>
                <SchemaTableBox table={detail.currentTable} styles={styles} />
                <ArrowRightOutlined className={styles.diagramArrow} />
                <div className={styles.diagramRight}>
                    {detail.newTables.map((table) => (
                        <SchemaTableBox key={table.label} table={table} styles={styles} />
                    ))}
                </div>
            </div>
            <div className={styles.metricsRow}>
                {detail.metrics.map((metric) => (
                    <div key={metric.label} className={styles.metricCard}>
                        <p className={styles.metricLabel}>{metric.label}</p>
                        <p className={styles.metricValue}>
                            {metric.before}
                            <span className={styles.metricArrow}> → </span>
                            <span className={styles.metricAfter}>{metric.after}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RefactoringPanel;
