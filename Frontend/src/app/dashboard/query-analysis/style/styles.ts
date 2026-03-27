
import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    // page header
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

    analyseButton: css`
        flex-shrink: 0;
    `,

    // two-panel layout
    panelsRow: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        height: calc(100vh - 200px);
        min-height: 480px;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            height: auto;
        }
    `,

    // editor panel
    editorPanel: css`
        display: flex;
        flex-direction: column;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        overflow: hidden;
    `,

    editorToolbar: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid ${token.colorBorder};
        background: rgba(255, 255, 255, 0.02);
        flex-shrink: 0;
    `,

    editorToolbarLeft: css`
        display: flex;
        align-items: center;
        gap: 10px;
    `,

    editorToolbarRight: css`
        display: flex;
        align-items: center;
        gap: 4px;
    `,

    dbName: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        font-family: var(--font-geist-mono), monospace;
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

        &::placeholder {
            color: ${token.colorTextQuaternary};
        }

        @media (max-width: 900px) {
            min-height: 300px;
        }
    `,

    intentInputWrapper: css`
        border-top: 1px solid ${token.colorBorder};
        flex-shrink: 0;

        .ant-input {
            background: transparent;
            font-size: 13px;
            color: ${token.colorTextSecondary};
            padding: 12px 20px;
            border-radius: 0;

            &::placeholder {
                color: ${token.colorTextQuaternary};
            }
        }
    `,

    // results panel
    resultsPanel: css`
        display: flex;
        flex-direction: column;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        overflow: hidden;
    `,

    emptyState: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 48px 32px;
        text-align: center;
        height: 100%;
    `,

    emptyStateIcon: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        margin-bottom: 20px;
        font-size: 28px;
        color: ${token.colorTextQuaternary};
    `,

    emptyStateTitle: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorTextBase};
        margin: 0 0 10px;
    `,

    emptyStateText: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        max-width: 320px;
        line-height: 1.6;
        margin: 0;
    `,

    spinnerWrapper: css`
        margin-bottom: 20px;
    `,

    planHeader: css`
        padding: 10px 16px;
        border-bottom: 1px solid ${token.colorBorder};
        background: rgba(255, 255, 255, 0.02);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: ${token.colorTextSecondary};
        flex-shrink: 0;
    `,

    planBlock: css`
        flex: 1;
        overflow: auto;
        margin: 0;
        padding: 16px 20px;
        font-family: var(--font-geist-mono), monospace;
        font-size: 12px;
        line-height: 1.7;
        color: ${token.colorTextBase};
        white-space: pre;
    `,
}));
