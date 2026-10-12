import apiFetch from "@wordpress/api-fetch";

/**
 * Every call on this page goes through one place, so the nonce is attached
 * exactly once per request and the route prefix is written once. The MCP
 * management routes are `manage_options`-gated cookie-authenticated REST
 * routes — without the nonce WordPress treats the request as logged out and
 * answers 401, which is the failure mode this wrapper exists to prevent.
 */
const NS = () => window.betterdocs_admin?.mcp?.rest || "betterdocs/v1";

function withNonce() {
    apiFetch.use(apiFetch.createNonceMiddleware(window.betterdocs_admin?.nonce));
}

function request(path, options = {}) {
    withNonce();
    return apiFetch({ path: `${NS()}/${path}`, ...options });
}

export const getConnection = () => request("mcp/connection");
export const connect = (readOnly = false) =>
    request("mcp/connect", { method: "POST", data: { read_only: !!readOnly } });
export const rotate = (readOnly = null) =>
    request("mcp/rotate", {
        method: "POST",
        data: readOnly === null ? {} : { read_only: !!readOnly },
    });
export const disconnect = () => request("mcp/disconnect", { method: "POST" });

export const getApps = () => request("mcp/apps");
export const revokeApp = (clientId) =>
    request("mcp/apps/revoke", { method: "POST", data: { client_id: clientId } });

export const getHealth = () => request("mcp/health");
export const runSelfTest = () => request("mcp/self-test", { method: "POST" });

/**
 * The master switch writes through BetterDocs' own settings route, the same
 * one the Settings screen uses, so the value is normalised by `Settings` and
 * every other consumer sees it immediately.
 */
export const saveEnableMcp = (enabled) => {
    withNonce();
    return apiFetch({
        path: `${NS()}/settings`,
        method: "POST",
        data: { enable_mcp: !!enabled },
    });
};
