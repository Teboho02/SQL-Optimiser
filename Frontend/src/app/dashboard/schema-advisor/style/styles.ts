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
    `,

    pageSubtitle: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,

    // two-column layout
    twoColumnLayout: css`
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 20px;
        align-items: start;

        @media (max-width: 960px) {
            grid-template-columns: 1fr;
        }
    `,

    // recommendations list
    sectionTitle: css`
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorTextBase};
        margin: 0 0 14px;
    `,

    recommendationCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-left: 3px solid transparent;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;

        &:hover {
            background: rgba(255, 255, 255, 0.03);
        }
    `,

    recommendationCardActive: css`
        border-left-color: ${token.colorPrimary} !important;
        background: rgba(124, 58, 237, 0.06) !important;
    `,

    cardTitleRow: css`
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
    `,

    cardIcon: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(124, 58, 237, 0.15);
        color: ${token.colorPrimary};
        font-size: 16px;
        flex-shrink: 0;
    `,

    cardTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextBase};
        flex: 1;
        min-width: 0;
    `,

    cardDescription: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        line-height: 1.6;
        margin: 0 0 10px;
    `,

    cardDowntime: css`
        font-size: 12px;
        color: ${token.colorTextQuaternary};
        font-family: var(--font-geist-mono), monospace;
        margin: 0;
    `,

    // detail panel
    detailPanel: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 20px;
    `,

    detailHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        gap: 12px;
        flex-wrap: wrap;
    `,

    detailTitle: css`
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorTextBase};
        margin: 0;
    `,

    // schema diff diagram
    schemaDiagram: css`
        display: flex;
        align-items: center;
        gap: 16px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid ${token.colorBorder};
        border-radius: 10px;
        padding: 24px 20px;
        margin-bottom: 16px;
        overflow-x: auto;

        @media (max-width: 700px) {
            flex-direction: column;
        }
    `,

    diagramArrow: css`
        font-size: 22px;
        color: ${token.colorPrimary};
        flex-shrink: 0;
    `,

    diagramRight: css`
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
        min-width: 0;
    `,

    schemaTable: css`
        border: 1px solid ${token.colorBorder};
        border-radius: 8px;
        overflow: hidden;
        flex: 1;
        min-width: 200px;
    `,

    schemaTableHeaderCurrent: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(220, 38, 38, 0.15);
        border-bottom: 1px solid ${token.colorBorder};
        font-size: 12px;
        font-weight: 600;
        font-family: var(--font-geist-mono), monospace;
        color: #f87171;
    `,

    schemaTableHeaderNew: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(16, 185, 129, 0.15);
        border-bottom: 1px solid ${token.colorBorder};
        font-size: 12px;
        font-weight: 600;
        font-family: var(--font-geist-mono), monospace;
        color: #34d399;
    `,

    schemaRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        font-size: 12px;
        font-family: var(--font-geist-mono), monospace;
        color: ${token.colorTextSecondary};
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);

        &:last-child {
            border-bottom: none;
        }
    `,

    schemaRowHighlighted: css`
        color: #fbbf24;
        background: rgba(251, 191, 36, 0.08);
    `,

    schemaRowNew: css`
        color: #34d399;
        background: rgba(52, 211, 153, 0.08);
    `,

    schemaColumnType: css`
        color: ${token.colorTextQuaternary};
        margin-left: 16px;
        flex-shrink: 0;
    `,

    // metric cards
    metricsRow: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;

        @media (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    `,

    metricCard: css`
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid ${token.colorBorder};
        border-radius: 10px;
        padding: 16px;
    `,

    metricLabel: css`
        font-size: 12px;
        color: ${token.colorTextQuaternary};
        margin: 0 0 8px;
    `,

    metricValue: css`
        font-size: 22px;
        font-weight: 700;
        font-family: var(--font-geist-mono), monospace;
        color: ${token.colorTextBase};
        margin: 0;
    `,

    metricArrow: css`
        color: ${token.colorPrimary};
        margin: 0 6px;
    `,

    metricAfter: css`
        color: #34d399;
    `,

    // scan history section
    historySection: css`
        margin-top: 36px;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 20px 24px;
    `,

    historyHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    `,

    historyTitle: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorTextBase};
        margin: 0;
    `,

    historyItem: css`
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border: 1px solid ${token.colorBorder};
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background 0.15s;

        &:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        &:last-child {
            margin-bottom: 0;
        }
    `,

    historyItemActive: css`
        border-color: ${token.colorPrimary};
        background: rgba(124, 58, 237, 0.06) !important;
    `,

    historyMeta: css`
        flex: 1;
        min-width: 0;
    `,

    historyTimestamp: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorTextBase};
        margin: 0 0 2px;
    `,

    historyCount: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,
}));
