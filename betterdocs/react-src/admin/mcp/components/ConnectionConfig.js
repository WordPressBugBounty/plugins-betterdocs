import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// `connect` and `disconnect` stay in `utils/api` — they are API the driver and
// the read-only pairing path use (ADR-038/ADR-056) — but the page no longer
// calls them: the token is minted for it on the first status read.
import { getConnection, rotate } from "../utils/api";
import CopyField from "./CopyField";
import EditorsTab from "./EditorsTab";
import { IconChatGpt, IconClaude, IconExternal } from "./Icons";

export const CONNECTION_KEY = "bd-mcp-connection";

const LEARN_MORE_MCP = "https://modelcontextprotocol.io/docs/concepts/transports";
const LEARN_MORE_CHATGPT = "https://developers.openai.com/apps-sdk/deploy/connect-chatgpt";

const TABS = [
    { id: "auth", label: __("OAuth", "betterdocs") },
    { id: "others", label: __("Editors & CLI", "betterdocs") },
];

const Steps = ({ steps }) => (
    <ol className="bd-mcp-steps">
        {steps.map((step, i) => (
            <li key={step} className="bd-mcp-steps__item">
                <span className="bd-mcp-steps__num">{i + 1}</span>
                <span>{step}</span>
            </li>
        ))}
    </ol>
);

/**
 * The icon square. The brand accent arrives as a custom property so the
 * stylesheet — not this component — decides what happens to it in dark mode,
 * where ChatGPT's black and Cursor's near-black would otherwise vanish.
 *
 * `solid` marks a tile whose glyph is a vendor's own logo file rather than one
 * of ours. It draws a plain white chip with a hairline border, so the logo keeps
 * its own colour and every tile in the row gets one treatment (ADR-066). That
 * chip stays light in dark mode too — a terracotta logo on a near-black square
 * is unreadable.
 */
const CardHead = ({ Icon, accent, accentDark, accentFgDark, tint, solid, name, badge, badgeTone, sub }) => (
    <div className="bd-mcp-card__head">
        <span
            className={`bd-mcp-card__icon${solid ? " is-solid" : ""}`}
            style={{
                "--bd-accent": accent,
                "--bd-accent-dark": accentDark || accent,
                ...(accentFgDark ? { "--bd-accent-fg-dark": accentFgDark } : {}),
                "--bd-accent-tint": tint || `${accent}14`,
            }}
        >
            <Icon />
        </span>
        <div className="bd-mcp-card__headtext">
            <span className="bd-mcp-card__title">
                {name}
                {badge && <span className={`bda-badge ${badgeTone || "slate"}`}>{badge}</span>}
            </span>
            {sub && <span className="bd-mcp-card__sub">{sub}</span>}
        </div>
    </div>
);

const AuthConnectorCard = ({ connector, endpoint }) => (
    <div className="bda-card bd-mcp-card">
        <CardHead
            Icon={connector.Icon}
            accent={connector.accent}
            accentDark={connector.accentDark}
            accentFgDark={connector.accentFgDark}
            solid={connector.solid}
            name={connector.name}
            badge={__("OAuth", "betterdocs")}
            badgeTone="green"
            sub={__("Signs in with a one-time approval. No token to paste.", "betterdocs")}
        />

        <CopyField label={__("Connector URL", "betterdocs")} value={endpoint} />
        <Steps steps={connector.steps} />

        {connector.learnMore && (
            <a
                className="bd-mcp-link"
                href={connector.learnMore}
                target="_blank"
                rel="noopener noreferrer"
            >
                {__("How to add a connector", "betterdocs")}
                <IconExternal size={11} />
            </a>
        )}
    </div>
);

export default function ConnectionConfig() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState("auth");

    const { data, isLoading, isError } = useQuery({
        queryKey: [CONNECTION_KEY],
        queryFn: getConnection,
    });

    const refresh = (next) => {
        if (next) queryClient.setQueryData([CONNECTION_KEY], (prev) => ({ ...prev, ...next }));
        queryClient.invalidateQueries({ queryKey: [CONNECTION_KEY] });
    };

    const rotateMutation = useMutation({
        mutationFn: () => rotate(null),
        onSuccess: (next) => {
            refresh(next);
            toast.success(__("Connection token rotated. Reconnect your clients with the new one.", "betterdocs"));
        },
        onError: () => toast.error(__("Couldn't rotate the connection token.", "betterdocs")),
    });

    const confirmRotate = () =>
        Swal.fire({
            title: __("Rotate the connection token?", "betterdocs"),
            text: __(
                "A new token is generated immediately. Every client using the old one — Claude Code, Cursor, VS Code, Claude Desktop — stops working until you give it the new command. Apps connected through OAuth are unaffected.",
                "betterdocs",
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: __("Rotate token", "betterdocs"),
            cancelButtonText: __("Cancel", "betterdocs"),
            confirmButtonColor: "#00b884",
        }).then((r) => r.isConfirmed && rotateMutation.mutate());

    // The card head: the section's title and its "how it works" line on the
    // left, the two tabs as the analytics segmented control on the right
    // (ADR-062). The tabs only make sense once there is something to tab
    // between, so the loading and error states below render the head alone.
    const head = (withTabs) => (
        <div className="bda-card-head bd-mcp-cardhead">
            <div>
                <h3 className="bda-card-title">{__("Add BetterDocs to your client", "betterdocs")}</h3>
                <p className="bd-mcp-muted">
                    {__("Pick your assistant below — it opens or copies fully configured.", "betterdocs")}{" "}
                    <a className="bd-mcp-link" href={LEARN_MORE_MCP} target="_blank" rel="noopener noreferrer">
                        {__("How it works", "betterdocs")}
                        <IconExternal size={11} />
                    </a>
                </p>
            </div>
            {withTabs && (
                <div className="bda-segtabs bd-mcp-tabs" role="tablist">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.id}
                            className={`bda-segtab${tab === t.id ? " active" : ""}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    // The token is minted by `GET /mcp/connection` itself (ADR-056), so the only
    // states this section has are "asking" and "here it is".
    if (isLoading) {
        return (
            <div className="bda-card bd-mcp-connect">
                {head(false)}
                <div className="bda-card-body">
                    <p className="bd-mcp-muted">{__("Preparing your connection…", "betterdocs")}</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bda-card bd-mcp-connect">
                {head(false)}
                <div className="bda-card-body">
                    <div className="bd-mcp-alert is-error">
                        {__("Couldn't load the MCP connection status.", "betterdocs")}
                    </div>
                </div>
            </div>
        );
    }

    const endpoint = data.mcp_endpoint || "";
    const busy = rotateMutation.isLoading;

    // A connected site whose stored token cannot be decrypted — the salt-rotation
    // case. The pairing still authenticates the clients that already have it, so
    // the honest answer is "rotate", not "you are not connected".
    if (!data.token_available) {
        return (
            <div className="bda-card bd-mcp-connect">
                {head(false)}
                <div className="bda-card-body">
                    <div className="bd-mcp-alert is-warning">
                        <strong>{__("The stored copy of your connection token can't be read.", "betterdocs")}</strong>{" "}
                        {__(
                            "This happens when the WordPress security salts change. Clients you already connected keep working — but to see or share the token again you have to rotate it, which disconnects them.",
                            "betterdocs",
                        )}
                        <div className="bd-mcp-actions">
                            <button type="button" className="bda-btn primary sm" onClick={confirmRotate} disabled={busy}>
                                {__("Rotate token", "betterdocs")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // The two connector assistants. Both need the endpoint URL and nothing
    // else — they sign in through the browser — so this tab has never had a
    // token on it, and the picker redesign left it untouched (ADR-057).
    const authConnectors = [
        {
            id: "claude",
            name: __("Claude (web, mobile & desktop)", "betterdocs"),
            Icon: IconClaude,
            accent: "#d97757",
            solid: true,
            steps: [
                __("In Claude, open Settings → Connectors → Add Connector → Add custom connector.", "betterdocs"),
                __("Paste the connector URL above and give it a name (e.g. BetterDocs).", "betterdocs"),
                __("Click Add, then approve access when Claude asks you to sign in.", "betterdocs"),
            ],
        },
        {
            id: "chatgpt",
            name: "ChatGPT",
            Icon: IconChatGpt,
            accent: "#000000",
            // A solid black square vanishes on a dark card, so in dark mode the
            // tile inverts: near-white square, near-black logomark — which is
            // how OpenAI's own icon renders on a dark surface.
            accentDark: "#e5e9f2",
            accentFgDark: "#101828",
            solid: true,
            learnMore: LEARN_MORE_CHATGPT,
            steps: [
                __("In ChatGPT, open Settings → Connectors → Add New.", "betterdocs"),
                __("Enter a name (e.g. BetterDocs).", "betterdocs"),
                __("Paste the connector URL above.", "betterdocs"),
                __("Save, then approve access when ChatGPT asks you to sign in.", "betterdocs"),
            ],
        },
    ];

    return (
        <div className="bda-card bd-mcp-connect">
            {head(true)}

            <div className="bda-card-body">
                <div className="bd-mcp-tabpanel">
                    {tab === "auth" && (
                        <div className="bd-mcp-grid">
                            {authConnectors.map((c) => (
                                <AuthConnectorCard key={c.id} connector={c} endpoint={endpoint} />
                            ))}
                        </div>
                    )}

                    {tab === "others" && <EditorsTab data={data} />}
                </div>
            </div>

            {/* The card's footer row, below both panels (ADR-062). It used to
                sit inside the Editors & CLI tab, because only those clients use
                the connection token (ADR-057) — but as a card footer it reads as
                a property of the whole card rather than of whichever tab is
                open, and its own last clause ("browser sign-ins are unaffected")
                is addressed to the reader of the OAuth tab. */}
            <div className="bd-mcp-reset">
                <p className="bd-mcp-reset__text">
                    {__(
                        "Rotate the connection token if it may have leaked. Clients that use the token will need the new one; browser sign-ins are unaffected.",
                        "betterdocs",
                    )}
                </p>
                <div className="bd-mcp-actions">
                    <button type="button" className="bda-btn ghost sm" onClick={confirmRotate} disabled={busy}>
                        {rotateMutation.isLoading ? __("Rotating…", "betterdocs") : __("Rotate token", "betterdocs")}
                    </button>
                </div>
            </div>
        </div>
    );
}
