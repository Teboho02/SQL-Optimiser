/**
 * Thin wrapper around fetch that always includes credentials so the browser
 * sends the HttpOnly auth cookie with every request. All authenticated API
 * calls must use this instead of calling fetch directly.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, {
        ...options,
        credentials: "include",
    });
}
