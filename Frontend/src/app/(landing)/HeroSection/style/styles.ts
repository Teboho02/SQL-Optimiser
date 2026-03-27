import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    hero: css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 160px 24px 100px;
        background-color: #0d1117;
        background-image:
            linear-gradient(rgba(124, 58, 237, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.07) 1px, transparent 1px);
        background-size: 48px 48px;
        overflow: hidden;
    `,

    badge: css`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        margin-bottom: 32px;
        border-radius: 999px;
        border: 1px solid rgba(124, 58, 237, 0.4);
        background: rgba(124, 58, 237, 0.1);
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    badgeDot: css`
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #7c3aed;
        flex-shrink: 0;
    `,

    heading: css`
        font-size: clamp(40px, 6vw, 72px);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -1.5px;
        color: ${token.colorTextBase};
        margin-bottom: 24px;
        max-width: 820px;
    `,

    headingGradient: css`
        background: linear-gradient(90deg, #a855f7 0%, #22d3ee 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    `,

    subheading: css`
        font-size: 18px;
        line-height: 1.7;
        color: ${token.colorTextSecondary};
        max-width: 560px;
        margin-bottom: 48px;
    `,

    ctaRow: css`
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    `,

    primaryButton: css`
        height: 50px;
        padding: 0 28px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 8px;
    `,

    secondaryButton: css`
        height: 50px;
        padding: 0 28px;
        font-size: 15px;
        font-weight: 500;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.15);
        color: ${token.colorTextBase};

        &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
        }
    `,
}));
