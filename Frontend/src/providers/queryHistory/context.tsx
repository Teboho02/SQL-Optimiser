import { createContext } from "react";
import { IQueryHistoryDto, IAddQueryHistoryRequest } from "@/services/queryHistoryService";

export interface IQueryHistoryStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    entries: IQueryHistoryDto[];
}

export interface IQueryHistoryActionContext {
    getHistoryByConnection: (connectionId: string) => void;
    getAllHistory: () => void;
    addEntry: (request: IAddQueryHistoryRequest) => void;
    deleteEntry: (entryId: string) => void;
}

export const INITIAL_STATE: IQueryHistoryStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
    entries: [],
};

export const INITIAL_ACTION_STATE: IQueryHistoryActionContext = {
    getHistoryByConnection: () => {},
    getAllHistory: () => {},
    addEntry: () => {},
    deleteEntry: () => {},
};

export const QueryHistoryStateContext =
    createContext<IQueryHistoryStateContext>(INITIAL_STATE);

export const QueryHistoryActionContext =
    createContext<IQueryHistoryActionContext | undefined>(undefined);
