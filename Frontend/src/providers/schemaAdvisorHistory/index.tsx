"use client";

import React, { useCallback, useContext, useReducer } from "react";
import {
    getScansByConnection as apiGetScansByConnection,
    addScan as apiAddScan,
    deleteScan as apiDeleteScan,
} from "@/services/schemaAdvisorHistoryService";
import {
    getScansPending,
    getScansSuccess,
    getScansError,
    addScanPending,
    addScanSuccess,
    addScanError,
    deleteScanPending,
    deleteScanSuccess,
    deleteScanError,
    setActiveScanId as setActiveScanIdAction,
} from "./actions";
import {
    INITIAL_STATE,
    SchemaAdvisorHistoryStateContext,
    SchemaAdvisorHistoryActionContext,
} from "./context";
import { SchemaAdvisorHistoryReducer } from "./reducer";

export const SchemaAdvisorHistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(SchemaAdvisorHistoryReducer, INITIAL_STATE);

    const getScansByConnection = useCallback(async (connectionId: string) => {
        dispatch(getScansPending());
        try {
            const scans = await apiGetScansByConnection(connectionId);
            dispatch(getScansSuccess(scans));
        } catch (error) {
            console.error(error);
            dispatch(getScansError());
        }
    }, []);

    const addScan = useCallback(async (
        connectionId: string,
        recommendationCount: number,
        recommendationsJson: string | null,
        errorMessage: string | null,
    ) => {
        dispatch(addScanPending());
        try {
            const scan = await apiAddScan(connectionId, recommendationCount, recommendationsJson, errorMessage);
            dispatch(addScanSuccess(scan));
        } catch (error) {
            console.error(error);
            dispatch(addScanError());
        }
    }, []);

    const deleteScan = useCallback(async (scanId: string) => {
        dispatch(deleteScanPending());
        try {
            await apiDeleteScan(scanId);
            dispatch(deleteScanSuccess(scanId));
        } catch (error) {
            console.error(error);
            dispatch(deleteScanError());
        }
    }, []);

    const setActiveScanId = useCallback((scanId: string | null) => {
        dispatch(setActiveScanIdAction(scanId));
    }, []);

    return (
        <SchemaAdvisorHistoryStateContext.Provider value={state}>
            <SchemaAdvisorHistoryActionContext.Provider
                value={{ getScansByConnection, addScan, deleteScan, setActiveScanId }}
            >
                {children}
            </SchemaAdvisorHistoryActionContext.Provider>
        </SchemaAdvisorHistoryStateContext.Provider>
    );
};

export const useSchemaAdvisorHistoryState = () => {
    const context = useContext(SchemaAdvisorHistoryStateContext);
    if (!context) {
        throw new Error("useSchemaAdvisorHistoryState must be used within a SchemaAdvisorHistoryProvider");
    }
    return context;
};

export const useSchemaAdvisorHistoryActions = () => {
    const context = useContext(SchemaAdvisorHistoryActionContext);
    if (!context) {
        throw new Error("useSchemaAdvisorHistoryActions must be used within a SchemaAdvisorHistoryProvider");
    }
    return context;
};
