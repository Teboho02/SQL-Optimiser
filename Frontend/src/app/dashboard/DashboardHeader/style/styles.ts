import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    header: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        padding: 0 24px;
        background: #111827;
        border-bottom: 1px solid ${token.colorBorder};
        flex-shrink: 0;
        gap: 16px;
    `,

    menuButton: css`
        display: none;
        color: ${token.colorTextSecondary};
        font-size: 20px;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        flex-shrink: 0;
        transition: background 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.07);
            color: ${token.colorTextBase};
        }

        @media (max-width: 1024px) {
            display: flex;
            align-items: center;
        }
    `,

    leftGroup: css`
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    `,

    clusterSelector: css`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    clusterIcon: css`
        color: ${token.colorTextSecondary};
        font-size: 16px;
        flex-shrink: 0;

        @media (max-width: 480px) {
            display: none;
        }
    `,

    clusterSelect: css`
        width: 200px;

        @media (max-width: 640px) {
            width: 160px;
        }

        @media (max-width: 400px) {
            width: 130px;
        }

        .ant-select-selector {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
            border-radius: 8px !important;
        }
    `,

    rightActions: css`
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
    `,

    searchBar: css`
        width: 260px;

        @media (max-width: 1024px) {
            width: 200px;
        }

        @media (max-width: 768px) {
            display: none;
        }

        .ant-input-affix-wrapper {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }
    `,

    searchIconButton: css`
        display: none;
        color: ${token.colorTextSecondary};
        font-size: 18px;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: background 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.07);
            color: ${token.colorTextBase};
        }

        @media (max-width: 768px) {
            display: flex;
            align-items: center;
        }
    `,

    searchHint: css`
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 11px;
        color: ${token.colorTextQuaternary};
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 1px 5px;
        letter-spacing: 0.5px;

        @media (max-width: 1024px) {
            display: none;
        }
    `,

    bellButton: css`
        color: ${token.colorTextSecondary};
        font-size: 18px;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: background 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.07);
            color: ${token.colorTextBase};
        }
    `,

    avatar: css`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7c3aed, #22d3ee);
        cursor: pointer;
        flex-shrink: 0;
    `,
}));
