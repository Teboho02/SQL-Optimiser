"use client";

import React, { useState, useEffect } from "react";
import { Modal, Input, Switch, notification } from "antd";
import { IDatabaseConnectionDto, updateConnectionSettings } from "@/services/databaseConnectionService";

interface IEditConnectionModalProps {
    /** The connection being edited, or null when the modal is closed. */
    connection: IDatabaseConnectionDto | null;
    /** Called when the modal is dismissed without saving. */
    onClose: () => void;
    /** Called after a successful save so the list can refresh. */
    onSaved: () => void;
}

/** Modal for editing the DatabaseName and SchemaOnly settings of an existing connection. */
const EditConnectionModal: React.FC<IEditConnectionModalProps> = ({ connection, onClose, onSaved }) => {
    const [databaseName, setDatabaseName] = useState<string>("");
    const [schemaOnly, setSchemaOnly] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        if (connection) {
            setDatabaseName(connection.databaseName ?? "");
            setSchemaOnly(connection.schemaOnly);
        }
    }, [connection]);

    const handleSave = async (): Promise<void> => {
        if (!connection) {
            return;
        }

        setIsSaving(true);
        try {
            await updateConnectionSettings({
                id: connection.id,
                databaseName: databaseName.trim() || undefined,
                schemaOnly,
            });

            notification.success({ message: "Settings saved. A new dump has been queued." });
            onSaved();
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            notification.error({ message: "Failed to save settings", description: message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            title={`Edit Connection — ${connection?.name ?? ""}`}
            open={!!connection}
            onOk={() => { void handleSave(); }}
            onCancel={onClose}
            okText="Save & Re-dump"
            confirmLoading={isSaving}
            destroyOnHidden
        >
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                <div>
                    <label htmlFor="edit-db-name" style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                        Database Name
                    </label>
                    <Input
                        id="edit-db-name"
                        value={databaseName}
                        onChange={(event) => setDatabaseName(event.target.value)}
                        placeholder="e.g. neondb"
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Switch
                        id="edit-schema-only"
                        checked={schemaOnly}
                        onChange={setSchemaOnly}
                    />
                    <label htmlFor="edit-schema-only" style={{ fontSize: 13, fontWeight: 500 }}>
                        Schema only (copy structure, no data)
                    </label>
                </div>
            </div>
        </Modal>
    );
};

export default EditConnectionModal;
