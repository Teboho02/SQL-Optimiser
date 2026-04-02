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
    LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useStyles } from "./style/styles";
import { tokenService } from "@/services/tokenService";

const NAV_ITEMS = [
    { key: "/dashboard", icon: <AppstoreOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
    { key: "/dashboard/query-analysis", icon: <ThunderboltOutlined />, label: <Link href="/dashboard/query-analysis">Query Analysis</Link> },
    { key: "/dashboard/playground", icon: <CodeOutlined />, label: <Link href="/dashboard/playground">Playground</Link> },
    { key: "/dashboard/databases", icon: <DatabaseOutlined />, label: <Link href="/dashboard/databases">Databases</Link> },
    { key: "/dashboard/schema-advisor", icon: <ApartmentOutlined />, label: <Link href="/dashboard/schema-advisor">Schema Advisor</Link> },
    { key: "/dashboard/history", icon: <HistoryOutlined />, label: <Link href="/dashboard/history">History</Link> },
];

interface IDashboardSidebarProps {
    /** Called after a nav item is clicked — used to close the mobile drawer. */
    onNavClick?: () => void;
}

/** Left sidebar with branding, primary navigation, and sign-out button. */
const DashboardSidebar: React.FC<IDashboardSidebarProps> = ({ onNavClick }) => {
    const { styles } = useStyles();
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = (): void => {
        tokenService.clear();
        router.push("/login");
    };

    const SIGN_OUT_ITEMS = [
        { key: "signout", icon: <LogoutOutlined />, label: "Sign Out", danger: true },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoArea}>
                <ThunderboltFilled className={styles.logoIcon} />
                <span className={styles.logoText}>SQL Ninja</span>
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
                    selectedKeys={[]}
                    items={SIGN_OUT_ITEMS}
                    onClick={handleSignOut}
                />
            </div>
        </div>
    );
};

export default DashboardSidebar;
