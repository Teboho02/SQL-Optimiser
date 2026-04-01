import { handleActions } from "redux-actions";
import { INITIAL_STATE, ISchemaAdvisorHistoryStateContext } from "./context";
import { SchemaAdvisorHistoryActionEnums } from "./actions";
import { ISchemaAdvisorScanDto } from "@/services/schemaAdvisorHistoryService";

type P = Partial<ISchemaAdvisorHistoryStateContext> & { scan?: ISchemaAdvisorScanDto; deletedId?: string };

export const SchemaAdvisorHistoryReducer = handleActions<ISchemaAdvisorHistoryStateContext, P>(
    {
        [SchemaAdvisorHistoryActionEnums.getScansPending]: (state, action) => ({ ...state, ...action.payload }),
        [SchemaAdvisorHistoryActionEnums.getScansSuccess]: (state, action) => ({ ...state, ...action.payload }),
        [SchemaAdvisorHistoryActionEnums.getScansError]: (state, action) => ({ ...state, ...action.payload }),

        [SchemaAdvisorHistoryActionEnums.addScanPending]: (state, action) => ({ ...state, ...action.payload }),
        [SchemaAdvisorHistoryActionEnums.addScanSuccess]: (state, action) => ({
            ...state,
            isPending: false,
            isSuccess: true,
            isError: false,
            scans: action.payload.scan ? [action.payload.scan, ...state.scans] : state.scans,
            activeScanId: action.payload.scan?.id ?? state.activeScanId,
        }),
        [SchemaAdvisorHistoryActionEnums.addScanError]: (state, action) => ({ ...state, ...action.payload }),

        [SchemaAdvisorHistoryActionEnums.deleteScanPending]: (state, action) => ({ ...state, ...action.payload }),
        [SchemaAdvisorHistoryActionEnums.deleteScanSuccess]: (state, action) => ({
            ...state,
            isPending: false,
            isSuccess: true,
            isError: false,
            scans: state.scans.filter((s) => s.id !== action.payload.deletedId),
            activeScanId: state.activeScanId === action.payload.deletedId ? null : state.activeScanId,
        }),
        [SchemaAdvisorHistoryActionEnums.deleteScanError]: (state, action) => ({ ...state, ...action.payload }),

        [SchemaAdvisorHistoryActionEnums.setActiveScanId]: (state, action) => ({ ...state, ...action.payload }),
    },
    INITIAL_STATE,
);
