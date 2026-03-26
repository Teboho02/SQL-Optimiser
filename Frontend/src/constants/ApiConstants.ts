/** Base URL for all API calls.
 * Empty in production — nginx proxies /api/* to the backend.
 * Set NEXT_PUBLIC_API_URL in .env.local for local development.
 */
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_CONSTANTS = {
    AUTHENTICATE: `${API_BASE_URL}/api/TokenAuth/Authenticate`,
};
