import { handleActions } from "redux-actions";
import { INITIAL_STATE, IQueryHistoryStateContext } from "./context";
import { QueryHistoryActionEnums } from "./actions";
import { IQueryHistoryDto } from "@/services/queryHistoryService";

type P = Partial<IQueryHistoryStateContext> & { entry?: IQueryHistoryDto; deletedId?: string };

export const QueryHistoryReducer = handleActions<IQueryHistoryStateContext, P>(
    {
        [QueryHistoryActionEnums.getHistoryPending]: (state, action) => ({ ...state, ...action.payload }),
        [QueryHistoryActionEnums.getHistorySuccess]: (state, action) => ({ ...state, ...action.payload }),
        [QueryHistoryActionEnums.getHistoryError]: (state, action) => ({ ...state, ...action.payload }),

        [QueryHistoryActionEnums.addEntryPending]: (state, action) => ({ ...state, ...action.payload }),
        [QueryHistoryActionEnums.addEntrySuccess]: (state, action) => ({
            ...state,
            isPending: false,
            isSuccess: true,
            isError: false,
            entries: action.payload.entry
                ? [action.payload.entry, ...state.entries]
                : state.entries,
        }),
        [QueryHistoryActionEnums.addEntryError]: (state, action) => ({ ...state, ...action.payload }),

        [QueryHistoryActionEnums.deleteEntryPending]: (state, action) => ({ ...state, ...action.payload }),
        [QueryHistoryActionEnums.deleteEntrySuccess]: (state, action) => ({
            ...state,
            isPending: false,
            isSuccess: true,
            isError: false,
            entries: state.entries.filter((e) => e.id !== action.payload.deletedId),
        }),
        [QueryHistoryActionEnums.deleteEntryError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);
