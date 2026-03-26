"use client";

import React, { useState } from "react";
import { Button, Input, Select } from "antd";
import { DatabaseOutlined, KeyOutlined, CodeOutlined } from "@ant-design/icons";
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

/** Form for registering a new database connection. */
const AddConnectionForm: React.FC = () => {
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

    const handleTestConnection = (): void => {
        setIsTesting(true);
        // todo: call backend test-connection endpoint
        setTimeout(() => setIsTesting(false), 1500);
    };

    const handleSaveConnection = (): void => {
        if (!values.name.trim() || !values.host.trim()) { return; }
        setIsSaving(true);
        // todo: call backend save-connection endpoint
        setTimeout(() => setIsSaving(false), 1500);
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
                    onClick={handleTestConnection}
                >
                    Test Connection
                </Button>
                <Button
                    type="primary"
                    loading={isSaving}
                    onClick={handleSaveConnection}
                >
                    Save Connection
                </Button>
            </div>
        </div>
    );
};

export default AddConnectionForm;
