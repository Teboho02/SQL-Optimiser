"use client";

import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryTable from "./HistoryTable/HistoryTable";
import HistoryPagination from "./HistoryPagination/HistoryPagination";
import { getAllQueryHistory, IQueryHistoryDto } from "@/services/queryHistoryService";
import { getDatabaseConnections, IDatabaseConnectionDto } from "@/services/databaseConnectionService";

/** Status of a historical analysis entry. */
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
    const improvement = dto.suggestedQuery ? "Has suggestion" : null;
    const date = new Date(dto.creationTime).toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    return {
        id: dto.id.slice(0, 8).toUpperCase(),
        queryPreview: dto.queryText,
        database: connectionName,
        improvement,
        status,
        date,
    };
}

/** Analysis History page — paginated log of all query executions run across the team. */
export default function HistoryPage(): React.JSX.Element {
    const [entries, setEntries] = useState<IHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        void (async () => {
            setIsLoading(true);
            try {
                const [historyDtos, connections] = await Promise.all([
                    getAllQueryHistory(),
                    getDatabaseConnections(),
                ]);

                const connectionMap = new Map<string, string>(
                    connections.map((c: IDatabaseConnectionDto) => [c.id, c.name])
                );

                setEntries(historyDtos.map((dto) => toHistoryEntry(dto, connectionMap)));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const totalEntries = entries.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const rangeStart = totalEntries === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(safePage * PAGE_SIZE, totalEntries);
    const pageEntries = entries.slice(rangeStart - 1, rangeEnd);

    const handleFilter = (): void => {
        // todo: open filter drawer/modal
    };

    const handleExportCsv = (): void => {
        // todo: trigger CSV export via backend API
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <HistoryHeader onFilter={handleFilter} onExportCsv={handleExportCsv} />
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
