import React from "react";
import Link from "next/link";
import { ThunderboltFilled } from "@ant-design/icons";
import LoginPageWrapper from "../login/LoginPageWrapper";
import SignUpForm from "./SignUpForm";

/** Sign-up page — reuses the login layout with a registration form. */
export default function SignUpPage(): React.JSX.Element {
    return (
        <LoginPageWrapper>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#a78bfa", marginBottom: 20 }}>
                    <ThunderboltFilled />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" }}>Create an account</h1>
                <p style={{ fontSize: 14, margin: 0, opacity: 0.6 }}>Join SQL Ninja today.</p>
            </div>
            <div>
                <SignUpForm />
            </div>
            <p style={{ marginTop: 28, fontSize: 14, textAlign: "center", opacity: 0.7 }}>
                {"Already have an account? "}
                <Link href="/login" style={{ color: "#7c3aed" }}>Sign in</Link>
            </p>
        </LoginPageWrapper>
    );
}
