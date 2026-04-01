"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { message } from "antd";
import DatabasesHeader from "./DatabasesHeader/DatabasesHeader";
import ConnectionCardList from "./ConnectionCardList/ConnectionCardList";
import AddConnectionForm from "./AddConnectionForm/AddConnectionForm";
import EditConnectionModal from "./EditConnectionModal/EditConnectionModal";
import DataGeneratorDrawer from "./DataGeneratorDrawer/DataGeneratorDrawer";
import { IDatabaseConnectionDto, DATABASE_ENGINE_NAMES, RESTORE_STATUS_LABELS } from "@/services/databaseConnectionService";
import { useDatabaseConnectionState, useDatabaseConnectionActions } from "@/providers/databaseConnection";
import { IDatabase } from "./ConnectionCard/ConnectionCard";

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
        schemaOnly: dto.schemaOnly,
    };
}

function hasActiveOperation(items: IDatabaseConnectionDto[]): boolean {
    return items.some((c) =>
        c.dumpStatus === 1 || c.dumpStatus === 2 ||
        c.restoreStatus === 1 || c.restoreStatus === 2,
    );
}

export default function DatabasesPage(): React.JSX.Element {
    const { connections, isPending } = useDatabaseConnectionState();
    const { getConnections, triggerDump, triggerRestore } = useDatabaseConnectionActions();

    const [editingConnection, setEditingConnection] = useState<IDatabaseConnectionDto | null>(null);
    const [dataGenConnectionId, setDataGenConnectionId] = useState<string | null>(null);
    const [dumpingIds, setDumpingIds] = useState<Set<string>>(new Set());
    const [rebuildingIds, setRebuildingIds] = useState<Set<string>>(new Set());
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startPolling = useCallback(() => {
        if (pollTimerRef.current) return;
        pollTimerRef.current = setInterval(() => {
            void getConnections();
            if (!hasActiveOperation(connections)) {
                clearInterval(pollTimerRef.current!);
                pollTimerRef.current = null;
            }
        }, 3000);
    }, [getConnections, connections]);

    useEffect(() => {
        void getConnections();
        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, [getConnections]);

    useEffect(() => {
        if (hasActiveOperation(connections)) {
            startPolling();
        }
    }, [connections, startPolling]);

    const handleEdit = (id: string): void => {
        setEditingConnection(connections.find((c) => c.id === id) ?? null);
    };

    const handleEditSaved = (): void => {
        setEditingConnection(null);
        void getConnections();
    };

    const handleDump = async (id: string): Promise<void> => {
        setDumpingIds((prev) => new Set(prev).add(id));
        try {
            await triggerDump(id);
            void message.success("Dump queued — the snapshot will be ready shortly.");
            startPolling();
        } catch {
            void message.error("Failed to trigger dump.");
        } finally {
            setDumpingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
        }
    };

    const handleRebuild = async (id: string): Promise<void> => {
        setRebuildingIds((prev) => new Set(prev).add(id));
        try {
            await triggerRestore(id);
            void message.success("Rebuild queued — the local copy will be ready shortly.");
            startPolling();
        } catch {
            void message.error("Failed to trigger rebuild.");
        } finally {
            setRebuildingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
        }
    };

    return (
        <>
            <DatabasesHeader />
            <ConnectionCardList
                databases={connections.map(mapToDatabase)}
                isLoading={isPending && connections.length === 0}
                onEdit={handleEdit}
                onDump={handleDump}
                onRebuild={handleRebuild}
                onGenerateData={(id) => setDataGenConnectionId(id)}
                dumpingIds={dumpingIds}
                rebuildingIds={rebuildingIds}
            />
            <AddConnectionForm onSaved={() => void getConnections()} />
            <EditConnectionModal
                connection={editingConnection}
                onClose={() => setEditingConnection(null)}
                onSaved={handleEditSaved}
            />
            <DataGeneratorDrawer
                connectionId={dataGenConnectionId}
                connectionName={connections.find((c) => c.id === dataGenConnectionId)?.name ?? ""}
                onClose={() => setDataGenConnectionId(null)}
            />
        </>
    );
}
