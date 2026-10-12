import React from "react";
import { __, sprintf } from "@wordpress/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getApps, revokeApp } from "../utils/api";
import { formatDate } from "../utils/format";
import { IconPlug, IconRefresh, IconTrash } from "./Icons";

// Exported so the KPI row can read the same cache rather than fetch the app
// list a second time (ADR-062).
export const APPS_KEY = "bd-mcp-apps";

/**
 * The callback host is the one field of an OAuth registration an attacker
 * cannot fake — anyone may register a client called "Claude" (RFC 7591 dynamic
 * registration is open by design), but the callback is where the grant actually
 * sends access. It is the same field the consent screen flags, shown here for
 * the grants that already exist.
 */
const callbackHost = (app) => {
    const uri = Array.isArray(app.redirect_uris) && app.redirect_uris.length ? app.redirect_uris[0] : "";
    if (!uri) return "";
    try {
        const url = new URL(uri);
        return url.host || uri;
    } catch (e) {
        return uri;
    }
};

export default function ConnectedApps() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: [APPS_KEY],
        queryFn: getApps,
    });

    const revoke = useMutation({
        mutationFn: (clientId) => revokeApp(clientId),
        onSuccess: (next) => {
            queryClient.setQueryData([APPS_KEY], next);
            queryClient.invalidateQueries({ queryKey: [APPS_KEY] });
            toast.success(__("Access revoked.", "betterdocs"));
        },
        onError: () => toast.error(__("Couldn't revoke that connection.", "betterdocs")),
    });

    const confirmRevoke = (app) =>
        Swal.fire({
            title: __("Revoke this app?", "betterdocs"),
            text: sprintf(
                /* translators: %s: the connected app's name. */
                __("“%s” loses access immediately and has to be approved again to reconnect.", "betterdocs"),
                app.name || "",
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Revoke", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            confirmButtonColor: "#d92d20",
        }).then((r) => r.isConfirmed && revoke.mutate(app.client_id));

    const apps = Array.isArray(data?.oauth_apps) ? data.oauth_apps : [];
    const hasRows = !isLoading && !isError && apps.length > 0;

    return (
        <div className="bda-card bd-mcp-apps">
            <div className="bda-card-head bd-mcp-cardhead">
                <div>
                    <h3 className="bda-card-title">{__("Connected apps", "betterdocs")}</h3>
                    <p className="bd-mcp-muted">
                        {__(
                            "Apps that signed in through OAuth. Each one acts as the person who approved it, and revoking cuts it off at once. Clients using the connection token are not listed here — rotate the token to cut those off.",
                            "betterdocs",
                        )}
                    </p>
                </div>
                <button type="button" className="bda-btn ghost sm" onClick={() => refetch()} disabled={isFetching}>
                    <IconRefresh />
                    {__("Refresh", "betterdocs")}
                </button>
            </div>

            {/* The table brings its own head band and row padding (the shared
                `bda-table` rules), so it sits in a flush body and spans the
                card; the loading, error and empty states keep the padded one. */}
            {!hasRows && (
                <div className="bda-card-body">
                    {isLoading && <p className="bd-mcp-muted">{__("Loading connected apps…", "betterdocs")}</p>}

                    {!isLoading && isError && (
                        <div className="bd-mcp-alert is-error">
                            {__("Couldn't load connected apps. Reload the page and try again.", "betterdocs")}
                        </div>
                    )}

                    {!isLoading && !isError && apps.length === 0 && (
                        <div className="bd-mcp-empty">
                            <span className="bd-mcp-empty__icon">
                                <IconPlug size={24} />
                            </span>
                            <h4 className="bd-mcp-empty__title">{__("No apps connected yet", "betterdocs")}</h4>
                            <p className="bd-mcp-empty__text">
                                {__("When someone approves an AI client on the consent screen, it appears here.", "betterdocs")}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {hasRows && (
                <div className="bda-card-body flush">
                    <div className="bd-mcp-tablewrap">
                        <table className="bda-table bd-mcp-table">
                            <thead>
                                <tr>
                                    <th>{__("App", "betterdocs")}</th>
                                    <th>{__("Sends access to", "betterdocs")}</th>
                                    <th>{__("Approved by", "betterdocs")}</th>
                                    <th>{__("Approved", "betterdocs")}</th>
                                    <th>{__("Last used", "betterdocs")}</th>
                                    <th>{__("Access", "betterdocs")}</th>
                                    <th className="bda-t-right">{__("Actions", "betterdocs")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app) => (
                                    <tr key={app.client_id} className="row-hover">
                                        <td className="bda-strong">{app.name}</td>
                                        <td>
                                            <code className="bd-mcp-host">{callbackHost(app) || __("—", "betterdocs")}</code>
                                        </td>
                                        <td>
                                            {app.user_login ||
                                                sprintf(
                                                    /* translators: %d: WordPress user id, shown when the user no longer exists. */
                                                    __("User #%d", "betterdocs"),
                                                    app.user_id,
                                                )}
                                        </td>
                                        <td>{formatDate(app.created)}</td>
                                        <td>{formatDate(app.last_used)}</td>
                                        <td>
                                            <span className={`bda-badge ${app.read_only ? "amber" : "green"}`}>
                                                {app.read_only ? __("Read-only", "betterdocs") : __("Read & write", "betterdocs")}
                                            </span>
                                        </td>
                                        <td className="bda-t-right">
                                            <button
                                                type="button"
                                                className="bda-btn ghost sm bd-mcp-danger"
                                                onClick={() => confirmRevoke(app)}
                                                disabled={revoke.isLoading}
                                                aria-label={sprintf(
                                                    /* translators: %s: the connected app's name. */
                                                    __("Revoke %s", "betterdocs"),
                                                    app.name || "",
                                                )}
                                            >
                                                <IconTrash />
                                                {__("Revoke", "betterdocs")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

