"use client";

import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryTable from "./HistoryTable/HistoryTable";
import HistoryPagination from "./HistoryPagination/HistoryPagination";
import { IQueryHistoryDto } from "@/services/queryHistoryService";
import { useDatabaseConnectionState, useDatabaseConnectionActions } from "@/providers/databaseConnection";
import { useQueryHistoryState, useQueryHistoryActions } from "@/providers/queryHistory";

type HistoryStatus = "success" | "warning" | "critical";

interface IHistoryEntry {
    id: string;
    queryPreview: string;
    database: string;
    improvement: string | null;
    status: HistoryStatus;
    date: string;
}

const PAGE_SIZE = 6;

function toHistoryEntry(dto: IQueryHistoryDto, connectionMap: Map<string, string>): IHistoryEntry {
    const connectionName = connectionMap.get(dto.databaseConnectionId) ?? dto.databaseConnectionId.slice(0, 8);
    const status: HistoryStatus = dto.errorMessage ? "critical" : dto.suggestedQuery ? "warning" : "success";
    const date = new Date(dto.creationTime).toLocaleString([], {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
    return {
        id: dto.id.slice(0, 8).toUpperCase(),
        queryPreview: dto.queryText,
        database: connectionName,
        improvement: dto.suggestedQuery ? "Has suggestion" : null,
        status,
        date,
    };
}

/** Analysis History page — paginated log of all query executions run across the team. */
export default function HistoryPage(): React.JSX.Element {
    const { connections } = useDatabaseConnectionState();
    const { getConnections } = useDatabaseConnectionActions();
    const { entries, isPending } = useQueryHistoryState();
    const { getAllHistory } = useQueryHistoryActions();

    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        void getConnections();
        void getAllHistory();
    }, [getConnections, getAllHistory]);

    const connectionMap = new Map<string, string>(connections.map((c) => [c.id, c.name]));
    const mappedEntries = entries.map((dto) => toHistoryEntry(dto, connectionMap));

    const totalEntries = mappedEntries.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const rangeStart = totalEntries === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(safePage * PAGE_SIZE, totalEntries);
    const pageEntries = mappedEntries.slice(rangeStart - 1, rangeEnd);

    if (isPending && entries.length === 0) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <HistoryHeader onFilter={() => {}} onExportCsv={() => {}} />
            <HistoryTable entries={pageEntries} />
            <HistoryPagination
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                totalEntries={totalEntries}
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
}
