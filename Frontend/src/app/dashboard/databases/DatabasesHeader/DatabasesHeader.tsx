"use client";

import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useStyles } from "../style/styles";

const FORM_SECTION_ID = "add-connection-form";

/** Page header with title, subtitle, and an Add Connection shortcut button. */
const DatabasesHeader: React.FC = () => {
    const { styles } = useStyles();

    const scrollToForm = (): void => {
        document.getElementById(FORM_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className={styles.pageHeader}>
            <div>
                <h1 className={styles.pageTitle}>Databases</h1>
                <p className={styles.pageSubtitle}>Manage connections to your database clusters.</p>
            </div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className={styles.addButton}
                onClick={scrollToForm}
            >
                Add Connection
            </Button>
        </div>
    );
};

export default DatabasesHeader;
