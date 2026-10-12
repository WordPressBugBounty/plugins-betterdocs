import React, { useState } from "react";
import { __, _n, sprintf } from "@wordpress/i18n";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getHealth, runSelfTest } from "../utils/api";
import { IconPlay, IconRefresh } from "./Icons";

// Exported so the master switch can invalidate this query too: the card mounts
// when the switch goes on (ADR-058), and the report it shows then must describe
// the server as it is now, not as it was while it refused every connection.
export const HEALTH_KEY = "bd-mcp-health";

// Stages that mean "some clients can't connect", not "nothing works". A client
// holding the connection token is fine through all of these; only clients that
// connect by URL alone are affected, so they read as a warning rather than a
// failure.
const WARN_STAGES = ["tls", "redirect", "no_tools", "rewrite", "discovery", "challenge", "ua_filter"];

const testVariant = (result) => {
    if (!result) return "info";
    if (result.ok) return "success";
    return WARN_STAGES.includes(result.stage) ? "warning" : "error";
};

const Row = ({ label, tone, badge, detail }) => (
    <div className="bd-mcp-health__row">
        <div className="bd-mcp-health__text">
            <span className="bd-mcp-health__label">{label}</span>
            {detail && <span className="bd-mcp-health__detail">{detail}</span>}
        </div>
        <span className={`bda-badge ${tone}`}>{badge}</span>
    </div>
);

/**
 * The first URL problem worth naming, most damaging first. A site can have more
 * than one of these at once, and telling someone about the REST scheme while
 * they are still on plain HTTP is not help.
 */
const describeUrls = (urls) => {
    if (!urls.is_https) {
        return __("This site is served over HTTP. Most AI clients refuse to connect to anything but HTTPS.", "betterdocs");
    }
    if (!urls.home_siteurl_match) {
        return __("Site Address and WordPress Address use different schemes, so requests can bounce between HTTP and HTTPS.", "betterdocs");
    }
    if (!urls.rest_matches_home) {
        return __("The REST API URL uses a different scheme from the site address, which redirects MCP requests.", "betterdocs");
    }
    return __("HTTPS is on and every WordPress URL agrees.", "betterdocs");
};

/**
 * Who provides the Abilities API, and what that means for the tool catalog.
 */
const describeOwner = (owner, version) => {
    if (owner === "none") {
        return __("No Abilities API is available, so no tools can be offered to an AI client.", "betterdocs");
    }
    if (owner === "foreign") {
        return __("Another plugin is providing the Abilities API. BetterDocs registers into it, but the version it ships governs.", "betterdocs");
    }
    if (owner === "bundled") {
        return sprintf(
            /* translators: %s: the bundled abilities-api package version. */
            __("Provided by the runtime bundled with BetterDocs (%s).", "betterdocs"),
            version || __("unknown version", "betterdocs"),
        );
    }
    return sprintf(
        /* translators: %s: the WordPress version providing the Abilities API. */
        __("Provided by WordPress %s.", "betterdocs"),
        version || __("(unknown version)", "betterdocs"),
    );
};

const ownerTone = (owner) => {
    if (owner === "none") return "red";
    if (owner === "foreign") return "amber";
    return "green";
};

const OWNER_LABELS = {
    core: __("WordPress core", "betterdocs"),
    bundled: __("BetterDocs (bundled)", "betterdocs"),
    foreign: __("Another plugin", "betterdocs"),
    none: __("Nobody", "betterdocs"),
};

export default function ConnectionHealth() {
    const [result, setResult] = useState(null);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: [HEALTH_KEY],
        queryFn: getHealth,
    });

    const test = useMutation({
        mutationFn: runSelfTest,
        onSuccess: (res) => {
            setResult(res);
            refetch();
        },
        onError: () =>
            setResult({
                ok: false,
                stage: "unreachable",
                message: __("The test request itself failed. Reload the page and try again.", "betterdocs"),
                checks: [],
            }),
    });

    if (isLoading) {
        return (
            <div className="bda-card">
                <div className="bda-card-body">
                    <p className="bd-mcp-muted">{__("Checking connection health…", "betterdocs")}</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bda-card">
                <div className="bda-card-body">
                    <div className="bd-mcp-alert is-error">
                        {__("Couldn't load the health report. Reload the page and try again.", "betterdocs")}
                    </div>
                </div>
            </div>
        );
    }

    const { urls, abilities, runtime, capabilities, database, plugin, mcp } = data;

    const urlsOk = urls.is_https && urls.home_siteurl_match && urls.rest_matches_home;
    const urlsDetail = describeUrls(urls);

    const owner = runtime?.abilities_api?.source || "none";
    const toolCount = abilities?.betterdocs || 0;
    const missing = Array.isArray(capabilities?.missing) ? capabilities.missing : [];
    const dbOk = !!database?.up_to_date && (!database.pro || database.pro.up_to_date);
    const proState = plugin?.pro?.state || "pro_not_installed";
    const proLabels = {
        ok: __("Pro active", "betterdocs"),
        pro_unlicensed: __("Pro active, unlicensed", "betterdocs"),
        pro_active_setting_off: __("Pro active", "betterdocs"),
        pro_not_active: __("Pro inactive", "betterdocs"),
        pro_not_installed: __("Free only", "betterdocs"),
    };

    return (
        <div className="bda-card bd-mcp-health">
            <div className="bda-card-head bd-mcp-cardhead">
                <div>
                    <h3 className="bda-card-title">{__("Connection health", "betterdocs")}</h3>
                    <p className="bd-mcp-muted">
                        {__(
                            "What an AI client finds when it reaches this site. Test connection makes the real round trip from this server and names the first step that fails.",
                            "betterdocs",
                        )}
                    </p>
                </div>
                {/* This card only renders while the switch is on (ADR-058), so
                    both buttons are simply available: there is no longer a state
                    in which Test connection could only report "MCP is off". */}
                <div className="bd-mcp-actions">
                    <button type="button" className="bda-btn ghost sm" onClick={() => refetch()} disabled={isFetching}>
                        <IconRefresh />
                        {__("Re-check", "betterdocs")}
                    </button>
                    <button
                        type="button"
                        className="bda-btn primary sm"
                        onClick={() => test.mutate()}
                        disabled={test.isLoading}
                    >
                        <IconPlay />
                        {test.isLoading ? __("Testing…", "betterdocs") : __("Test connection", "betterdocs")}
                    </button>
                </div>
            </div>

            <div className="bda-card-body">
                {result && <div className={`bd-mcp-alert is-${testVariant(result)}`}>{result.message}</div>}

                {Array.isArray(result?.caveats) &&
                    result.caveats.map((caveat) => (
                        <div key={caveat.slice(0, 60)} className="bd-mcp-alert is-warning">
                            {caveat}
                        </div>
                    ))}

                {Array.isArray(result?.checks) && result.checks.length > 0 && (
                    <ul className="bd-mcp-checks">
                        {result.checks.map((check) => (
                            <li key={check.id} className="bd-mcp-checks__item">
                                <span
                                    aria-hidden="true"
                                    className={check.ok ? "bd-mcp-checks__ok" : "bd-mcp-checks__warn"}
                                >
                                    {check.ok ? "✓" : "!"}
                                </span>
                                <span>
                                    <strong>{check.label}</strong>
                                    {" — "}
                                    {check.detail}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="bd-mcp-health__list">
                    <Row
                        label={__("Secure connection", "betterdocs")}
                        tone={urlsOk ? "green" : "amber"}
                        badge={urlsOk ? __("OK", "betterdocs") : __("Check", "betterdocs")}
                        detail={urlsDetail}
                    />
                    <Row
                        label={__("Abilities API", "betterdocs")}
                        tone={ownerTone(owner)}
                        badge={OWNER_LABELS[owner] || owner}
                        detail={describeOwner(owner, runtime?.abilities_api?.version)}
                    />
                    <Row
                        label={__("Registered tools", "betterdocs")}
                        tone={toolCount > 0 ? "green" : "amber"}
                        badge={String(toolCount)}
                        detail={
                            toolCount > 0
                                ? sprintf(
                                      /* translators: %d: number of registered BetterDocs tools. */
                                      _n(
                                          "%d BetterDocs tool is registered and offered to connected clients.",
                                          "%d BetterDocs tools are registered and offered to connected clients.",
                                          toolCount,
                                          "betterdocs",
                                      ),
                                      toolCount,
                                  )
                                : __("No BetterDocs tools are registered, so a client would connect and find nothing to call.", "betterdocs")
                        }
                    />
                    <Row
                        label={__("Your capabilities", "betterdocs")}
                        tone={missing.length === 0 ? "green" : "amber"}
                        badge={
                            missing.length === 0
                                ? __("Complete", "betterdocs")
                                : sprintf(
                                      /* translators: %d: number of missing capabilities. */
                                      __("%d missing", "betterdocs"),
                                      missing.length,
                                  )
                        }
                        detail={
                            missing.length === 0
                                ? __("You hold every BetterDocs capability, so no tool will refuse you.", "betterdocs")
                                : sprintf(
                                      /* translators: %s: comma-separated capability names. */
                                      __("Tools needing these will refuse you: %s.", "betterdocs"),
                                      missing.join(", "),
                                  )
                        }
                    />
                    <Row
                        label={__("Database", "betterdocs")}
                        tone={dbOk ? "green" : "amber"}
                        badge={dbOk ? __("Up to date", "betterdocs") : __("Update due", "betterdocs")}
                        detail={
                            dbOk
                                ? sprintf(
                                      /* translators: %s: database schema version. */
                                      __("Schema v%s installed.", "betterdocs"),
                                      String(database?.installed_version || "?"),
                                  )
                                : __("A database update is pending. Reload the admin so it can run.", "betterdocs")
                        }
                    />
                    <Row
                        label={__("BetterDocs", "betterdocs")}
                        tone="slate"
                        badge={String(plugin?.free_version || "")}
                        detail={proLabels[proState] || proState}
                    />
                    {typeof mcp?.lockouts === "number" && mcp.lockouts > 0 && (
                        <Row
                            label={__("Client lockouts", "betterdocs")}
                            tone="amber"
                            badge={String(mcp.lockouts)}
                            detail={__(
                                "One or more client addresses are locked out after repeated failed authentications — usually a client still holding a rotated-away token. While a lockout holds, that address is refused even with a valid token. It clears itself within 15 minutes of the retries stopping.",
                                "betterdocs",
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
