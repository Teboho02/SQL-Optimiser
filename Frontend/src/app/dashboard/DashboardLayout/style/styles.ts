import { createStyles, css } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    shell: css`
        display: flex;
        height: 100vh;
        background: #0d1117;
        overflow: hidden;
    `,

    sidebar: css`
        width: 256px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        background: #111827;
        border-right: 1px solid ${token.colorBorder};
        overflow-y: auto;

        @media (max-width: 1024px) {
            display: none;
        }
    `,

    body: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,

    content: css`
        flex: 1;
        overflow-y: auto;
        padding: 32px 40px;

        @media (max-width: 1024px) {
            padding: 24px 24px;
        }

        @media (max-width: 640px) {
            padding: 20px 16px;
        }
    `,

    drawerBody: css`
        padding: 0;
        background: #111827;
        height: 100%;
    `,
}));
