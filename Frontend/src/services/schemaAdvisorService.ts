import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

export interface ISchemaColumnDto {
    name: string;
    type: string;
    highlight?: "warning" | "new";
}

export interface ISchemaTableDefDto {
    label: string;
    variant: "current" | "new";
    columns: ISchemaColumnDto[];
}

export interface IMetricDto {
    label: string;
    before: string;
    after: string;
}

export interface IRecommendationDto {
    id: string;
    title: string;
    impact: "high" | "medium" | "low";
    description: string;
    estimatedDowntime: string;
    currentTable: ISchemaTableDefDto;
    newTables: ISchemaTableDefDto[];
    metrics: IMetricDto[];
}

export interface IScanSchemaOutput {
    recommendations: IRecommendationDto[];
    error: string | null;
}

export interface IGenerateMigrationOutput {
    migrationSql: string | null;
    efCoreMigration: string | null;
    rollbackSql: string | null;
    error: string | null;
}

export interface IApplyMigrationOutput {
    success: boolean;
    error: string | null;
}

export interface IBenchmarkQueryPair {
    description: string;
    originalQuery: string;
    adaptedQuery: string;
    /** "read" | "write" */
    queryType: string;
}

export interface IGetBenchmarkPlanOutput {
    benchmarkDdl: string | null;
    queryPairs: IBenchmarkQueryPair[];
    involvesIndexes: boolean;
    error: string | null;
}

export interface IQueryPairResult {
    description: string;
    originalQuery: string;
    adaptedQuery: string;
    queryType: string;
    originalAvgMs: number;
    adaptedAvgMs: number;
    originalRunsMs: number[];
    adaptedRunsMs: number[];
    improvementPercent: number;
    error: string | null;
}

export interface IBenchmarkRecommendationOutput {
    results: IQueryPairResult[];
    weightedImprovementPercent: number | null;
    error: string | null;
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenService.getToken()}`,
    };
}

/** Safely reads and parses a response body, returning null if the body is empty or not valid JSON. */
async function safeJson(response: Response): Promise<Record<string, unknown> | null> {
    const text = await response.text();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text) as Record<string, unknown>;
    } catch {
        return null;
    }
}

/** Scans the schema for the given connection and returns AI recommendations. */
export async function scanSchema(connectionId: string): Promise<IScanSchemaOutput> {
    const response = await fetch(API_CONSTANTS.SCAN_SCHEMA, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId }),
    });

    const json = await safeJson(response);

    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { recommendations: [], error: message };
    }

    return json?.result as IScanSchemaOutput;
}

/** Asks the AI to generate benchmark DDL and query pairs for the user to review. */
export async function getBenchmarkPlan(
    connectionId: string,
    recommendation: IRecommendationDto,
): Promise<IGetBenchmarkPlanOutput> {
    const response = await fetch(API_CONSTANTS.GET_BENCHMARK_PLAN, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId, recommendationJson: JSON.stringify(recommendation) }),
    });
    const json = await safeJson(response);
    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { benchmarkDdl: null, queryPairs: [], involvesIndexes: false, error: message };
    }
    return json?.result as IGetBenchmarkPlanOutput;
}

/** Runs the benchmark with user-confirmed query pairs and returns timing results + weighted score. */
export async function benchmarkRecommendation(
    connectionId: string,
    benchmarkDdl: string,
    queryPairs: IBenchmarkQueryPair[],
    readRatio: number,
    runs = 3,
): Promise<IBenchmarkRecommendationOutput> {
    const response = await fetch(API_CONSTANTS.BENCHMARK_RECOMMENDATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId, benchmarkDdl, queryPairs, readRatio, runs }),
    });
    const json = await safeJson(response);
    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { results: [], weightedImprovementPercent: null, error: message };
    }
    return json?.result as IBenchmarkRecommendationOutput;
}

/** Applies the provided migration SQL against the live database and stores a rollback plan in history. */
export async function applyMigration(
    connectionId: string,
    migrationSql: string,
    rollbackSql: string | null,
    recommendationTitle: string,
): Promise<IApplyMigrationOutput> {
    const response = await fetch(API_CONSTANTS.APPLY_MIGRATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId, migrationSql, rollbackSql, recommendationTitle }),
    });
    const json = await safeJson(response);
    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { success: false, error: message };
    }
    return json?.result as IApplyMigrationOutput;
}

/** Generates a PostgreSQL migration script and an EF Core migration class for the supplied recommendation. */
export async function generateMigration(connectionId: string, recommendation: IRecommendationDto): Promise<IGenerateMigrationOutput> {
    const response = await fetch(API_CONSTANTS.GENERATE_MIGRATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            connectionId,
            recommendationJson: JSON.stringify(recommendation),
        }),
    });

    const json = await safeJson(response);

    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { migrationSql: null, efCoreMigration: null, rollbackSql: null, error: message };
    }

    return json?.result as IGenerateMigrationOutput;
}
