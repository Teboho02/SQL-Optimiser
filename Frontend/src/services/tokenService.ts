const TOKEN_KEY = "access_token";
const USER_ID_KEY = "user_id";

/** Manages JWT token persistence in localStorage. */
export const tokenService = {
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    setUserId(userId: number): void {
        localStorage.setItem(USER_ID_KEY, String(userId));
    },

    getUserId(): number | null {
        const value = localStorage.getItem(USER_ID_KEY);
        return value ? Number(value) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    clear(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
    },
};
