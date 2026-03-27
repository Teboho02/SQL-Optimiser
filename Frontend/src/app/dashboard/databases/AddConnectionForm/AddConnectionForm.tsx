"use client";

import React, { useState } from "react";
import { Button, Input, Select, notification } from "antd";
import { DatabaseOutlined, KeyOutlined, CodeOutlined } from "@ant-design/icons";
import { testConnection, DATABASE_TYPE_MAP } from "@/services/databaseConnectionService";
import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "@/services/tokenService";
import { useStyles } from "../style/styles";

const ENGINE_OPTIONS = [
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "MySQL", label: "MySQL" },
    { value: "MariaDB", label: "MariaDB" },
    { value: "SQLite", label: "SQLite" },
];

const DEFAULT_PORT: Record<string, string> = {
    PostgreSQL: "5432",
    MySQL: "3306",
    MariaDB: "3306",
    SQLite: "",
};

interface IConnectionFormValues {
    name: string;
    engine: string;
    host: string;
    port: string;
    username: string;
    password: string;
}

const INITIAL_VALUES: IConnectionFormValues = {
    name: "",
    engine: "PostgreSQL",
    host: "",
    port: "5432",
    username: "",
    password: "",
};

interface IAddConnectionFormProps {
    /** Called after a connection is saved successfully so the list can refresh. */
    onSaved: () => void;
}

/** Form for registering a new database connection. */
const AddConnectionForm: React.FC<IAddConnectionFormProps> = ({ onSaved }) => {
    const { styles } = useStyles();
    const [values, setValues] = useState<IConnectionFormValues>(INITIAL_VALUES);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const setField = (field: keyof IConnectionFormValues, value: string): void => {
        setValues((previous) => ({ ...previous, [field]: value }));
    };

    const handleEngineChange = (value: string): void => {
        setValues((previous) => ({
            ...previous,
            engine: value,
            port: DEFAULT_PORT[value] ?? "",
        }));
    };

    const handleTestConnection = async (): Promise<void> => {
        if (!values.host.trim() || !values.username.trim() || !values.password.trim()) {
            notification.warning({ message: "Please fill in Host, Username, and Password before testing." });
            return;
        }

        setIsTesting(true);
        try {
            const result = await testConnection({
                dbHost: values.host,
                dbPort: parseInt(values.port, 10) || 5432,
                dbUser: values.username,
                dbPassword: values.password,
                databaseType: DATABASE_TYPE_MAP[values.engine] ?? 2,
                requireSsl: true,
            });

            if (result.success) {
                notification.success({ message: "Connection successful!", description: result.message });
            } else {
                notification.error({ message: "Connection failed", description: result.message });
            }
        } catch {
            notification.error({ message: "Connection failed", description: "Unable to reach the server." });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSaveConnection = async (): Promise<void> => {
        if (!values.name.trim() || !values.host.trim()) {
            notification.warning({ message: "Please fill in at least a Connection Name and Host." });
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(API_CONSTANTS.SAVE_CONNECTION, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenService.getToken()}`,
                },
                body: JSON.stringify({
                    name: values.name,
                    dbHost: values.host,
                    dbPort: parseInt(values.port, 10) || 5432,
                    dbUser: values.username,
                    dbPassword: values.password,
                    databaseType: DATABASE_TYPE_MAP[values.engine] ?? 2,
                    requireSsl: true,
                }),
            });

            const json = await response.json();

            if (json.success) {
                notification.success({ message: "Connection saved successfully!" });
                setValues(INITIAL_VALUES);
                onSaved();
            } else {
                const errorMessage = json.error?.details ?? json.error?.message ?? "An unexpected error occurred.";
                notification.error({ message: "Failed to save connection", description: errorMessage });
            }
        } catch {
            notification.error({ message: "Failed to save connection", description: "Unable to reach the server." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.formSection} id="add-connection-form">
            <h2 className={styles.formSectionTitle}>Add New Connection</h2>
            <div className={styles.formGrid}>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-name">Connection Name</label>
                    <Input
                        id="conn-name"
                        value={values.name}
                        onChange={(event) => setField("name", event.target.value)}
                        placeholder="e.g. production-replica"
                    />
                </div>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-engine">Engine</label>
                    <Select
                        id="conn-engine"
                        value={values.engine}
                        onChange={handleEngineChange}
                        options={ENGINE_OPTIONS}
                        className={styles.selectFull}
                    />
                </div>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-host">Host</label>
                    <Input
                        id="conn-host"
                        value={values.host}
                        onChange={(event) => setField("host", event.target.value)}
                        placeholder="db.example.com"
                        prefix={<DatabaseOutlined />}
                    />
                </div>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-port">Port</label>
                    <Input
                        id="conn-port"
                        value={values.port}
                        onChange={(event) => setField("port", event.target.value)}
                        placeholder="5432"
                    />
                </div>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-username">Username</label>
                    <Input
                        id="conn-username"
                        value={values.username}
                        onChange={(event) => setField("username", event.target.value)}
                        placeholder="postgres"
                    />
                </div>
                <div>
                    <label className={styles.formLabel} htmlFor="conn-password">Password</label>
                    <Input.Password
                        id="conn-password"
                        value={values.password}
                        onChange={(event) => setField("password", event.target.value)}
                        prefix={<KeyOutlined />}
                    />
                </div>
            </div>
            <div className={styles.formFooter}>
                <Button
                    icon={<CodeOutlined />}
                    loading={isTesting}
                    onClick={() => { void handleTestConnection(); }}
                >
                    Test Connection
                </Button>
                <Button
                    type="primary"
                    loading={isSaving}
                    onClick={() => { void handleSaveConnection(); }}
                >
                    Save Connection
                </Button>
            </div>
        </div>
    );
};

export default AddConnectionForm;
