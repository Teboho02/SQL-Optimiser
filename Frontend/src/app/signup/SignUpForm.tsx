"use client";

import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { API_CONSTANTS } from "@/constants/ApiConstants";
import { useStyles } from "../login/style/styles";

interface ISignUpFormValues {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    password: string;
}

/** Registration form that calls the ABP Account/Register endpoint. */
const SignUpForm: React.FC = () => {
    const { styles } = useStyles();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values: ISignUpFormValues): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONSTANTS.REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    surname: values.surname,
                    userName: values.userName,
                    emailAddress: values.emailAddress,
                    password: values.password,
                }),
            });

            const json = await response.json();

            if (json.success) {
                messageApi.success("Account created! Please sign in.");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                const errorMessage = json.error?.details ?? json.error?.message ?? "Registration failed.";
                messageApi.error(errorMessage);
            }
        } catch {
            messageApi.error("Unable to reach the server.");
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
                    label="First Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your first name." }]}
                >
                    <Input placeholder="Jane" size="large" autoComplete="given-name" />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="surname"
                    rules={[{ required: true, message: "Please enter your last name." }]}
                >
                    <Input placeholder="Doe" size="large" autoComplete="family-name" />
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="userName"
                    rules={[{ required: true, message: "Please choose a username." }]}
                >
                    <Input placeholder="janedoe" size="large" autoComplete="username" />
                </Form.Item>

                <Form.Item
                    label="Email Address"
                    name="emailAddress"
                    rules={[
                        { required: true, message: "Please enter your email address." },
                        { type: "email", message: "Please enter a valid email address." },
                    ]}
                >
                    <Input placeholder="jane@company.com" size="large" autoComplete="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please choose a password." },
                        { min: 8, message: "Password must be at least 8 characters." },
                    ]}
                >
                    <Input.Password size="large" autoComplete="new-password" />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isLoading}
                    className={styles.submitButton}
                >
                    Create Account
                </Button>
            </Form>
        </>
    );
};

export default SignUpForm;
