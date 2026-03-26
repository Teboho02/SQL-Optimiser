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

/** Authenticates a user against the ABP TokenAuth endpoint and returns the JWT result. */
export async function authenticate(request: IAuthenticateRequest): Promise<IAuthenticateResponse> {
    const response = await fetch(API_CONSTANTS.AUTHENTICATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });

    const data: IAbpResponse<IAuthenticateResponse> = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Invalid username or password.");
    }

    return data.result;
}
