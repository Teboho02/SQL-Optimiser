const TOKEN_KEY = "access_token";
const USER_ID_KEY = "user_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function setCookie(name: string, value: string): void {
    if (typeof document === "undefined") return;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Strict${secure}`;
}

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

/** Manages JWT token persistence in cookies. */
export const tokenService = {
    setToken(token: string): void {
        setCookie(TOKEN_KEY, token);
    },

    getToken(): string | null {
        return getCookie(TOKEN_KEY);
    },

    setUserId(userId: number): void {
        setCookie(USER_ID_KEY, String(userId));
    },

    getUserId(): number | null {
        const value = getCookie(USER_ID_KEY);
        return value ? Number(value) : null;
    },

    isAuthenticated(): boolean {
        return !!getCookie(TOKEN_KEY);
    },

    clear(): void {
        deleteCookie(TOKEN_KEY);
        deleteCookie(USER_ID_KEY);
    },
};
