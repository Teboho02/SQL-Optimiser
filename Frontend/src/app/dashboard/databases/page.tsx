"use client";

import React, { useEffect, useState, useCallback } from "react";
import DatabasesHeader from "./DatabasesHeader/DatabasesHeader";
import ConnectionCardList from "./ConnectionCardList/ConnectionCardList";
import AddConnectionForm from "./AddConnectionForm/AddConnectionForm";
import EditConnectionModal from "./EditConnectionModal/EditConnectionModal";
import { getDatabaseConnections, IDatabaseConnectionDto, DATABASE_ENGINE_NAMES, RESTORE_STATUS_LABELS } from "@/services/databaseConnectionService";
import { IDatabase } from "./ConnectionCard/ConnectionCard";

/** Maps a backend DTO to the shape expected by ConnectionCard. */
function mapToDatabase(dto: IDatabaseConnectionDto): IDatabase {
    return {
        id: dto.id,
        name: dto.name,
        engine: DATABASE_ENGINE_NAMES[dto.databaseType] ?? "Unknown",
        version: 0,
        host: dto.dbHost,
        latency: "-",
        status: "connected",
        restoreStatus: RESTORE_STATUS_LABELS[dto.restoreStatus] ?? "Unknown",
        isLocalReady: dto.restoreStatus === 3,
    };
}

/** Databases page — view registered connections and add new ones. */
export default function DatabasesPage(): React.JSX.Element {
    const [rawConnections, setRawConnections] = useState<IDatabaseConnectionDto[]>([]);
    const [databases, setDatabases] = useState<IDatabase[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingConnection, setEditingConnection] = useState<IDatabaseConnectionDto | null>(null);

    const fetchConnections = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const items = await getDatabaseConnections();
            setRawConnections(items);
            setDatabases(items.map(mapToDatabase));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchConnections();
    }, [fetchConnections]);

    const handleEdit = (id: string): void => {
        const connection = rawConnections.find((c) => c.id === id) ?? null;
        setEditingConnection(connection);
    };

    const handleEditSaved = (): void => {
        setEditingConnection(null);
        void fetchConnections();
    };

    return (
        <>
            <DatabasesHeader />
            <ConnectionCardList databases={databases} isLoading={isLoading} onEdit={handleEdit} />
            <AddConnectionForm onSaved={fetchConnections} />
            <EditConnectionModal
                connection={editingConnection}
                onClose={() => setEditingConnection(null)}
                onSaved={handleEditSaved}
            />
        </>
    );
}
