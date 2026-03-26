import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    sidebar: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0;
    `,

    logoArea: css`
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 20px;
        height: 64px;
        border-bottom: 1px solid ${token.colorBorder};
        flex-shrink: 0;
    `,

    logoIcon: css`
        color: #7c3aed;
        font-size: 20px;
    `,

    logoText: css`
        font-size: 16px;
        font-weight: 700;
        color: ${token.colorTextBase};
        letter-spacing: -0.2px;
    `,

    nav: css`
        flex: 1;
        padding: 12px 12px;
        overflow-y: auto;

        .ant-menu {
            background: transparent;
            border-inline-end: none !important;
        }

        .ant-menu-item {
            border-radius: 8px;
            margin: 2px 0;
            height: 42px;
            line-height: 42px;
            color: ${token.colorTextSecondary};
        }

        .ant-menu-item:hover {
            background: rgba(124, 58, 237, 0.08) !important;
            color: ${token.colorTextBase} !important;
        }

        .ant-menu-item-selected {
            background: rgba(124, 58, 237, 0.2) !important;
            color: #a78bfa !important;
        }

        .ant-menu-item .anticon {
            font-size: 16px;
        }
    `,

    settingsArea: css`
        padding: 12px;
        border-top: 1px solid ${token.colorBorder};
        flex-shrink: 0;

        .ant-menu {
            background: transparent;
            border-inline-end: none !important;
        }

        .ant-menu-item {
            border-radius: 8px;
            height: 42px;
            line-height: 42px;
            color: ${token.colorTextSecondary};
        }

        .ant-menu-item:hover {
            background: rgba(124, 58, 237, 0.08) !important;
            color: ${token.colorTextBase} !important;
        }
    `,
}));
