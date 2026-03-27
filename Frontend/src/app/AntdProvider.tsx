"use client";

import { ConfigProvider, theme } from "antd";
import { StyleProvider } from "antd-style";
import React from "react";

const { darkAlgorithm } = theme;

/** Wraps the app with Ant Design dark theme and antd-style's StyleProvider for SSR. */
const AntdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ConfigProvider
            theme={{
                algorithm: darkAlgorithm,
                token: {
                    colorPrimary: "#7c3aed",
                    colorBgBase: "#0d1117",
                    colorBgContainer: "#161b27",
                    colorBorder: "#1e2a3a",
                    borderRadius: 8,
                    fontFamily: "inherit",
                },
            }}
        >
            <StyleProvider>
                {children}
            </StyleProvider>
        </ConfigProvider>
    );
};

export default AntdProvider;
