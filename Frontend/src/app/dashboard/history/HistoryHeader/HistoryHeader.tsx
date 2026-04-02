"use client";

import React from "react";
import { useStyles } from "../style/styles";

/** Page title row with heading and subtitle. */
const HistoryHeader: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.pageHeader}>
            <div>
                <h1 className={styles.pageTitle}>Analysis History</h1>
                <p className={styles.pageSubtitle}>Log of all queries analysed and optimised across your team.</p>
            </div>
        </div>
    );
};

export default HistoryHeader;
