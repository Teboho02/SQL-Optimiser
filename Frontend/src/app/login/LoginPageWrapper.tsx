"use client";

import React from "react";
import { useStyles } from "./style/styles";

interface ILoginPageWrapperProps {
    children: React.ReactNode;
}

/** Outer grid-background layout and centered card wrapper for the login page. */
const LoginPageWrapper: React.FC<ILoginPageWrapperProps> = ({ children }) => {
    const { styles } = useStyles();

    const [header, card, footer] = React.Children.toArray(children);

    return (
        <div className={styles.page}>
            {header}
            <div className={styles.card}>
                {card}
            </div>
            {footer}
        </div>
    );
};

export default LoginPageWrapper;
