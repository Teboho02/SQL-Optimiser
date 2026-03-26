import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({

    pageHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 24px;
        gap: 16px;

        @media (max-width: 640px) {
            flex-direction: column;
        }
    `,

    pageTitle: css`
        font-size: 26px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0 0 6px;

        @media (max-width: 640px) {
            font-size: 20px;
        }
    `,

    pageSubtitle: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,

    headerActions: css`
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    `,

    tableWrapper: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        overflow: hidden;
    `,

    queryPreview: css`
        font-family: var(--font-geist-mono), monospace;
        font-size: 12px;
        color: ${token.colorTextBase};
    `,

    improvementPositive: css`
        font-weight: 600;
        color: ${token.colorSuccess};
    `,

    improvementNeutral: css`
        color: ${token.colorTextSecondary};
    `,

    improvementError: css`
        font-weight: 600;
        color: ${token.colorError};
    `,

    paginationRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-top: 1px solid ${token.colorBorder};
        font-size: 13px;
        color: ${token.colorTextSecondary};

        @media (max-width: 640px) {
            flex-direction: column;
            gap: 12px;
        }
    `,

    paginationControls: css`
        display: flex;
        align-items: center;
        gap: 4px;
    `,

    pageButton: css`
        min-width: 32px;
        height: 32px;
        padding: 0 10px;
        border-radius: 6px;
        font-size: 13px;
        background: none;
        border: none;
        color: ${token.colorTextSecondary};
        cursor: pointer;

        &:hover {
            background: rgba(255, 255, 255, 0.06);
            color: ${token.colorTextBase};
        }
    `,

    pageButtonActive: css`
        background: ${token.colorPrimary} !important;
        color: #fff !important;
    `,

    pageButtonDisabled: css`
        opacity: 0.4;
        pointer-events: none;
    `,
}));
