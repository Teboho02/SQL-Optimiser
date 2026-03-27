import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    // page header
    pageHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
    `,

    pageTitle: css`
        font-size: 26px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0;

        @media (max-width: 640px) {
            font-size: 20px;
        }
    `,

    lastUpdated: css`
        font-size: 13px;
        color: ${token.colorTextQuaternary};
        font-family: var(--font-geist-mono), monospace;
        white-space: nowrap;

        @media (max-width: 480px) {
            display: none;
        }
    `,

    // alert banner
    alertBanner: css`
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px 20px;
        margin-bottom: 24px;
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 12px;
    `,

    alertIcon: css`
        color: #f97316;
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 1px;
    `,

    alertTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: #f97316;
        margin: 0 0 4px;
    `,

    alertBody: css`
        font-size: 13px;
        color: #f87171;
        margin: 0;
    `,

    alertCode: css`
        font-family: var(--font-geist-mono), monospace;
        background: rgba(239, 68, 68, 0.12);
        border-radius: 3px;
        padding: 0 4px;
    `,

    // stat cards row
    cardsRow: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 32px;

        @media (max-width: 900px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 560px) {
            grid-template-columns: 1fr;
        }
    `,

    statCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 24px;
    `,

    statCardHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    `,

    statCardName: css`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextBase};
    `,

    statCardIcon: css`
        color: ${token.colorTextSecondary};
        font-size: 16px;
    `,

    statCardMeta: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    statValue: css`
        font-size: 42px;
        font-weight: 800;
        color: ${token.colorTextBase};
        line-height: 1.1;
        margin-bottom: 4px;

        span {
            font-size: 18px;
            font-weight: 400;
            color: ${token.colorTextSecondary};
        }
    `,

    statValueFormatted: css`
        font-size: 42px;
        font-weight: 800;
        color: ${token.colorTextBase};
        line-height: 1.1;
        margin-bottom: 8px;
    `,

    statDelta: css`
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        margin-top: 8px;
    `,

    deltaPositive: css`
        color: #4ade80;
    `,

    deltaNegative: css`
        color: #f87171;
    `,

    statSubtext: css`
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: ${token.colorTextSecondary};
        margin-top: 8px;
    `,

    // bottom two-column layout
    bottomRow: css`
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 24px;
        align-items: start;

        @media (max-width: 1100px) {
            grid-template-columns: 1fr;
        }
    `,

    sectionTitle: css`
        font-size: 18px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0 0 16px;
    `,

    // table
    tableWrapper: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        overflow-x: auto;
        overflow-y: hidden;

        .ant-table {
            background: transparent;
        }

        .ant-table-thead > tr > th {
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid ${token.colorBorder};
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            color: ${token.colorTextQuaternary};
        }

        .ant-table-tbody > tr > td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: ${token.colorTextSecondary};
            font-size: 13px;
        }

        .ant-table-tbody > tr:last-child > td {
            border-bottom: none;
        }

        .ant-table-tbody > tr:hover > td {
            background: rgba(255, 255, 255, 0.03) !important;
        }
    `,

    idCell: css`
        font-family: var(--font-geist-mono), monospace;
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    queryCell: css`
        font-family: var(--font-geist-mono), monospace;
        font-size: 12px;
        color: ${token.colorTextBase};
    `,

    improvementPositive: css`
        color: #4ade80;
        font-weight: 600;
    `,

    improvementNeutral: css`
        color: ${token.colorTextSecondary};
    `,

    // activity feed
    activityCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 24px;
    `,

    activityItem: css`
        display: flex;
        gap: 12px;
        padding: 14px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);

        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        &:first-child {
            padding-top: 0;
        }
    `,

    activityDot: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-top: 5px;
        flex-shrink: 0;
        background: var(--dot-color, #4ade80);
    `,

    activityText: css`
        font-size: 13px;
        color: ${token.colorTextBase};
        margin: 0 0 4px;
        line-height: 1.4;
    `,

    activityTime: css`
        font-size: 12px;
        color: ${token.colorTextQuaternary};
        margin: 0;
    `,
}));
