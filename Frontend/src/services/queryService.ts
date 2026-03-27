import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

export interface IExecuteQueryRequest {
    connectionId: string;
    sql: string;
}

export interface IExecuteQueryResponse {
    columns: string[];
    rows: Record<string, string>[];
    rowsAffected: number;
    executionTimeMs: number;
    error: string | null;
}

export interface ISchemaTable {
    name: string;
    columns: string[];
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenService.getToken()}`,
    };
}

/** Executes a SQL query against the local copy of the given connection's database. */
export async function executeQuery(request: IExecuteQueryRequest): Promise<IExecuteQueryResponse> {
    const response = await fetch(API_CONSTANTS.EXECUTE_QUERY, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as IExecuteQueryResponse;
}

/** Fetches the schema (tables + columns) for the local copy of the given connection's database. */
export async function getSchema(connectionId: string): Promise<ISchemaTable[]> {
    const response = await fetch(API_CONSTANTS.GET_SCHEMA, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId }),
    });

    const json = await response.json();
    return (json.result ?? []) as ISchemaTable[];
}
