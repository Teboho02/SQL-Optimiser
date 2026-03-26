"use client";

import React from "react";
import { useStyles } from "../style/styles";

interface IHistoryPaginationProps {
    /** Index of the first entry on the current page (1-based). */
    rangeStart: number;
    /** Index of the last entry on the current page (1-based). */
    rangeEnd: number;
    /** Total number of entries across all pages. */
    totalEntries: number;
    /** Currently active page number (1-based). */
    currentPage: number;
    /** Total number of pages. */
    totalPages: number;
    /** Called when the user navigates to a specific page. */
    onPageChange: (page: number) => void;
}

/** Footer row showing entry range, total count, and page navigation controls. */
const HistoryPagination: React.FC<IHistoryPaginationProps> = ({
    rangeStart,
    rangeEnd,
    totalEntries,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const { styles } = useStyles();

    // show up to 3 page buttons centred around the current page
    const visiblePages: number[] = [1, 2, 3].filter((page) => page <= totalPages);

    return (
        <div className={styles.paginationRow}>
            <span>
                Showing {rangeStart} to {rangeEnd} of {totalEntries.toLocaleString()} entries
            </span>
            <div className={styles.paginationControls}>
                <button
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ""}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                >
                    Prev
                </button>
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ""}`}
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className={`${styles.pageButton} ${currentPage === totalPages ? styles.pageButtonDisabled : ""}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default HistoryPagination;
