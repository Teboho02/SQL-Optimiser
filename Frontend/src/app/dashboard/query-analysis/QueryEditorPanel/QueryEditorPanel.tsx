"use client";

import React from "react";
import { Button, Tag, Input } from "antd";
import { useStyles } from "../style/styles";

interface IQueryEditorPanelProps {
    /** Current SQL text in the editor. */
    sqlText: string;
    /** Called when the SQL text changes. */
    onSqlChange: (value: string) => void;
    /** Current intent description text. */
    intentText: string;
    /** Called when the intent text changes. */
    onIntentChange: (value: string) => void;
    /** Called when the user clicks Format. */
    onFormat: () => void;
    /** Called when the user clicks Clear. */
    onClear: () => void;
}

/** Left panel containing the SQL editor textarea and intent description input. */
const QueryEditorPanel: React.FC<IQueryEditorPanelProps> = ({
    sqlText,
    onSqlChange,
    intentText,
    onIntentChange,
    onFormat,
    onClear,
}) => {
    const { styles } = useStyles();

    return (
        <div className={styles.editorPanel}>
            <div className={styles.editorToolbar}>
                <div className={styles.editorToolbarLeft}>
                    <Tag color="blue">PostgreSQL</Tag>
                    <span className={styles.dbName}>prod-main</span>
                </div>
                <div className={styles.editorToolbarRight}>
                    <Button type="text" size="small" onClick={onFormat}>Format</Button>
                    <Button type="text" size="small" onClick={onClear}>Clear</Button>
                </div>
            </div>
            <textarea
                className={styles.sqlEditor}
                value={sqlText}
                onChange={(event) => onSqlChange(event.target.value)}
                placeholder="-- Paste your SQL query here..."
                spellCheck={false}
                aria-label="SQL editor"
            />
            <div className={styles.intentInputWrapper}>
                <Input
                    value={intentText}
                    onChange={(event) => onIntentChange(event.target.value)}
                    placeholder="Optional: Describe intent (e.g., 'Get active users with their recent order count')"
                    variant="borderless"
                    aria-label="Query intent description"
                />
            </div>
        </div>
    );
};

export default QueryEditorPanel;
