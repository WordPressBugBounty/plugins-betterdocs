import React from "react";
import { __, sprintf } from "@wordpress/i18n";
import { useQuery } from "@tanstack/react-query";

import { getApps, getConnection, getHealth } from "../utils/api";
import { formatDate, relativeTime, toMillis } from "../utils/format";
import { APPS_KEY } from "./ConnectedApps";
import { CONNECTION_KEY } from "./ConnectionConfig";
import { HEALTH_KEY } from "./ConnectionHealth";
import { IconClock, IconCode, IconGrid, IconPlug } from "./Icons";

/**
 * The four KPI tiles (ADR-062).
 *
 * Every value is read from a payload the page already fetches — the same three
 * React Query keys the sections below use, so this row costs no extra request:
 * an identical key and query function is served from the shared cache.
 *
 * **No sparklines and no delta chips.** The approved mock-up draws both, and
 * they are decoration over data that does not exist: the server keeps one
 * `last_used` stamp per credential and no history whatsoever, so a trend line
 * here could only be invented.
 *
 * @since 4.9.0
 */

/**
 * One tile. The accent arrives as custom properties so the stylesheet decides
 * what happens to it in dark mode, the way the client cards do (ADR-054).
 */
const Tile = ({ label, Icon, accent, accentDark, value, valueSm, note }) => (
    <div className="bda-kpi bd-mcp-kpi">
        <div className="bda-kpi-top">
            <span className="bda-kpi-label">{label}</span>
            <span
                className="bda-kpi-ico bd-mcp-kpi__ico"
                style={{
                    "--bd-accent": accent,
                    "--bd-accent-dark": accentDark || accent,
                    "--bd-accent-tint": `${accent}1a`,
                }}
            >
                <Icon size={14} />
            </span>
        </div>
        <div className="bda-kpi-row">
            <span className={`bda-kpi-value${valueSm ? " bd-mcp-kpi__value--sm" : ""}`}>{value}</span>
            {note && <span className="bd-mcp-kpi__note">{note}</span>}
        </div>
    </div>
);

/**
 * The analytics skeleton for a tile that is still waiting on its query
 * (`KpiSkeleton` in Pro's `analytics/components/common/ui.js`), so the row
 * arrives at its final height in one step instead of growing under the reader.
 */
const TileSkeleton = () => (
    <div className="bda-kpi bd-mcp-kpi">
        <div className="bda-skel" style={{ width: "50%", height: 10, marginBottom: 12 }} />
        <div className="bda-kpi-row">
            <div className="bda-skel" style={{ width: 120, height: 26 }} />
        </div>
    </div>
);

export default function KpiRow({ status }) {
    const connection = useQuery({ queryKey: [CONNECTION_KEY], queryFn: getConnection });
    const health = useQuery({ queryKey: [HEALTH_KEY], queryFn: getHealth });
    const apps = useQuery({ queryKey: [APPS_KEY], queryFn: getApps });

    const connectedAt = connection.data?.connected_at || null;
    const toolCount = health.data?.abilities?.betterdocs;
    const appRows = Array.isArray(apps.data?.oauth_apps) ? apps.data.oauth_apps : [];

    // The newest stamp anything holds: the connection token's own last use, and
    // each OAuth app's. There is no other record of activity on this server.
    // Compared as milliseconds, but carried forward in the shape it arrived in —
    // `relativeTime` does its own conversion, and handing it a value already in
    // milliseconds would multiply it by a thousand a second time.
    const lastActivity = [connection.data?.last_used, ...appRows.map((app) => app.last_used)]
        .map((value) => ({ value, ms: toMillis(value) }))
        .filter((stamp) => stamp.ms !== null)
        .reduce((newest, stamp) => (newest === null || stamp.ms > newest.ms ? stamp : newest), null);

    return (
        <div className="bda-kpi-grid bd-mcp-kpis">
            {connection.isLoading ? (
                <TileSkeleton />
            ) : (
                <Tile
                    label={__("Server status", "betterdocs")}
                    Icon={IconPlug}
                    accent="#00b884"
                    value={status.label}
                    valueSm
                    note={
                        connectedAt
                            ? sprintf(
                                  /* translators: %s: the date this site's connection was established. */
                                  __("since %s", "betterdocs"),
                                  formatDate(connectedAt),
                              )
                            : null
                    }
                />
            )}

            {health.isLoading || typeof toolCount !== "number" ? (
                <TileSkeleton />
            ) : (
                <Tile
                    label={__("Registered tools", "betterdocs")}
                    Icon={IconCode}
                    accent="#3b82f6"
                    accentDark="#60a5fa"
                    value={String(toolCount)}
                />
            )}

            {apps.isLoading ? (
                <TileSkeleton />
            ) : (
                <Tile
                    label={__("Connected apps", "betterdocs")}
                    Icon={IconGrid}
                    accent="#8b5cf6"
                    accentDark="#a78bfa"
                    value={String(appRows.length)}
                />
            )}

            {connection.isLoading || apps.isLoading ? (
                <TileSkeleton />
            ) : (
                <Tile
                    label={__("Last activity", "betterdocs")}
                    Icon={IconClock}
                    accent="#f59e0b"
                    accentDark="#fbbf24"
                    value={relativeTime(lastActivity ? lastActivity.value : null)}
                    valueSm
                />
            )}
        </div>
    );
}
