import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({

    // three-column layout
    threeColumnLayout: css`
        display: grid;
        grid-template-columns: 260px 1fr 280px;
        gap: 16px;
        height: calc(100vh - 120px);
        min-height: 600px;

        @media (max-width: 1200px) {
            grid-template-columns: 220px 1fr 240px;
        }

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            height: auto;
            min-height: unset;
        }
    `,

    // generic panel base
    panel: css`
        display: flex;
        flex-direction: column;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        overflow: hidden;
    `,

    panelHeader: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid ${token.colorBorder};
        background: rgba(255, 255, 255, 0.02);
        flex-shrink: 0;
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextBase};
    `,

    // schema panel
    schemaFilter: css`
        padding: 10px 12px;
        border-bottom: 1px solid ${token.colorBorder};
        flex-shrink: 0;
    `,

    schemaBody: css`
        flex: 1;
        overflow-y: auto;
    `,

    tableItem: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 16px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorTextBase};
        user-select: none;

        &:hover {
            background: rgba(255, 255, 255, 0.04);
        }
    `,

    columnItem: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 16px 5px 36px;
        font-size: 12px;
        color: ${token.colorTextSecondary};
    `,

    tableIcon: css`
        color: ${token.colorPrimary};
        font-size: 14px;
        flex-shrink: 0;
    `,

    columnIcon: css`
        color: ${token.colorTextQuaternary};
        font-size: 11px;
        flex-shrink: 0;
    `,

    chevron: css`
        margin-left: auto;
        font-size: 10px;
        color: ${token.colorTextQuaternary};
        transition: transform 0.15s;
    `,

    chevronOpen: css`
        transform: rotate(90deg);
    `,

    // editor panel
    editorToolbar: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid ${token.colorBorder};
        flex-shrink: 0;
    `,

    editorToolbarLeft: css`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    shortcutBadge: css`
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.12);
        padding: 1px 5px;
        border-radius: 4px;
        font-family: var(--font-geist-mono), monospace;
        margin-left: 6px;
    `,

    aiAnalyseButton: css`
        font-size: 13px;
        color: ${token.colorPrimary};
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;

        &:hover {
            text-decoration: underline;
        }
    `,

    editorWrapper: css`
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,

    sqlEditor: css`
        flex: 1;
        width: 100%;
        resize: none;
        background: transparent;
        border: none;
        outline: none;
        padding: 20px;
        font-family: var(--font-geist-mono), monospace;
        font-size: 13px;
        line-height: 1.7;
        color: ${token.colorTextBase};
        caret-color: ${token.colorPrimary};
        min-height: 120px;

        &::placeholder {
            color: ${token.colorTextQuaternary};
        }
    `,

    // results section
    resultsSection: css`
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        border-top: 1px solid ${token.colorBorder};
    `,

    resultsHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.02);
        flex-shrink: 0;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: ${token.colorTextSecondary};
        border-bottom: 1px solid ${token.colorBorder};
    `,

    resultsMeta: css`
        font-size: 11px;
        color: ${token.colorTextQuaternary};
        font-weight: 400;
    `,

    resultsTableWrapper: css`
        flex: 1;
        overflow: auto;
    `,

    resultsLoading: css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        flex: 1;
    `,

    // history panel
    historyBody: css`
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
    `,

    historyEntry: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 14px;
        cursor: pointer;
        border-bottom: 1px solid ${token.colorBorderSecondary};

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.04);
        }
    `,

    historyQueryText: css`
        flex: 1;
        font-size: 12px;
        font-family: var(--font-geist-mono), monospace;
        color: ${token.colorTextBase};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,

    historyMeta: css`
        font-size: 11px;
        color: ${token.colorTextQuaternary};
        margin-top: 3px;
        white-space: nowrap;
    `,

    historyErrorDot: css`
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${token.colorError};
        margin-right: 5px;
        flex-shrink: 0;
        margin-top: 4px;
    `,

    panelCentered: css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 32px 16px;
    `,

    // execution info panel
    idleState: css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 32px 16px;
        text-align: center;
        font-size: 13px;
        color: ${token.colorTextQuaternary};
    `,

    infoSection: css`
        display: flex;
        flex-direction: column;
        padding: 20px 16px;
        flex: 1;
        overflow-y: auto;
    `,

    infoLabel: css`
        font-size: 11px;
        color: ${token.colorTextQuaternary};
        margin: 0 0 6px;
        letter-spacing: 0.04em;
    `,

    statusRow: css`
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorSuccess};
        margin-bottom: 20px;
    `,

    statusDot: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${token.colorSuccess};
        flex-shrink: 0;
    `,

    executionTimeValue: css`
        font-size: 28px;
        font-weight: 700;
        color: ${token.colorTextBase};
        font-family: var(--font-geist-mono), monospace;
        margin: 0 0 20px;
    `,

    queryPlanBlock: css`
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid ${token.colorBorder};
        border-radius: 8px;
        padding: 12px;
        font-family: var(--font-geist-mono), monospace;
        font-size: 12px;
        line-height: 1.6;
        color: ${token.colorTextSecondary};
        white-space: pre;
        margin: 0;
        overflow-x: auto;
    `,
}));
