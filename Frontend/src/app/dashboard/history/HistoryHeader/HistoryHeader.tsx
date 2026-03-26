"use client";

import React from "react";
import { Button } from "antd";
import { FilterOutlined, DownloadOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

interface IHistoryHeaderProps {
    /** Called when the user clicks Filter. */
    onFilter: () => void;
    /** Called when the user clicks Export CSV. */
    onExportCsv: () => void;
}

/** Page title row with heading, subtitle, and Filter / Export CSV action buttons. */
const HistoryHeader: React.FC<IHistoryHeaderProps> = ({ onFilter, onExportCsv }) => {
    const { styles } = useStyles();

    return (
        <div className={styles.pageHeader}>
            <div>
                <h1 className={styles.pageTitle}>Analysis History</h1>
                <p className={styles.pageSubtitle}>Log of all queries analysed and optimised across your team.</p>
            </div>
            <div className={styles.headerActions}>
                <Button icon={<FilterOutlined />} onClick={onFilter}>Filter</Button>
                <Button icon={<DownloadOutlined />} onClick={onExportCsv}>Export CSV</Button>
            </div>
        </div>
    );
};

export default HistoryHeader;
