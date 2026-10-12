import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

import ConnectedApps from "./components/ConnectedApps";
import ConnectionConfig, { CONNECTION_KEY } from "./components/ConnectionConfig";
import ConnectionHealth, { HEALTH_KEY } from "./components/ConnectionHealth";
import KpiRow from "./components/KpiRow";
import McpHeader from "./components/McpHeader";
import { IconChevron, IconCheck } from "./components/Icons";
import { saveEnableMcp } from "./utils/api";

import "../analytics/scss/dashboard.scss";
import "./mcp.scss";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

/**
 * What a connected agent can reach once the tool catalog is complete. Written
 * out rather than derived from `tools/list`, for the same reason the consent
 * screen's promise list is (ADR-039): this is what someone is deciding about,
 * and it must read the same on a site whose tools are still landing.
 */
const CAPABILITIES = [
    __("Create, update and delete docs", "betterdocs"),
    __("Organise doc categories, tags and knowledge bases", "betterdocs"),
    __("Write and attach FAQs and FAQ groups", "betterdocs"),
    __("Read and change BetterDocs settings", "betterdocs"),
    __("Read documentation analytics", "betterdocs"),
];

function McpPage() {
    const bootstrap = window.betterdocs_admin?.mcp || {};
    const runtimeReady = !!bootstrap.abilities_api_available;
    const queryClientRef = useQueryClient();

    const [enabled, setEnabled] = useState(!!bootstrap.enabled);
    const [saving, setSaving] = useState(false);
    const [showCapabilities, setShowCapabilities] = useState(false);

    // The toggle saves immediately — there is no Save button on this page. Flip
    // optimistically so the sections below appear at once, and roll back if the
    // write fails, so the switch never claims a state the server does not hold.
    const toggle = async () => {
        const next = !enabled;
        setEnabled(next);
        setSaving(true);
        try {
            await saveEnableMcp(next);
            queryClientRef.invalidateQueries({ queryKey: [CONNECTION_KEY] });
            // Switching on mounts the health card for the first time; switching
            // off unmounts it. Invalidating here means the report it shows on
            // the way back in is fetched fresh rather than served from a cache
            // taken while the server was refusing everything.
            queryClientRef.invalidateQueries({ queryKey: [HEALTH_KEY] });
            toast.success(
                next
                    ? __("MCP is on. Connect an AI client below.", "betterdocs")
                    : __("MCP is off. AI clients can no longer connect.", "betterdocs"),
            );
        } catch (e) {
            setEnabled(!next);
            toast.error(__("Couldn't save that. Check your permissions and try again.", "betterdocs"));
        } finally {
            setSaving(false);
        }
    };

    // Three states, not two: MCP switched on without a working runtime is a
    // site that accepts connections and serves nothing, which the badge has to
    // distinguish from a healthy one.
    let status = { tone: "slate", label: __("Off", "betterdocs") };
    if (enabled && runtimeReady) {
        status = { tone: "green", label: __("Active", "betterdocs") };
    } else if (enabled) {
        status = { tone: "amber", label: __("Setup needed", "betterdocs") };
    }

    return (
        <>
            {/* Title, status badge and the master switch, portalled into the
                admin shell's header row (ADR-062). `Header.js` skips its own
                row for this screen, so "MCP" is printed exactly once. */}
            <McpHeader status={status} enabled={enabled} saving={saving} onToggle={toggle} />

            <div className="bd-mcp">
                {/* The intro strip: one muted line of the description, with the
                    capability disclosure inline beside it. Open it and the line
                    wraps in full and the list appears — the same text and the
                    same five items the hero card carried, in the height a
                    dashboard header deserves. This is the whole of the page
                    while the switch is off (ADR-058). */}
                <div className={`bda-card bd-mcp-intro${showCapabilities ? " is-open" : ""}`}>
                    <div className="bd-mcp-intro__row">
                        <p className="bd-mcp-intro__desc">
                            {__(
                                "Let AI assistants such as Claude, ChatGPT and Cursor read and write your documentation directly, over the Model Context Protocol. Access runs through a revocable connection token or a one-time OAuth approval, and every action is performed as the person who granted it — nothing an assistant does exceeds that account's own permissions. Switch this off and BetterDocs refuses every AI connection.",
                                "betterdocs",
                            )}
                        </p>
                        <button
                            type="button"
                            className="bd-mcp-intro__more"
                            onClick={() => setShowCapabilities((v) => !v)}
                            aria-expanded={showCapabilities}
                            aria-controls="bd-mcp-capabilities"
                        >
                            {__("What a connected assistant can do", "betterdocs")}
                            <IconChevron open={showCapabilities} />
                        </button>
                    </div>

                    {showCapabilities && (
                        <ul id="bd-mcp-capabilities" className="bd-mcp-caps">
                            <li className="bd-mcp-caps__note">
                                {__(
                                    "Every action honours the capabilities of the account that approved the connection, and every change is an ordinary revision you can review or undo.",
                                    "betterdocs",
                                )}
                            </li>
                            {CAPABILITIES.map((item) => (
                                <li key={item} className="bd-mcp-caps__item">
                                    <span className="bd-mcp-caps__check">
                                        <IconCheck />
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {enabled && !runtimeReady && (
                    <div className="bd-mcp-alert is-warning">
                        <strong>{__("The MCP runtime did not load.", "betterdocs")}</strong>{" "}
                        {__(
                            "The Abilities API is not available, so BetterDocs can offer no tools — an AI client would connect and find nothing to call. This normally means the plugin package is incomplete (dependencies/vendor is missing). Reinstall BetterDocs from wordpress.org or an official build.",
                            "betterdocs",
                        )}
                    </div>
                )}

                {/* Part of the "on" content, like the three sections below it:
                    with the switch off every tile would describe a server that
                    is refusing every connection (ADR-058). */}
                {enabled && <KpiRow status={status} />}

                {enabled && <ConnectionConfig />}

                {enabled && runtimeReady && <ConnectedApps />}

                {/* Gated on the switch like the sections above it, and like the
                    template (`BL/dev_betterlinks/pages/MCP.js`: `{savedMcp && …}`).
                    With MCP off this card has nothing to report — every row would
                    describe a server that is refusing every connection — so the page
                    is the intro strip alone (ADR-058). */}
                {enabled && <ConnectionHealth />}
            </div>
        </>
    );
}

const Mcp = () => (
    <div className="betterdocs-dashboard-body betterdocs-dashboard-container bd-mcp-wrapper">
        <QueryClientProvider client={queryClient}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
                limit={4}
            />
            <McpPage />
        </QueryClientProvider>
    </div>
);

export default Mcp;
