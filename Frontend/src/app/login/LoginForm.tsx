"use client";

import { Button, Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useStyles } from "./style/styles";

interface ILoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

/** Email/password form with remember-me checkbox and forgot-password link. */
const LoginForm: React.FC = () => {
    const { styles } = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (values: ILoginFormValues): Promise<void> => {
        setIsLoading(true);
        // todo: wire up to auth API
        console.log("Login submitted", values);
        setIsLoading(false);
    };

    return (
        <Form
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
            requiredMark={false}
        >
            <Form.Item
                label="Email Address"
                name="email"
                rules={[
                    { required: true, message: "Please enter your email address." },
                    { type: "email", message: "Please enter a valid email address." },
                ]}
            >
                <Input
                    placeholder="engineer@company.com"
                    size="large"
                    autoComplete="email"
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password." }]}
            >
                <Input.Password
                    size="large"
                    autoComplete="current-password"
                />
            </Form.Item>

            <div className={styles.rememberRow}>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox>
                        <span className={styles.rememberLabel}>Remember me</span>
                    </Checkbox>
                </Form.Item>
                <span className={styles.forgotLink}>Forgot password?</span>
            </div>

            <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                className={styles.submitButton}
            >
                Sign In
            </Button>
        </Form>
    );
};

export default LoginForm;
