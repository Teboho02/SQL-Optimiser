import { createAction } from "redux-actions";
import { IQueryHistoryDto } from "@/services/queryHistoryService";
import { IQueryHistoryStateContext } from "./context";

type P = Partial<IQueryHistoryStateContext> & { entry?: IQueryHistoryDto; deletedId?: string };

export enum QueryHistoryActionEnums {
    getHistoryPending = "GET_QUERY_HISTORY_PENDING",
    getHistorySuccess = "GET_QUERY_HISTORY_SUCCESS",
    getHistoryError = "GET_QUERY_HISTORY_ERROR",

    addEntryPending = "ADD_QUERY_HISTORY_PENDING",
    addEntrySuccess = "ADD_QUERY_HISTORY_SUCCESS",
    addEntryError = "ADD_QUERY_HISTORY_ERROR",

    deleteEntryPending = "DELETE_QUERY_HISTORY_PENDING",
    deleteEntrySuccess = "DELETE_QUERY_HISTORY_SUCCESS",
    deleteEntryError = "DELETE_QUERY_HISTORY_ERROR",
}

export const getHistoryPending = createAction<P>(
    QueryHistoryActionEnums.getHistoryPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const getHistorySuccess = createAction<P, IQueryHistoryDto[]>(
    QueryHistoryActionEnums.getHistorySuccess,
    (entries) => ({ isPending: false, isSuccess: true, isError: false, entries }),
);

export const getHistoryError = createAction<P>(
    QueryHistoryActionEnums.getHistoryError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const addEntryPending = createAction<P>(
    QueryHistoryActionEnums.addEntryPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const addEntrySuccess = createAction<P, IQueryHistoryDto>(
    QueryHistoryActionEnums.addEntrySuccess,
    (entry) => ({ isPending: false, isSuccess: true, isError: false, entry }),
);

export const addEntryError = createAction<P>(
    QueryHistoryActionEnums.addEntryError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);

export const deleteEntryPending = createAction<P>(
    QueryHistoryActionEnums.deleteEntryPending,
    () => ({ isPending: true, isSuccess: false, isError: false }),
);

export const deleteEntrySuccess = createAction<P, string>(
    QueryHistoryActionEnums.deleteEntrySuccess,
    (deletedId) => ({ isPending: false, isSuccess: true, isError: false, deletedId }),
);

export const deleteEntryError = createAction<P>(
    QueryHistoryActionEnums.deleteEntryError,
    () => ({ isPending: false, isSuccess: false, isError: true }),
);
