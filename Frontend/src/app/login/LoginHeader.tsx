"use client";

import { ThunderboltFilled } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

/** Logo icon, page title, and subtitle for the login page. */
const LoginHeader: React.FC = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.header}>
            <div className={styles.logoIcon}>
                <ThunderboltFilled />
            </div>
            <h1 className={styles.title}>Sign in to Optimiser</h1>
            <p className={styles.subtitle}>Welcome back, engineer.</p>
        </div>
    );
};

export default LoginHeader;
