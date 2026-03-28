"use client";

import { Button } from "antd";
import { ThunderboltFilled } from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import { useStyles } from "./style/styles";

/** Top navigation bar with logo, sign-in link, and get-started CTA. */
const LandingNavbar: React.FC = () => {
    const { styles } = useStyles();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <ThunderboltFilled className={styles.logoIcon} />
                <span className={styles.logoText}>SQL Ninja</span>
            </div>
            <div className={styles.navActions}>
                <Link href="/login" className={styles.signInLink}>Sign in</Link>
                <Link href="/login">
                    <Button type="primary" size="middle">
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    );
};

export default LandingNavbar;
