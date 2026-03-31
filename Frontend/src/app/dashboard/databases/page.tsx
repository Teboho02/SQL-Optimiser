"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { message } from "antd";
import DatabasesHeader from "./DatabasesHeader/DatabasesHeader";
import ConnectionCardList from "./ConnectionCardList/ConnectionCardList";
import AddConnectionForm from "./AddConnectionForm/AddConnectionForm";
import EditConnectionModal from "./EditConnectionModal/EditConnectionModal";
import {
    getDatabaseConnections,
    IDatabaseConnectionDto,
    DATABASE_ENGINE_NAMES,
    RESTORE_STATUS_LABELS,
    triggerDump,
    triggerRestore,
} from "@/services/databaseConnectionService";
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
        dumpStatus: dto.dumpStatus,
        restoreStatusRaw: dto.restoreStatus,
    };
}

/** Returns true if any connection has a pending or in-progress dump or restore. */
function hasActiveOperation(items: IDatabaseConnectionDto[]): boolean {
    return items.some((c) =>
        c.dumpStatus === 1 || c.dumpStatus === 2 ||
        c.restoreStatus === 1 || c.restoreStatus === 2,
    );
}

/** Databases page — view registered connections and add new ones. */
export default function DatabasesPage(): React.JSX.Element {
    const [rawConnections, setRawConnections] = useState<IDatabaseConnectionDto[]>([]);
    const [databases, setDatabases] = useState<IDatabase[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingConnection, setEditingConnection] = useState<IDatabaseConnectionDto | null>(null);
    const [dumpingIds, setDumpingIds] = useState<Set<string>>(new Set());
    const [rebuildingIds, setRebuildingIds] = useState<Set<string>>(new Set());
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchConnections = useCallback(async (): Promise<IDatabaseConnectionDto[]> => {
        const items = await getDatabaseConnections();
        setRawConnections(items);
        setDatabases(items.map(mapToDatabase));
        return items;
    }, []);

    const startPolling = useCallback(() => {
        if (pollTimerRef.current) return;
        pollTimerRef.current = setInterval(async () => {
            const items = await fetchConnections();
            if (!hasActiveOperation(items)) {
                clearInterval(pollTimerRef.current!);
                pollTimerRef.current = null;
            }
        }, 3000);
    }, [fetchConnections]);

    useEffect(() => {
        setIsLoading(true);
        fetchConnections()
            .then((items) => {
                if (hasActiveOperation(items)) startPolling();
            })
            .finally(() => setIsLoading(false));

        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, [fetchConnections, startPolling]);

    const handleEdit = (id: string): void => {
        const connection = rawConnections.find((c) => c.id === id) ?? null;
        setEditingConnection(connection);
    };

    const handleEditSaved = (): void => {
        setEditingConnection(null);
        void fetchConnections().then(startPolling);
    };

    const handleDump = async (id: string): Promise<void> => {
        setDumpingIds((prev) => new Set(prev).add(id));
        try {
            await triggerDump(id);
            void message.success("Dump queued — the snapshot will be ready shortly.");
            await fetchConnections();
            startPolling();
        } catch (err) {
            void message.error(err instanceof Error ? err.message : "Failed to trigger dump.");
        } finally {
            setDumpingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
        }
    };

    const handleRebuild = async (id: string): Promise<void> => {
        setRebuildingIds((prev) => new Set(prev).add(id));
        try {
            await triggerRestore(id);
            void message.success("Rebuild queued — the local copy will be ready shortly.");
            await fetchConnections();
            startPolling();
        } catch (err) {
            void message.error(err instanceof Error ? err.message : "Failed to trigger rebuild.");
        } finally {
            setRebuildingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
        }
    };

    return (
        <>
            <DatabasesHeader />
            <ConnectionCardList
                databases={databases}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDump={handleDump}
                onRebuild={handleRebuild}
                dumpingIds={dumpingIds}
                rebuildingIds={rebuildingIds}
            />
            <AddConnectionForm onSaved={() => void fetchConnections()} />
            <EditConnectionModal
                connection={editingConnection}
                onClose={() => setEditingConnection(null)}
                onSaved={handleEditSaved}
            />
        </>
    );
}
