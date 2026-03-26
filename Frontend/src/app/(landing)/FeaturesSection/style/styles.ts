import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    section: css`
        padding: 80px 24px 100px;
        background-color: #0d1117;
    `,

    grid: css`
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        @media (max-width: 900px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 500px) {
            grid-template-columns: 1fr;
        }
    `,

    card: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 12px;
        padding: 28px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: border-color 0.2s;

        &:hover {
            border-color: rgba(124, 58, 237, 0.5);
        }
    `,

    iconWrapper: css`
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: rgba(124, 58, 237, 0.12);
        border: 1px solid rgba(124, 58, 237, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #a78bfa;
    `,

    cardTitle: css`
        font-size: 16px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0;
    `,

    cardDescription: css`
        font-size: 14px;
        line-height: 1.65;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,
}));
