import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

export interface ISchemaColumnDto {
    name: string;
    type: string;
    highlight?: "warning" | "new" | null;
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
    error: string | null;
}

export interface IQueryPairResult {
    description: string;
    originalQuery: string;
    adaptedQuery: string;
    originalAvgMs: number;
    adaptedAvgMs: number;
    improvementPercent: number;
    error: string | null;
}

export interface IBenchmarkRecommendationOutput {
    results: IQueryPairResult[];
    error: string | null;
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenService.getToken()}`,
    };
}

/** Scans the schema for the given connection and returns AI recommendations. */
export async function scanSchema(connectionId: string): Promise<IScanSchemaOutput> {
    const response = await fetch(API_CONSTANTS.SCAN_SCHEMA, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ connectionId }),
    });

    const json = await response.json();

    if (!response.ok) {
        const message = json?.error?.message ?? `Request failed with status ${response.status}`;
        return { recommendations: [], error: message };
    }

    return json.result as IScanSchemaOutput;
}

/** AI-generates query pairs, applies the schema change in a transaction, benchmarks both, then rolls back. */
export async function benchmarkRecommendation(
    connectionId: string,
    recommendation: IRecommendationDto,
    runs = 3,
): Promise<IBenchmarkRecommendationOutput> {
    const response = await fetch(API_CONSTANTS.BENCHMARK_RECOMMENDATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            connectionId,
            recommendationJson: JSON.stringify(recommendation),
            runs,
        }),
    });

    const json = await response.json();

    if (!response.ok) {
        const message = json?.error?.message ?? `Request failed with status ${response.status}`;
        return { results: [], error: message };
    }

    return json.result as IBenchmarkRecommendationOutput;
}

/** Generates a PostgreSQL migration script for the supplied recommendation. */
export async function generateMigration(connectionId: string, recommendation: IRecommendationDto): Promise<IGenerateMigrationOutput> {
    const response = await fetch(API_CONSTANTS.GENERATE_MIGRATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            connectionId,
            recommendationJson: JSON.stringify(recommendation),
        }),
    });

    const json = await response.json();

    if (!response.ok) {
        const message = json?.error?.message ?? `Request failed with status ${response.status}`;
        return { migrationSql: null, error: message };
    }

    return json.result as IGenerateMigrationOutput;
}
