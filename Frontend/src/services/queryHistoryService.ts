import { API_CONSTANTS } from "@/constants/ApiConstants";
import { apiFetch } from "@/utils/apiFetch";

export interface IQueryHistoryDto {
    id: string;
    databaseConnectionId: string;
    queryText: string;
    suggestedQuery: string | null;
    resultSummary: string | null;
    errorMessage: string | null;
    executionTime: string;
    creationTime: string;
}

export interface IAddQueryHistoryRequest {
    databaseConnectionId: string;
    queryText: string;
    suggestedQuery?: string | null;
    resultSummary?: string | null;
    errorMessage?: string | null;
    executionTime: string;
}

/** Fetches all query history across every connection, ordered newest-first. */
export async function getAllQueryHistory(): Promise<IQueryHistoryDto[]> {
    const response = await apiFetch(API_CONSTANTS.GET_ALL_QUERY_HISTORY);
    const json = await response.json();
    return (json.result ?? []) as IQueryHistoryDto[];
}

/** Fetches query history for a given connection, ordered newest-first. */
export async function getQueryHistory(connectionId: string): Promise<IQueryHistoryDto[]> {
    const url = `${API_CONSTANTS.GET_QUERY_HISTORY}?connectionId=${encodeURIComponent(connectionId)}`;
    const response = await apiFetch(url);
    const json = await response.json();
    return (json.result ?? []) as IQueryHistoryDto[];
}

/** Saves a new query history entry. */
export async function addQueryHistory(entry: IAddQueryHistoryRequest): Promise<void> {
    await apiFetch(API_CONSTANTS.ADD_QUERY_HISTORY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
    });
}

/** Deletes a single query history entry by ID. */
export async function deleteQueryHistory(entryId: string): Promise<void> {
    const url = `${API_CONSTANTS.DELETE_QUERY_HISTORY}?entryId=${encodeURIComponent(entryId)}`;
    await apiFetch(url, { method: "DELETE" });
}
