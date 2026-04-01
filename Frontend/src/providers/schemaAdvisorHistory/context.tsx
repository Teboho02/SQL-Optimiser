import { createContext } from "react";
import { ISchemaAdvisorScanDto } from "@/services/schemaAdvisorHistoryService";

export interface ISchemaAdvisorHistoryStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    scans: ISchemaAdvisorScanDto[];
    activeScanId: string | null;
}

export interface ISchemaAdvisorHistoryActionContext {
    getScansByConnection: (connectionId: string) => void;
    addScan: (connectionId: string, recommendationCount: number, recommendationsJson: string | null, errorMessage: string | null) => void;
    deleteScan: (scanId: string) => void;
    setActiveScanId: (scanId: string | null) => void;
}

export const INITIAL_STATE: ISchemaAdvisorHistoryStateContext = {
    isPending: false,
    isSuccess: false,
    isError: false,
    scans: [],
    activeScanId: null,
};

export const INITIAL_ACTION_STATE: ISchemaAdvisorHistoryActionContext = {
    getScansByConnection: () => {},
    addScan: () => {},
    deleteScan: () => {},
    setActiveScanId: () => {},
};

export const SchemaAdvisorHistoryStateContext =
    createContext<ISchemaAdvisorHistoryStateContext>(INITIAL_STATE);

export const SchemaAdvisorHistoryActionContext =
    createContext<ISchemaAdvisorHistoryActionContext | undefined>(undefined);
