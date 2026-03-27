"use client";

import { Menu } from "antd";
import {
    ThunderboltFilled,
    AppstoreOutlined,
    ThunderboltOutlined,
    CodeOutlined,
    DatabaseOutlined,
    ApartmentOutlined,
    HistoryOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useStyles } from "./style/styles";

const NAV_ITEMS = [
    { key: "/dashboard", icon: <AppstoreOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
    { key: "/dashboard/query-analysis", icon: <ThunderboltOutlined />, label: <Link href="/dashboard/query-analysis">Query Analysis</Link> },
    { key: "/dashboard/playground", icon: <CodeOutlined />, label: <Link href="/dashboard/playground">Playground</Link> },
    { key: "/dashboard/databases", icon: <DatabaseOutlined />, label: <Link href="/dashboard/databases">Databases</Link> },
    { key: "/dashboard/schema-advisor", icon: <ApartmentOutlined />, label: <Link href="/dashboard/schema-advisor">Schema Advisor</Link> },
    { key: "/dashboard/history", icon: <HistoryOutlined />, label: <Link href="/dashboard/history">History</Link> },
];

const SETTINGS_ITEMS = [
    { key: "/dashboard/settings", icon: <SettingOutlined />, label: <Link href="/dashboard/settings">Settings</Link> },
];

interface IDashboardSidebarProps {
    /** Called after a nav item is clicked — used to close the mobile drawer. */
    onNavClick?: () => void;
}

/** Left sidebar with branding, primary navigation, and settings link. */
const DashboardSidebar: React.FC<IDashboardSidebarProps> = ({ onNavClick }) => {
    const { styles } = useStyles();
    const pathname = usePathname();

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoArea}>
                <ThunderboltFilled className={styles.logoIcon} />
                <span className={styles.logoText}>SQL Optimiser</span>
            </div>
            <div className={styles.nav}>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={NAV_ITEMS}
                    onClick={onNavClick}
                />
            </div>
            <div className={styles.settingsArea}>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={SETTINGS_ITEMS}
                    onClick={onNavClick}
                />
            </div>
        </div>
    );
};

export default DashboardSidebar;
