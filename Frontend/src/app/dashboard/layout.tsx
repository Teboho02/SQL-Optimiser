import DashboardLayout from "./DashboardLayout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
