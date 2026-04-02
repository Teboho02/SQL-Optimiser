import { API_CONSTANTS } from "@/constants/ApiConstants";

export interface IAuthenticateRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export interface IAuthenticateResponse {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
}

interface IAbpError {
    code: number;
    message: string;
    details: string | null;
}

interface IAbpResponse<T> {
    result: T;
    success: boolean;
    error: IAbpError | null;
}

/**
 * Authenticates a user against the ABP TokenAuth endpoint.
 * The backend sets an HttpOnly access_token cookie and a readable user_id cookie on success.
 */
export async function authenticate(request: IAuthenticateRequest): Promise<IAuthenticateResponse> {
    const response = await fetch(API_CONSTANTS.AUTHENTICATE, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Abp-TenantId": "1" },
        credentials: "include",
        body: JSON.stringify(request),
    });

    const data: IAbpResponse<IAuthenticateResponse> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Invalid username or password.");
    }

    return data.result;
}

/** Calls the backend logout endpoint, which clears the auth cookies server-side. */
export async function logout(): Promise<void> {
    await fetch(API_CONSTANTS.LOGOUT, {
        method: "POST",
        credentials: "include",
    });
}
