import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    section: css`
        padding: 0 24px 80px;
        background-color: #0d1117;
    `,

    wrapper: css`
        max-width: 1100px;
        margin: 0 auto;
        background: #111827;
        border: 1px solid ${token.colorBorder};
        border-radius: 16px;
        overflow: hidden;
    `,

    cardsRow: css`
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: stretch;
        min-height: 260px;
    `,

    card: css`
        padding: 24px;
    `,

    cardHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    `,

    cardTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextSecondary};
    `,

    cardTitleOptimised: css`
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorTextBase};
        display: flex;
        align-items: center;
        gap: 6px;
    `,

    optimisedIcon: css`
        color: #7c3aed;
        font-size: 14px;
    `,

    badgeSlow: css`
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 10px;
        border-radius: 999px;
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        font-size: 12px;
        font-weight: 600;
        font-family: var(--font-geist-mono), monospace;
    `,

    badgeFast: css`
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 10px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.15);
        color: #4ade80;
        font-size: 12px;
        font-weight: 600;
        font-family: var(--font-geist-mono), monospace;
    `,

    codeBlock: css`
        background: transparent;
        border: none;
        margin: 0;
        padding: 0;
        font-family: var(--font-geist-mono), "Courier New", monospace;
        font-size: 13px;
        line-height: 1.75;
        color: #94a3b8;
        white-space: pre;
        overflow-x: auto;
    `,

    codeKeyword: css`
        color: #7dd3fc;
    `,

    codeString: css`
        color: #86efac;
    `,

    codeComment: css`
        color: #475569;
    `,

    arrowDivider: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        background: rgba(255, 255, 255, 0.02);
        border-left: 1px solid ${token.colorBorder};
        border-right: 1px solid ${token.colorBorder};
        color: ${token.colorTextSecondary};
        font-size: 18px;
    `,

    statsRow: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        padding: 32px 40px;
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(34, 211, 238, 0.08) 100%);
        border-top: 1px solid ${token.colorBorder};
        text-align: center;
        gap: 24px;
    `,

    statItem: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    `,

    statValue: css`
        font-size: 36px;
        font-weight: 800;
        line-height: 1.1;
    `,

    statValueCyan: css`
        color: #22d3ee;
    `,

    statValueGreen: css`
        color: #4ade80;
    `,

    statLabel: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,
}));
