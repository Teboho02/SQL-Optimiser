import { API_CONSTANTS } from "@/constants/ApiConstants";
import { apiFetch } from "@/utils/apiFetch";

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

function jsonHeaders(): HeadersInit {
    return { "Content-Type": "application/json" };
}

/** Executes a SQL query against the local copy of the given connection's database. */
export async function executeQuery(request: IExecuteQueryRequest): Promise<IExecuteQueryResponse> {
    const response = await apiFetch(API_CONSTANTS.EXECUTE_QUERY, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as IExecuteQueryResponse;
}

export interface IAnalyseQueryResponse {
    executionPlan: string[];
    suggestedQuery: string | null;
    explanation: string | null;
    error: string | null;
}

/** Runs EXPLAIN ANALYZE and asks the AI to suggest an optimised version of the query. */
export async function analyseQuery(request: IExecuteQueryRequest & { intent?: string }): Promise<IAnalyseQueryResponse> {
    const response = await apiFetch(API_CONSTANTS.ANALYSE_QUERY, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as IAnalyseQueryResponse;
}

export interface IBenchmarkRequest {
    connectionId: string;
    originalSql: string;
    suggestedSql: string;
    /** Number of runs per query, averaged. Defaults to 3. */
    runs?: number;
}

export interface IBenchmarkResponse {
    originalAvgMs: number;
    suggestedAvgMs: number;
    improvementPercent: number;
    error: string | null;
}

/** Runs both the original and AI-suggested queries N times each and returns averaged timings. */
export async function benchmarkQuery(request: IBenchmarkRequest): Promise<IBenchmarkResponse> {
    const response = await apiFetch(API_CONSTANTS.BENCHMARK_QUERY, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as IBenchmarkResponse;
}

export interface ISchemaColumn {
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    maxLength: number | null;
    referencesTable: string | null;
    referencesColumn: string | null;
}

export interface ISchemaTableDetail {
    name: string;
    columns: ISchemaColumn[];
}

export interface ISchemaRelationship {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
}

export interface ISchemaWithRelationships {
    tables: ISchemaTableDetail[];
    relationships: ISchemaRelationship[];
}

export interface ITableRowCount {
    tableName: string;
    rowCount: number;
}

export interface IGenerateTestDataRequest {
    connectionId: string;
    tables: ITableRowCount[];
}

export interface IGenerateTestDataResponse {
    success: boolean;
    insertedCounts: Record<string, number>;
    error: string | null;
}

/** Fetches detailed schema (column types, PK/FK info) and FK relationships for a connection. */
export async function getSchemaWithRelationships(connectionId: string): Promise<ISchemaWithRelationships> {
    const url = `${API_CONSTANTS.GET_SCHEMA_WITH_RELATIONSHIPS}?connectionId=${encodeURIComponent(connectionId)}`;
    const response = await apiFetch(url);

    if (!response.ok) {
        throw new Error(`Schema fetch failed: ${response.status}`);
    }

    const json = await response.json();
    return json.result as ISchemaWithRelationships;
}

/** Generates and inserts AI-produced test data into the local schema-only database. */
export async function generateTestData(request: IGenerateTestDataRequest): Promise<IGenerateTestDataResponse> {
    const response = await apiFetch(API_CONSTANTS.GENERATE_TEST_DATA, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as IGenerateTestDataResponse;
}

/** Fetches the schema (tables + columns) for the local copy of the given connection's database. */
export async function getSchema(connectionId: string): Promise<ISchemaTable[]> {
    const url = `${API_CONSTANTS.GET_SCHEMA}?connectionId=${encodeURIComponent(connectionId)}`;
    const response = await apiFetch(url);

    if (!response.ok) {
        throw new Error(`Schema fetch failed: ${response.status}`);
    }

    const json = await response.json();
    return (json.result ?? []) as ISchemaTable[];
}
