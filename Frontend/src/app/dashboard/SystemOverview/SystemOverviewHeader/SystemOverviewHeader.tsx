"use client";

import React from "react";
import { useStyles } from "../style/styles";

/** Page title row with "System Overview" heading and last-updated timestamp. */
const SystemOverviewHeader: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>System Overview</h1>
            <span className={styles.lastUpdated}>Last updated: Just now</span>
        </div>
    );
};

export default SystemOverviewHeader;
