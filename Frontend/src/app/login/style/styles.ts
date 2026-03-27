import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    page: css`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 24px;
        background-color: #0d1117;
        background-image:
            linear-gradient(rgba(124, 58, 237, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.07) 1px, transparent 1px);
        background-size: 48px 48px;
    `,

    header: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 32px;
        text-align: center;
    `,

    logoIcon: css`
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: rgba(124, 58, 237, 0.2);
        border: 1px solid rgba(124, 58, 237, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        color: #a78bfa;
        margin-bottom: 20px;
    `,

    title: css`
        font-size: 26px;
        font-weight: 700;
        color: ${token.colorTextBase};
        margin: 0 0 8px;
        letter-spacing: -0.3px;
    `,

    subtitle: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
        margin: 0;
    `,

    card: css`
        width: 100%;
        max-width: 440px;
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorder};
        border-radius: 16px;
        padding: 32px;
    `,

    form: css`
        .ant-form-item {
            margin-bottom: 20px;
        }

        .ant-form-item-label > label {
            color: ${token.colorTextBase};
            font-weight: 500;
            font-size: 14px;
        }
    `,

    rememberRow: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
    `,

    rememberLabel: css`
        font-size: 14px;
        color: ${token.colorTextSecondary};
    `,

    forgotLink: css`
        font-size: 14px;
        color: #7c3aed;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: #a78bfa;
        }
    `,

    submitButton: css`
        width: 100%;
        height: 46px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 8px;
        margin-bottom: 24px;
    `,

    divider: css`
        text-align: center;
        font-size: 13px;
        color: ${token.colorTextQuaternary};
        margin-bottom: 16px;
        position: relative;

        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 50%;
            width: 38%;
            height: 1px;
            background: ${token.colorBorder};
        }

        &::before {
            left: 0;
        }

        &::after {
            right: 0;
        }
    `,

    socialRow: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    `,

    socialButton: css`
        height: 42px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);
        color: ${token.colorTextBase};

        &:hover {
            background: rgba(255, 255, 255, 0.09) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }
    `,

    footer: css`
        margin-top: 28px;
        font-size: 14px;
        color: ${token.colorTextSecondary};
        text-align: center;
    `,

    footerLink: css`
        color: #7c3aed;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: #a78bfa;
        }
    `,
}));
