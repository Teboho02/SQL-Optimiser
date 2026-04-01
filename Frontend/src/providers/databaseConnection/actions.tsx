import { createAction } from "redux-actions";
import { IDatabaseConnectionDto } from "@/services/databaseConnectionService";
import { IDatabaseConnectionStateContext } from "./context";

type P = Partial<IDatabaseConnectionStateContext>;

export enum DatabaseConnectionActionEnums {
    getConnectionsPending = "GET_CONNECTIONS_PENDING",
    getConnectionsSuccess = "GET_CONNECTIONS_SUCCESS",
    getConnectionsError = "GET_CONNECTIONS_ERROR",

    setSelectedConnectionId = "SET_SELECTED_CONNECTION_ID",

    triggerDumpPending = "TRIGGER_DUMP_PENDING",
    triggerDumpSuccess = "TRIGGER_DUMP_SUCCESS",
    triggerDumpError = "TRIGGER_DUMP_ERROR",

    triggerRestorePending = "TRIGGER_RESTORE_PENDING",
    triggerRestoreSuccess = "TRIGGER_RESTORE_SUCCESS",
    triggerRestoreError = "TRIGGER_RESTORE_ERROR",
}

export const getConnectionsPending = createAction<P>(
    DatabaseConnectionActionEnums.getConnectionsPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getConnectionsSuccess = createAction<P, IDatabaseConnectionDto[]>(
    DatabaseConnectionActionEnums.getConnectionsSuccess,
    (connections) => ({ isPending: false, isSuccess: true, isError: false, connections }),
);

export const getConnectionsError = createAction<P>(
    DatabaseConnectionActionEnums.getConnectionsError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const setSelectedConnectionId = createAction<P, string | null>(
    DatabaseConnectionActionEnums.setSelectedConnectionId,
    (selectedConnectionId) => ({ selectedConnectionId }),
);

export const triggerDumpPending = createAction<P>(
    DatabaseConnectionActionEnums.triggerDumpPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const triggerDumpSuccess = createAction<P, IDatabaseConnectionDto[]>(
    DatabaseConnectionActionEnums.triggerDumpSuccess,
    (connections) => ({ isPending: false, isSuccess: true, isError: false, connections }),
);

export const triggerDumpError = createAction<P>(
    DatabaseConnectionActionEnums.triggerDumpError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const triggerRestorePending = createAction<P>(
    DatabaseConnectionActionEnums.triggerRestorePending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const triggerRestoreSuccess = createAction<P, IDatabaseConnectionDto[]>(
    DatabaseConnectionActionEnums.triggerRestoreSuccess,
    (connections) => ({ isPending: false, isSuccess: true, isError: false, connections }),
);

export const triggerRestoreError = createAction<P>(
    DatabaseConnectionActionEnums.triggerRestoreError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);
