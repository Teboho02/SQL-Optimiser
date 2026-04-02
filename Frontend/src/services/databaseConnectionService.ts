import { API_CONSTANTS } from "@/constants/ApiConstants";
import { apiFetch } from "@/utils/apiFetch";

/** Maps backend DatabaseType enum index to a display name. */
export const DATABASE_ENGINE_NAMES: Record<number, string> = {
    0: "SQL Server",
    1: "MySQL",
    2: "PostgreSQL",
    3: "Oracle",
    4: "SQLite",
    5: "MongoDB",
};

/** Numeric values matching the backend DatabaseType enum. */
export const DATABASE_TYPE_MAP: Record<string, number> = {
    PostgreSQL: 2,
    MySQL: 1,
    MariaDB: 1,
    SQLite: 4,
};

export interface ITestConnectionRequest {
    dbHost: string;
    dbPort: number;
    dbUser: string;
    dbPassword: string;
    databaseName?: string;
    databaseType: number;
    requireSsl: boolean;
}

export interface ITestConnectionResponse {
    success: boolean;
    message: string;
}

/** Maps backend DumpStatus enum index to a display label. */
export const DUMP_STATUS_LABELS: Record<number, string> = {
    0: "No Dump",
    1: "Dump Pending",
    2: "Dumping",
    3: "Dumped",
    4: "Dump Failed",
};

/** Maps backend RestoreStatus enum index to a display label. */
export const RESTORE_STATUS_LABELS: Record<number, string> = {
    0: "Not Restored",
    1: "Restore Pending",
    2: "Restoring",
    3: "Restored",
    4: "Restore Failed",
};

export interface IDatabaseConnectionDto {
    id: string;
    name: string;
    dbHost: string;
    dbPort: number;
    dbUser: string;
    databaseName: string | null;
    databaseType: number;
    lastSyncTime: string;
    schemaOnly: boolean;
    dumpStatus: number;
    restoreStatus: number;
    localConnectionString: string | null;
    lastRestoreTime: string | null;
}

/** Fetches all saved database connections for the current tenant. */
export async function getDatabaseConnections(): Promise<IDatabaseConnectionDto[]> {
    const response = await apiFetch(API_CONSTANTS.GET_ALL_CONNECTIONS);
    const json = await response.json();
    return (json.result?.items ?? []) as IDatabaseConnectionDto[];
}

export interface IUpdateConnectionSettingsRequest {
    id: string;
    databaseName: string | undefined;
    schemaOnly: boolean;
}

/** Updates the DatabaseName and SchemaOnly settings of an existing connection. */
export async function updateConnectionSettings(request: IUpdateConnectionSettingsRequest): Promise<void> {
    const response = await apiFetch(API_CONSTANTS.UPDATE_CONNECTION_SETTINGS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error?.message ?? "Failed to update connection settings.");
    }
}

/** Manually triggers a fresh database dump for an existing connection. */
export async function triggerDump(connectionId: string): Promise<void> {
    const response = await apiFetch(`${API_CONSTANTS.TRIGGER_DUMP}?connectionId=${connectionId}`, {
        method: "POST",
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error?.message ?? "Failed to trigger dump.");
    }
}

/** Manually triggers a restore of the latest dump into the local server database. */
export async function triggerRestore(connectionId: string): Promise<void> {
    const response = await apiFetch(`${API_CONSTANTS.TRIGGER_RESTORE}?connectionId=${connectionId}`, {
        method: "POST",
    });

    if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error?.message ?? "Failed to trigger restore.");
    }
}

/** Calls the backend test-connection endpoint and returns the result. */
export async function testConnection(request: ITestConnectionRequest): Promise<ITestConnectionResponse> {
    const response = await apiFetch(API_CONSTANTS.TEST_CONNECTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as ITestConnectionResponse;
}
