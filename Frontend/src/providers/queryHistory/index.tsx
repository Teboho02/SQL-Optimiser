"use client";

import React, { useContext, useReducer } from "react";
import {
    getAllQueryHistory,
    getQueryHistory,
    addQueryHistory,
    deleteQueryHistory,
    IAddQueryHistoryRequest,
    IQueryHistoryDto,
} from "@/services/queryHistoryService";
import {
    getHistoryPending,
    getHistorySuccess,
    getHistoryError,
    addEntryPending,
    addEntrySuccess,
    addEntryError,
    deleteEntryPending,
    deleteEntrySuccess,
    deleteEntryError,
} from "./actions";
import {
    INITIAL_STATE,
    QueryHistoryStateContext,
    QueryHistoryActionContext,
} from "./context";
import { QueryHistoryReducer } from "./reducer";

export const QueryHistoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(QueryHistoryReducer, INITIAL_STATE);

    const getAllHistory = async () => {
        dispatch(getHistoryPending());
        try {
            const entries = await getAllQueryHistory();
            dispatch(getHistorySuccess(entries));
        } catch (error) {
            console.error(error);
            dispatch(getHistoryError());
        }
    };

    const getHistoryByConnection = async (connectionId: string) => {
        dispatch(getHistoryPending());
        try {
            const entries = await getQueryHistory(connectionId);
            dispatch(getHistorySuccess(entries));
        } catch (error) {
            console.error(error);
            dispatch(getHistoryError());
        }
    };

    const addEntry = async (request: IAddQueryHistoryRequest) => {
        dispatch(addEntryPending());
        try {
            await addQueryHistory(request);
            // Optimistically add a placeholder; caller can refresh via getHistoryByConnection
            const placeholder: IQueryHistoryDto = {
                id: crypto.randomUUID(),
                databaseConnectionId: request.databaseConnectionId,
                queryText: request.queryText,
                suggestedQuery: request.suggestedQuery ?? null,
                resultSummary: request.resultSummary ?? null,
                errorMessage: request.errorMessage ?? null,
                executionTime: request.executionTime ?? "00:00:00",
                creationTime: new Date().toISOString(),
            };
            dispatch(addEntrySuccess(placeholder));
        } catch (error) {
            console.error(error);
            dispatch(addEntryError());
        }
    };

    const deleteEntry = async (entryId: string) => {
        dispatch(deleteEntryPending());
        try {
            await deleteQueryHistory(entryId);
            dispatch(deleteEntrySuccess(entryId));
        } catch (error) {
            console.error(error);
            dispatch(deleteEntryError());
        }
    };

    return (
        <QueryHistoryStateContext.Provider value={state}>
            <QueryHistoryActionContext.Provider
                value={{ getAllHistory, getHistoryByConnection, addEntry, deleteEntry }}
            >
                {children}
            </QueryHistoryActionContext.Provider>
        </QueryHistoryStateContext.Provider>
    );
};

export const useQueryHistoryState = () => {
    const context = useContext(QueryHistoryStateContext);
    if (!context) {
        throw new Error("useQueryHistoryState must be used within a QueryHistoryProvider");
    }
    return context;
};

export const useQueryHistoryActions = () => {
    const context = useContext(QueryHistoryActionContext);
    if (!context) {
        throw new Error("useQueryHistoryActions must be used within a QueryHistoryProvider");
    }
    return context;
};
