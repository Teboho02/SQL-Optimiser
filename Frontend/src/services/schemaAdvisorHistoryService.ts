import { API_CONSTANTS } from "@/constants/ApiConstants";
import { apiFetch } from "@/utils/apiFetch";

export interface ISchemaAdvisorScanDto {
    id: string;
    databaseConnectionId: string;
    recommendationCount: number;
    recommendationsJson: string | null;
    errorMessage: string | null;
    creationTime: string;
}

export async function getAllScans(): Promise<ISchemaAdvisorScanDto[]> {
    const response = await apiFetch(API_CONSTANTS.GET_ALL_SCHEMA_SCANS);
    const json = await response.json();
    return (json.result ?? []) as ISchemaAdvisorScanDto[];
}

export async function getScansByConnection(connectionId: string): Promise<ISchemaAdvisorScanDto[]> {
    const response = await apiFetch(`${API_CONSTANTS.GET_SCHEMA_SCANS_BY_CONNECTION}?connectionId=${connectionId}`);
    const json = await response.json();
    return (json.result ?? []) as ISchemaAdvisorScanDto[];
}

export async function addScan(
    connectionId: string,
    recommendationCount: number,
    recommendationsJson: string | null,
    errorMessage: string | null,
): Promise<ISchemaAdvisorScanDto> {
    const response = await apiFetch(API_CONSTANTS.ADD_SCHEMA_SCAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    await apiFetch(`${API_CONSTANTS.DELETE_SCHEMA_SCAN}?scanId=${scanId}`, { method: "DELETE" });
}
