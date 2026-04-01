"use client";

import React, { useCallback, useContext, useReducer } from "react";
import {
    getDatabaseConnections,
    triggerDump as apiTriggerDump,
    triggerRestore as apiTriggerRestore,
} from "@/services/databaseConnectionService";
import {
    getConnectionsPending,
    getConnectionsSuccess,
    getConnectionsError,
    setSelectedConnectionId as setSelectedConnectionIdAction,
    triggerDumpPending,
    triggerDumpSuccess,
    triggerDumpError,
    triggerRestorePending,
    triggerRestoreSuccess,
    triggerRestoreError,
} from "./actions";
import {
    INITIAL_STATE,
    DatabaseConnectionStateContext,
    DatabaseConnectionActionContext,
} from "./context";
import { DatabaseConnectionReducer } from "./reducer";

export const DatabaseConnectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(DatabaseConnectionReducer, INITIAL_STATE);

    const getConnections = useCallback(async () => {
        dispatch(getConnectionsPending());
        try {
            const connections = await getDatabaseConnections();
            dispatch(getConnectionsSuccess(connections));
        } catch (error) {
            console.error(error);
            dispatch(getConnectionsError());
        }
    }, []);

    const setSelectedConnectionId = useCallback((id: string | null) => {
        dispatch(setSelectedConnectionIdAction(id));
    }, []);

    const triggerDump = useCallback(async (id: string) => {
        dispatch(triggerDumpPending());
        try {
            await apiTriggerDump(id);
            const connections = await getDatabaseConnections();
            dispatch(triggerDumpSuccess(connections));
        } catch (error) {
            console.error(error);
            dispatch(triggerDumpError());
        }
    }, []);

    const triggerRestore = useCallback(async (id: string) => {
        dispatch(triggerRestorePending());
        try {
            await apiTriggerRestore(id);
            const connections = await getDatabaseConnections();
            dispatch(triggerRestoreSuccess(connections));
        } catch (error) {
            console.error(error);
            dispatch(triggerRestoreError());
        }
    }, []);

    return (
        <DatabaseConnectionStateContext.Provider value={state}>
            <DatabaseConnectionActionContext.Provider
                value={{ getConnections, setSelectedConnectionId, triggerDump, triggerRestore }}
            >
                {children}
            </DatabaseConnectionActionContext.Provider>
        </DatabaseConnectionStateContext.Provider>
    );
};

export const useDatabaseConnectionState = () => {
    const context = useContext(DatabaseConnectionStateContext);
    if (!context) {
        throw new Error("useDatabaseConnectionState must be used within a DatabaseConnectionProvider");
    }
    return context;
};

export const useDatabaseConnectionActions = () => {
    const context = useContext(DatabaseConnectionActionContext);
    if (!context) {
        throw new Error("useDatabaseConnectionActions must be used within a DatabaseConnectionProvider");
    }
    return context;
};
