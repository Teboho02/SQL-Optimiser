"use client";

import React from "react";
import { Button } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

interface IQueryAnalysisHeaderProps {
    /** Called when the user clicks Analyse Query. */
    onAnalyse: () => void;
    /** Whether analysis is currently in progress. */
    isAnalysing: boolean;
}

/** Page title row with heading, subtitle, and the Analyse Query action button. */
const QueryAnalysisHeader: React.FC<IQueryAnalysisHeaderProps> = ({ onAnalyse, isAnalysing }) => {
    const { styles } = useStyles();

    return (
        <div className={styles.pageHeader}>
            <div>
                <h1 className={styles.pageTitle}>Query Analysis</h1>
                <p className={styles.pageSubtitle}>Paste your SQL to detect bottlenecks and generate optimised alternatives.</p>
            </div>
            <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                size="large"
                loading={isAnalysing}
                onClick={onAnalyse}
                className={styles.analyseButton}
            >
                Analyse Query
            </Button>
        </div>
    );
};

export default QueryAnalysisHeader;
