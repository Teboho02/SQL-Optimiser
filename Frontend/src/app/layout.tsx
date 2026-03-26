import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AntdProvider from "./AntdProvider";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SQL Optimiser — Stop guessing why your queries are slow",
    description: "AI-powered SQL analysis that understands your schema, detects intent, and rewrites queries for maximum performance.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body>
                <AntdProvider>
                    {children}
                </AntdProvider>
            </body>
        </html>
    );
}
