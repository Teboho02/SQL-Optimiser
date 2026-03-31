/** Base URL for all API calls.
 * Empty in production — nginx proxies /api/* to the backend.
 * Set NEXT_PUBLIC_API_URL in .env.local for local development.
 */
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

export const API_CONSTANTS = {
    AUTHENTICATE: `${API_BASE_URL}/api/TokenAuth/Authenticate`,
    TEST_CONNECTION: `${API_BASE_URL}/api/services/app/databaseConnection/testConnection`,
    SAVE_CONNECTION: `${API_BASE_URL}/api/services/app/databaseConnection/saveConnection`,
    GET_ALL_CONNECTIONS: `${API_BASE_URL}/api/services/app/databaseConnection/getAll`,
    UPDATE_CONNECTION_SETTINGS: `${API_BASE_URL}/api/services/app/databaseConnection/updateSettings`,
    TRIGGER_DUMP: `${API_BASE_URL}/api/services/app/databaseConnection/triggerDump`,
    TRIGGER_RESTORE: `${API_BASE_URL}/api/services/app/databaseConnection/triggerRestore`,
    EXECUTE_QUERY: `${API_BASE_URL}/api/services/app/queryExecution/execute`,
    GET_SCHEMA: `${API_BASE_URL}/api/services/app/queryExecution/getSchema`,
    ANALYSE_QUERY: `${API_BASE_URL}/api/services/app/queryExecution/analyse`,
    BENCHMARK_QUERY: `${API_BASE_URL}/api/services/app/queryExecution/benchmark`,
    SCAN_SCHEMA: `${API_BASE_URL}/api/services/app/schemaAdvisor/scanSchema`,
    GENERATE_MIGRATION: `${API_BASE_URL}/api/services/app/schemaAdvisor/generateMigration`,
    GET_BENCHMARK_PLAN: `${API_BASE_URL}/api/services/app/schemaAdvisor/getBenchmarkPlan`,
    BENCHMARK_RECOMMENDATION: `${API_BASE_URL}/api/services/app/schemaAdvisor/benchmarkRecommendation`,
    GET_ALL_QUERY_HISTORY: `${API_BASE_URL}/api/services/app/queryHistory/getAllQueryHistory`,
    GET_QUERY_HISTORY: `${API_BASE_URL}/api/services/app/queryHistory/getQueryHistoryByConnectionId`,
    ADD_QUERY_HISTORY: `${API_BASE_URL}/api/services/app/queryHistory/addQueryHistoryEntry`,
    DELETE_QUERY_HISTORY: `${API_BASE_URL}/api/services/app/queryHistory/deleteQueryHistoryEntry`,
};
