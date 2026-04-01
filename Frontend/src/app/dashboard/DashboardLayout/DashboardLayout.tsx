"use client";

import { Drawer } from "antd";
import React, { useState } from "react";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import { useStyles } from "./style/styles";

interface IDashboardLayoutProps {
    children: React.ReactNode;
}

/** Structural shell that manages the sidebar, mobile drawer, header, and scrollable content area. */
const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ children }) => {
    const { styles } = useStyles();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <DashboardSidebar />
            </aside>

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                placement="left"
                width={256}
                styles={{ body: { padding: 0, background: "#111827" }, header: { display: "none" } }}
                closable={false}
            >
                <DashboardSidebar onNavClick={() => setDrawerOpen(false)} />
            </Drawer>

            <div className={styles.body}>
                <DashboardHeader onMenuClick={() => setDrawerOpen(true)} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
