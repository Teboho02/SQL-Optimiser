import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    navbar: css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        height: 64px;
        background: rgba(13, 17, 23, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid ${token.colorBorder};
    `,

    logo: css`
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    `,

    logoIcon: css`
        color: #7c3aed;
        font-size: 22px;
    `,

    logoText: css`
        font-size: 18px;
        font-weight: 700;
        color: ${token.colorTextBase};
        letter-spacing: -0.3px;
    `,

    navActions: css`
        display: flex;
        align-items: center;
        gap: 16px;
    `,

    signInLink: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: ${token.colorTextBase};
        }
    `,
}));
