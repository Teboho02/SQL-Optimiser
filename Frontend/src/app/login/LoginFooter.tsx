"use client";

import React from "react";
import { useStyles } from "./style/styles";

/** "Don't have an account?" prompt with request access link. */
const LoginFooter: React.FC = () => {
    const { styles } = useStyles();

    return (
        <p className={styles.footer}>
            {"Don't have an account? "}
            <span className={styles.footerLink}>Request access</span>
        </p>
    );
};

export default LoginFooter;
