import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

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
    databaseType: number;
    lastSyncTime: string;
    dumpStatus: number;
    restoreStatus: number;
    localConnectionString: string | null;
    lastRestoreTime: string | null;
}

/** Fetches all saved database connections for the current tenant. */
export async function getDatabaseConnections(): Promise<IDatabaseConnectionDto[]> {
    const response = await fetch(API_CONSTANTS.GET_ALL_CONNECTIONS, {
        headers: {
            "Authorization": `Bearer ${tokenService.getToken()}`,
        },
    });

    const json = await response.json();
    return (json.result?.items ?? []) as IDatabaseConnectionDto[];
}

/** Calls the backend test-connection endpoint and returns the result. */
export async function testConnection(request: ITestConnectionRequest): Promise<ITestConnectionResponse> {
    const response = await fetch(API_CONSTANTS.TEST_CONNECTION, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenService.getToken()}`,
        },
        body: JSON.stringify(request),
    });

    const json = await response.json();
    return json.result as ITestConnectionResponse;
}
