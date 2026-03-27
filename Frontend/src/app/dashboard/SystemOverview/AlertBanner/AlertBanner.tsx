"use client";

import { WarningOutlined } from "@ant-design/icons";
import React from "react";
import { useStyles } from "../style/styles";

/** Red alert banner highlighting critical database issues. */
const AlertBanner: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.alertBanner}>
            <WarningOutlined className={styles.alertIcon} />
            <div>
                <p className={styles.alertTitle}>3 critical issues detected across 2 databases</p>
                <p className={styles.alertBody}>
                    Full table scans detected on{" "}
                    <code className={styles.alertCode}>prod-main.users</code>
                    {" "}and{" "}
                    <code className={styles.alertCode}>prod-analytics.events</code>
                    . Immediate index creation recommended.
                </p>
            </div>
        </div>
    );
};

export default AlertBanner;
