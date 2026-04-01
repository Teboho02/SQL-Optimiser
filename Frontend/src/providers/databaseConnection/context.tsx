import { createContext } from "react";
import { IDatabaseConnectionDto } from "@/services/databaseConnectionService";

export interface IDatabaseConnectionStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    connections: IDatabaseConnectionDto[];
    selectedConnectionId: string | null;
}

export interface IDatabaseConnectionActionContext {
    getConnections: () => void;
    setSelectedConnectionId: (id: string | null) => void;
    triggerDump: (id: string) => void;
    triggerRestore: (id: string) => void;
}

export const INITIAL_STATE: IDatabaseConnectionStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
    connections: [],
    selectedConnectionId: null,
};

export const INITIAL_ACTION_STATE: IDatabaseConnectionActionContext = {
    getConnections: () => {},
    setSelectedConnectionId: () => {},
    triggerDump: () => {},
    triggerRestore: () => {},
};

export const DatabaseConnectionStateContext =
    createContext<IDatabaseConnectionStateContext>(INITIAL_STATE);

export const DatabaseConnectionActionContext =
    createContext<IDatabaseConnectionActionContext | undefined>(undefined);
