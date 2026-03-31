"use client";

import React from "react";
import { Spin, Empty, Tooltip, Button } from "antd";
import { DeleteOutlined, HistoryOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";
import { IQueryHistoryDto } from "@/services/queryHistoryService";

interface IHistoryPanelProps {
    history: IQueryHistoryDto[];
    isLoading: boolean;
    hasConnection: boolean;
    onSelect: (query: string) => void;
    onDelete: (entryId: string) => void;
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(executionTime: string): string {
    // .NET serialises TimeSpan as "HH:MM:SS.fffffff"
    const match = /(\d+):(\d+):(\d+)\.?(\d*)/.exec(executionTime);
    if (!match) return executionTime;
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000 +
        (match[4] ? Math.round(parseInt(match[4].padEnd(7, "0")) / 10000) : 0);
    return totalMs < 1000 ? `${totalMs}ms` : `${(totalMs / 1000).toFixed(2)}s`;
}

/** Panel below the main layout showing query history for the selected connection. */
const HistoryPanel: React.FC<IHistoryPanelProps> = ({
    history,
    isLoading,
    hasConnection,
    onSelect,
    onDelete,
}) => {
    const { styles } = useStyles();

    const renderBody = (): React.JSX.Element => {
        if (!hasConnection) {
            return (
                <div className={styles.panelCentered}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select a connection" />
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className={styles.panelCentered}>
                    <Spin size="small" />
                </div>
            );
        }

        if (history.length === 0) {
            return (
                <div className={styles.panelCentered}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No history yet" />
                </div>
            );
        }

        return (
            <div className={styles.historyBody}>
                {history.map((entry) => (
                    <div
                        key={entry.id}
                        className={styles.historyEntry}
                        onClick={() => onSelect(entry.queryText)}
                    >
                        {entry.errorMessage && <span className={styles.historyErrorDot} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Tooltip title={entry.queryText} placement="top">
                                <div className={styles.historyQueryText}>{entry.queryText}</div>
                            </Tooltip>
                            <div className={styles.historyMeta}>
                                {formatTime(entry.creationTime)} &bull; {formatDuration(entry.executionTime)}
                            </div>
                        </div>
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(entry.id);
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <HistoryOutlined />
                History
            </div>
            {renderBody()}
        </div>
    );
};

export default HistoryPanel;
