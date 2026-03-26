"use client";

import { Button } from "antd";
import { ThunderboltFilled } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

/** Top navigation bar with logo, sign-in link, and get-started CTA. */
const LandingNavbar: React.FC = () => {
    const { styles } = useStyles();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <ThunderboltFilled className={styles.logoIcon} />
                <span className={styles.logoText}>SQL Optimiser</span>
            </div>
            <div className={styles.navActions}>
                <span className={styles.signInLink}>Sign in</span>
                <Button type="primary" size="middle">
                    Get Started
                </Button>
            </div>
        </nav>
    );
};

export default LandingNavbar;
