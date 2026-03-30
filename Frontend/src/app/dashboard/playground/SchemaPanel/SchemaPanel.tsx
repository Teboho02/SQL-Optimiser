"use client";

import React, { useState } from "react";
import { Input, Spin, Alert } from "antd";
import { TableOutlined, BorderOutlined, SearchOutlined, RightOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

/** A single table entry in the schema browser. */
interface ISchemaTable {
    /** Table name. */
    name: string;
    /** Ordered list of column names. */
    columns: string[];
}

interface ISchemaPanelProps {
    /** Tables to display in the schema browser. */
    tables: ISchemaTable[];
    isLoading: boolean;
    error: string | null;
    hasConnection: boolean;
}

/** Left panel displaying a filterable tree of database tables and their columns. */
const SchemaPanel: React.FC<ISchemaPanelProps> = ({ tables, isLoading, error, hasConnection }) => {
    const { styles } = useStyles();
    const [filter, setFilter] = useState<string>("");
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(["users"]));

    const filteredTables = tables.filter((table) =>
        table.name.toLowerCase().includes(filter.toLowerCase())
    );

    const toggleTable = (tableName: string): void => {
        setExpandedTables((previous) => {
            const next = new Set(previous);
            if (next.has(tableName)) {
                next.delete(tableName);
            } else {
                next.add(tableName);
            }
            return next;
        });
    };

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <TableOutlined />
                Schema
            </div>
            <div className={styles.schemaFilter}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Filter tables..."
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    size="small"
                    variant="filled"
                />
            </div>
            <div className={styles.schemaBody}>
                {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                        <Spin />
                    </div>
                ) : error ? (
                    <Alert type="error" message={error} style={{ margin: 8 }} />
                ) : !hasConnection ? (
                    <div style={{ padding: 16, color: "#8c8c8c", fontSize: 13, textAlign: "center" }}>
                        Select a connection to view schema
                    </div>
                ) : filteredTables.length === 0 ? (
                    <div style={{ padding: 16, color: "#8c8c8c", fontSize: 13, textAlign: "center" }}>
                        No tables found
                    </div>
                ) : filteredTables.map((table) => {
                    const isExpanded = expandedTables.has(table.name);
                    return (
                        <React.Fragment key={table.name}>
                            <div
                                className={styles.tableItem}
                                onClick={() => toggleTable(table.name)}
                                role="button"
                                aria-expanded={isExpanded}
                            >
                                <TableOutlined className={styles.tableIcon} />
                                {table.name}
                                <RightOutlined className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`} />
                            </div>
                            {isExpanded && table.columns.map((column) => (
                                <div key={column} className={styles.columnItem}>
                                    <BorderOutlined className={styles.columnIcon} />
                                    {column}
                                </div>
                            ))}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default SchemaPanel;
