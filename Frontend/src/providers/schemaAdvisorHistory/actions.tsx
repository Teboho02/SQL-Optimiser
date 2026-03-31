import { createAction } from "redux-actions";
import { ISchemaAdvisorScanDto } from "@/services/schemaAdvisorHistoryService";
import { ISchemaAdvisorHistoryStateContext } from "./context";

type P = Partial<ISchemaAdvisorHistoryStateContext> & { scan?: ISchemaAdvisorScanDto; deletedId?: string };

export enum SchemaAdvisorHistoryActionEnums {
    getScansPending = "GET_SCHEMA_SCANS_PENDING",
    getScansSuccess = "GET_SCHEMA_SCANS_SUCCESS",
    getScansError = "GET_SCHEMA_SCANS_ERROR",

    addScanPending = "ADD_SCHEMA_SCAN_PENDING",
    addScanSuccess = "ADD_SCHEMA_SCAN_SUCCESS",
    addScanError = "ADD_SCHEMA_SCAN_ERROR",

    deleteScanPending = "DELETE_SCHEMA_SCAN_PENDING",
    deleteScanSuccess = "DELETE_SCHEMA_SCAN_SUCCESS",
    deleteScanError = "DELETE_SCHEMA_SCAN_ERROR",

    setActiveScanId = "SET_ACTIVE_SCAN_ID",
}

export const getScansPending = createAction<P>(
    SchemaAdvisorHistoryActionEnums.getScansPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getScansSuccess = createAction<P, ISchemaAdvisorScanDto[]>(
    SchemaAdvisorHistoryActionEnums.getScansSuccess,
    (scans) => ({ isPending: false, isSuccess: true, isError: false, scans }),
);

export const getScansError = createAction<P>(
    SchemaAdvisorHistoryActionEnums.getScansError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const addScanPending = createAction<P>(
    SchemaAdvisorHistoryActionEnums.addScanPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const addScanSuccess = createAction<P, ISchemaAdvisorScanDto>(
    SchemaAdvisorHistoryActionEnums.addScanSuccess,
    (scan) => ({ isPending: false, isSuccess: true, isError: false, scan }),
);

export const addScanError = createAction<P>(
    SchemaAdvisorHistoryActionEnums.addScanError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const deleteScanPending = createAction<P>(
    SchemaAdvisorHistoryActionEnums.deleteScanPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const deleteScanSuccess = createAction<P, string>(
    SchemaAdvisorHistoryActionEnums.deleteScanSuccess,
    (deletedId) => ({ isPending: false, isSuccess: true, isError: false, deletedId }),
);

export const deleteScanError = createAction<P>(
    SchemaAdvisorHistoryActionEnums.deleteScanError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const setActiveScanId = createAction<P, string | null>(
    SchemaAdvisorHistoryActionEnums.setActiveScanId,
    (activeScanId) => ({ activeScanId }),
);
