"use client";

import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

interface IDashboardHeaderProps {
    /** Opens the mobile sidebar drawer. */
    onMenuClick: () => void;
}

/** Top header bar with hamburger (mobile), notifications, and avatar. */
const DashboardHeader: React.FC<IDashboardHeaderProps> = ({ onMenuClick }) => {
    const { styles } = useStyles();

    return (
        <header className={styles.header}>
            <div className={styles.leftGroup}>
                <MenuOutlined className={styles.menuButton} onClick={onMenuClick} />
            </div>
            <div className={styles.rightActions}>
                <BellOutlined className={styles.bellButton} />
                <div className={styles.avatar} />
            </div>
        </header>
    );
};

export default DashboardHeader;
