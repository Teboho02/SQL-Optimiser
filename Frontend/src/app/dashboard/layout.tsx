import React from "react";
import { ProtectedLayout } from "./ProtectedLayout";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
