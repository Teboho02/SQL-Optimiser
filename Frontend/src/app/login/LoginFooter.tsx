"use client";

import Link from "next/link";
import React from "react";
import { useStyles } from "./style/styles";

/** "Don't have an account?" prompt linking to the sign-up page. */
const LoginFooter: React.FC = () => {
    const { styles } = useStyles();

    return (
        <p className={styles.footer}>
            {"Don't have an account? "}
            <Link href="/signup" className={styles.footerLink}>Sign up</Link>
        </p>
    );
};

export default LoginFooter;
