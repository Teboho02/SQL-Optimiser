import { handleActions } from "redux-actions";
import { INITIAL_STATE, IDatabaseConnectionStateContext } from "./context";
import { DatabaseConnectionActionEnums } from "./actions";

type P = Partial<IDatabaseConnectionStateContext>;

export const DatabaseConnectionReducer = handleActions<IDatabaseConnectionStateContext, P>(
    {
        [DatabaseConnectionActionEnums.getConnectionsPending]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.getConnectionsSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.getConnectionsError]: (state, action) => ({ ...state, ...action.payload }),

        [DatabaseConnectionActionEnums.setSelectedConnectionId]: (state, action) => ({ ...state, ...action.payload }),

        [DatabaseConnectionActionEnums.triggerDumpPending]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.triggerDumpSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.triggerDumpError]: (state, action) => ({ ...state, ...action.payload }),

        [DatabaseConnectionActionEnums.triggerRestorePending]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.triggerRestoreSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [DatabaseConnectionActionEnums.triggerRestoreError]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);
