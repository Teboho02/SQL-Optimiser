"use client";

import React from "react";
import { withAuth } from "@/hoc/withAuth";
import { DatabaseConnectionProvider } from "@/providers/databaseConnection";
import { QueryHistoryProvider } from "@/providers/queryHistory";
import { SchemaAdvisorHistoryProvider } from "@/providers/schemaAdvisorHistory";
import DashboardLayout from "./DashboardLayout/DashboardLayout";

function InnerLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <DatabaseConnectionProvider>
            <QueryHistoryProvider>
                <SchemaAdvisorHistoryProvider>
                    <DashboardLayout>{children}</DashboardLayout>
                </SchemaAdvisorHistoryProvider>
            </QueryHistoryProvider>
        </DatabaseConnectionProvider>
    );
}

export const ProtectedLayout = withAuth(InnerLayout);
