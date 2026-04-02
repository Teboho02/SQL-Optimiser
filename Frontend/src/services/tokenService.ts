const USER_ID_KEY = "user_id";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
}

/**
 * Provides auth-state helpers for the frontend.
 * The access token itself is stored in an HttpOnly cookie managed by the backend
 * and is never readable by JavaScript. The non-HttpOnly user_id cookie is used
 * solely to detect whether a session is active.
 */
export const tokenService = {
    getUserId(): number | null {
        const value = getCookie(USER_ID_KEY);
        return value ? Number(value) : null;
    },

    /** Returns true when the backend-set user_id cookie is present, indicating an active session. */
    isAuthenticated(): boolean {
        return !!getCookie(USER_ID_KEY);
    },

    /** Clears the readable user_id cookie. Call after the backend logout endpoint clears the HttpOnly token cookie. */
    clear(): void {
        deleteCookie(USER_ID_KEY);
    },
};
