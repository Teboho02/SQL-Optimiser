"use client";

import { Button } from "antd";
import { GithubOutlined, MailOutlined } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

/** "Or continue with" divider and GitHub / Google social sign-in buttons. */
const LoginSocialButtons: React.FC = () => {
    const { styles } = useStyles();

    return (
        <>
            <p className={styles.divider}>Or continue with</p>
            <div className={styles.socialRow}>
                <Button
                    icon={<GithubOutlined />}
                    size="large"
                    className={styles.socialButton}
                >
                    GitHub
                </Button>
                <Button
                    icon={<MailOutlined />}
                    size="large"
                    className={styles.socialButton}
                >
                    Google
                </Button>
            </div>
        </>
    );
};

export default LoginSocialButtons;
