import React from "react";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import { DatabaseConnectionProvider } from "@/providers/databaseConnection";
import { QueryHistoryProvider } from "@/providers/queryHistory";
import { SchemaAdvisorHistoryProvider } from "@/providers/schemaAdvisorHistory";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <DatabaseConnectionProvider>
            <QueryHistoryProvider>
                <SchemaAdvisorHistoryProvider>
                    <DashboardLayout>
                        {children}
                    </DashboardLayout>
                </SchemaAdvisorHistoryProvider>
            </QueryHistoryProvider>
        </DatabaseConnectionProvider>
    );
}
