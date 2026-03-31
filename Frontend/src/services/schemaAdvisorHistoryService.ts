import { API_CONSTANTS } from "@/constants/ApiConstants";
import { tokenService } from "./tokenService";

export interface ISchemaAdvisorScanDto {
    id: string;
    databaseConnectionId: string;
    recommendationCount: number;
    recommendationsJson: string | null;
    errorMessage: string | null;
    creationTime: string;
}

function authHeaders(): HeadersInit {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenService.getToken()}`,
    };
}

export async function getAllScans(): Promise<ISchemaAdvisorScanDto[]> {
    const response = await fetch(API_CONSTANTS.GET_ALL_SCHEMA_SCANS, {
        headers: authHeaders(),
    });
    const json = await response.json();
    return (json.result ?? []) as ISchemaAdvisorScanDto[];
}

export async function getScansByConnection(connectionId: string): Promise<ISchemaAdvisorScanDto[]> {
    const response = await fetch(
        `${API_CONSTANTS.GET_SCHEMA_SCANS_BY_CONNECTION}?connectionId=${connectionId}`,
        { headers: authHeaders() },
    );
    const json = await response.json();
    return (json.result ?? []) as ISchemaAdvisorScanDto[];
}

export async function addScan(
    connectionId: string,
    recommendationCount: number,
    recommendationsJson: string | null,
    errorMessage: string | null,
): Promise<ISchemaAdvisorScanDto> {
    const response = await fetch(API_CONSTANTS.ADD_SCHEMA_SCAN, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            databaseConnectionId: connectionId,
            recommendationCount,
            recommendationsJson,
            errorMessage,
        }),
    });
    const json = await response.json();
    return json.result as ISchemaAdvisorScanDto;
}

export async function deleteScan(scanId: string): Promise<void> {
    await fetch(`${API_CONSTANTS.DELETE_SCHEMA_SCAN}?scanId=${scanId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
}
