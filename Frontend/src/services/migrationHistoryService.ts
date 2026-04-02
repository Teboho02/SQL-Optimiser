import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

export type MigrationStatus = "Applied" | "RolledBack";

export interface IMigrationHistoryDto {
    id: string;
    connectionId: string;
    connectionName: string;
    recommendationTitle: string;
    migrationSql: string;
    rollbackSql: string;
    status: number; // 0 = Applied, 1 = RolledBack
    rolledBackAt: string | null;
    creationTime: string;
}

export interface IRollbackMigrationOutput {
    success: boolean;
    error: string | null;
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenService.getToken()}`,
    };
}

async function safeJson(response: Response): Promise<Record<string, unknown> | null> {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export async function getAllMigrationHistory(): Promise<IMigrationHistoryDto[]> {
    const response = await fetch(API_CONSTANTS.GET_MIGRATION_HISTORY, {
        method: "GET",
        headers: authHeaders(),
    });
    const json = await safeJson(response);
    if (!response.ok) return [];
    return (json?.result as IMigrationHistoryDto[]) ?? [];
}

export async function rollbackMigration(migrationHistoryId: string): Promise<IRollbackMigrationOutput> {
    const response = await fetch(API_CONSTANTS.ROLLBACK_MIGRATION, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ migrationHistoryId }),
    });
    const json = await safeJson(response);
    if (!response.ok) {
        const message = (json?.error as { message?: string })?.message ?? `Request failed with status ${response.status}`;
        return { success: false, error: message };
    }
    return json?.result as IRollbackMigrationOutput;
}
