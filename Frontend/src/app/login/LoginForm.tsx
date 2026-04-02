"use client";

import { Button, Checkbox, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { authenticate } from "@/services/authService";
import { tokenService } from "@/services/tokenService";
import { useStyles } from "./style/styles";

interface ILoginFormValues {
    userNameOrEmailAddress: string;
    password: string;
    rememberMe: boolean;
}

/** Email/password form with remember-me checkbox, forgot-password link, and ABP auth integration. */
const LoginForm: React.FC = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values: ILoginFormValues): Promise<void> => {
        setIsLoading(true);
        try {
            const result = await authenticate({
                userNameOrEmailAddress: values.userNameOrEmailAddress,
                password: values.password,
                rememberClient: values.rememberMe ?? false,
            });

            tokenService.setToken(result.accessToken);
            tokenService.setUserId(result.userId);

            router.push("/dashboard");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
            messageApi.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
                requiredMark={false}
            >
                <Form.Item
                    label="Username"
                    name="userNameOrEmailAddress"
                    rules={[
                        { required: true, message: "Please enter your username." },
                    ]}
                >
                    <Input
                        placeholder="your username"
                        size="large"
                        autoComplete="username"
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
        </>
    );
};

export default LoginForm;
