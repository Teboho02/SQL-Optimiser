import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    // page header
    pageHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px;
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

    addButton: css`
        flex-shrink: 0;
    `,

    // connection cards grid
    cardsGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 36px;

        @media (max-width: 1024px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    `,

    // individual connection card
    card: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 0;
    `,

    cardHeader: css`
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
    `,

    cardIconWrapper: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(124, 58, 237, 0.12);
        color: #a78bfa;
        font-size: 18px;
        flex-shrink: 0;
    `,

    cardName: css`
        font-size: 15px;
        font-weight: 600;
        color: ${token.colorTextBase};
        margin: 0 0 3px;
    `,

    cardEngine: css`
        font-size: 12px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,

    cardMeta: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
    `,

    cardMetaRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,

    cardMetaLabel: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    cardMetaValue: css`
        font-size: 13px;
        color: ${token.colorTextBase};
        font-family: var(--font-geist-mono), monospace;
    `,

    cardFooter: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid ${token.colorBorder};
    `,

    badgeConnected: css`
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        color: #4ade80;
        background: rgba(74, 222, 128, 0.08);
        border: 1px solid rgba(74, 222, 128, 0.3);

        &::before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #4ade80;
        }
    `,

    badgeDisconnected: css`
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        color: ${token.colorTextQuaternary};
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid ${token.colorBorder};

        &::before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${token.colorTextQuaternary};
        }
    `,

    loadingWrapper: css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 0;
        margin-bottom: 36px;
    `,

    emptyState: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        margin-bottom: 36px;
    `,

    // add new connection form section
    formSection: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 28px 32px 32px;

        @media (max-width: 640px) {
            padding: 20px;
        }
    `,

    formSectionTitle: css`
        font-size: 18px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0 0 24px;
    `,

    formGrid: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px 24px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    `,

    formFieldFull: css`
        grid-column: 1 / -1;
    `,

    formLabel: css`
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorTextSecondary};
        margin-bottom: 8px;
    `,

    selectFull: css`
        width: 100%;
    `,

    formFooter: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 28px;

        @media (max-width: 480px) {
            flex-direction: column;
            gap: 12px;

            button {
                width: 100%;
            }
        }
    `,
}));
