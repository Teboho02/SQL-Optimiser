"use client";

import React, { useState } from "react";
import HistoryHeader from "./HistoryHeader/HistoryHeader";
import HistoryTable from "./HistoryTable/HistoryTable";
import HistoryPagination from "./HistoryPagination/HistoryPagination";

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
const TOTAL_ENTRIES = 1284;

// mock data used until the backend history API is wired up
const MOCK_ENTRIES: IHistoryEntry[] = [
    { id: "ANL-892", queryPreview: "SELECT u.id, u.name, COUNT(o.id)...", database: "prod-main", improvement: "+99%", status: "success", date: "2023-10-24 14:32" },
    { id: "ANL-891", queryPreview: "UPDATE inventory SET stock = ...", database: "prod-main", improvement: "+12%", status: "success", date: "2023-10-24 12:15" },
    { id: "ANL-890", queryPreview: "SELECT COUNT(*) FROM events...", database: "prod-analytics", improvement: null, status: "warning", date: "2023-10-23 09:41" },
    { id: "ANL-889", queryPreview: "DELETE FROM sessions WHERE...", database: "staging-1", improvement: "+85%", status: "success", date: "2023-10-22 16:20" },
    { id: "ANL-888", queryPreview: "SELECT * FROM audit_logs WHERE...", database: "prod-main", improvement: "+45%", status: "success", date: "2023-10-21 11:05" },
    { id: "ANL-887", queryPreview: "INSERT INTO metrics (time, val)...", database: "prod-analytics", improvement: "Error", status: "critical", date: "2023-10-20 08:30" },
];

/** Analysis History page — paginated log of all query analyses run across the team. */
export default function HistoryPage(): React.JSX.Element {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(TOTAL_ENTRIES / PAGE_SIZE);
    const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * PAGE_SIZE, TOTAL_ENTRIES);

    const handleFilter = (): void => {
        // todo: open filter drawer/modal
    };

    const handleExportCsv = (): void => {
        // todo: trigger CSV export via backend API
    };

    return (
        <>
            <HistoryHeader onFilter={handleFilter} onExportCsv={handleExportCsv} />
            <HistoryTable entries={MOCK_ENTRIES} />
            <HistoryPagination
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                totalEntries={TOTAL_ENTRIES}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
}
