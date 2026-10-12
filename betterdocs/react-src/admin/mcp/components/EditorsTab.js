import React, { useRef, useState } from "react";
import { __, sprintf } from "@wordpress/i18n";

import CopyField from "./CopyField";
import { IconClaude, IconCode, IconCursor, IconExternal, IconInfo, IconPlug, IconSpark } from "./Icons";

/**
 * The "Editors & CLI" tab: a rail of five clients on the left, one detail panel
 * on the right.
 *
 * It replaces an earlier two-column grid of five cards. Those cards had
 * wildly different natural heights — a deep-link button next to a twelve-line
 * prompt — so the grid stretched the short ones to the tallest in their row and
 * left the fifth alone in a half-empty one (ADR-057). A picker shows one client
 * at a time, which is all anyone needs: nobody sets up five editors at once.
 *
 * The OAuth tab is untouched and still lives in `ConnectionConfig.js`; its two
 * cards are the same height and the grid suits them.
 */

// The green this plugin's design tokens call `--base-color-700`. Written out
// because the accents are inline custom properties, not stylesheet values.
const BD_GREEN = "#00b884";

// UTF-8 safe base64: btoa() throws on multi-byte characters, and a site title
// or token is not guaranteed to be ASCII.
const toBase64 = (str) => {
    try {
        return window.btoa(
            encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))),
        );
    } catch (e) {
        return "";
    }
};

/**
 * The accent tile. The brand colour arrives as a custom property so the
 * stylesheet — not this component — decides what happens to it in dark mode,
 * where Cursor's near-black would otherwise vanish (ADR-054).
 *
 * `solid` marks a tile whose glyph is a vendor's own logo file rather than one
 * of ours: it draws a plain white chip with a hairline border, so the logo keeps
 * its own colour (ADR-066). Only the clients on this rail that carry somebody
 * else's logo use it — VS Code, the JSON block and the prompt wear our own
 * glyphs and keep the tint.
 */
const Tile = ({ Icon, accent, accentDark, accentFgDark, solid, size = 36 }) => (
    <span
        className={`bd-mcp-tile bd-mcp-tile--${size}${solid ? " is-solid" : ""}`}
        style={{
            "--bd-accent": accent,
            "--bd-accent-dark": accentDark || accent,
            ...(accentFgDark ? { "--bd-accent-fg-dark": accentFgDark } : {}),
            "--bd-accent-tint": `${accent}24`,
        }}
    >
        <Icon size={size === 28 ? 15 : 18} />
    </span>
);

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
 * One client's payload, in whichever of the two shapes it has: a copyable
 * value, or a deep link with a line saying where it goes.
 */
const Payload = ({ payload }) =>
    payload.href ? (
        <div className="bd-mcp-detail__pay">
            <a className="bda-btn primary bd-mcp-detail__cta" href={payload.href}>
                {payload.cta}
                <IconExternal size={14} />
            </a>
            {payload.hint && <p className="bd-mcp-detail__hint">{payload.hint}</p>}
        </div>
    ) : (
        <div className="bd-mcp-detail__pay">
            <CopyField
                label={payload.label}
                value={payload.value}
                multiline={!!payload.multiline}
                help={payload.help}
            />
        </div>
    );

export default function EditorsTab({ data }) {
    const railRef = useRef(null);
    const [selected, setSelected] = useState("claude-code");
    // Per client, and deliberately not remembered: switching client is the
    // moment to re-offer the safe path, not to carry a token choice across.
    const [mode, setMode] = useState("browser");

    const pick = (id) => {
        setSelected(id);
        setMode("browser");
    };

    const endpoint = data.mcp_endpoint || "";
    const endpointRest = data.mcp_endpoint_rest || "";
    const token = data.connection_token || "";

    // Every browser-mode payload carries no credential: the endpoint answers an
    // unauthenticated call with `401` + `WWW-Authenticate: Bearer
    // resource_metadata=…`, which is the challenge that starts the OAuth flow,
    // and this server accepts dynamic client registration with loopback
    // redirect URIs (ADR-054). The token variants are built beside them for the
    // machine that has no browser to open.
    const oauthEntry = { url: endpoint };
    const tokenEntry = { url: endpoint, headers: { Authorization: `Bearer ${token}` } };

    const cursorLink = (entry) =>
        `cursor://anysphere.cursor-deeplink/mcp/install?name=betterdocs&config=${encodeURIComponent(toBase64(JSON.stringify(entry)))}`;
    const vscodeLink = (entry) =>
        `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "betterdocs", type: "http", ...entry }))}`;

    const mcpServersBlock = (entry) => JSON.stringify({ mcpServers: { betterdocs: entry } }, null, 2);

    // Built here rather than server-side: `MCPPairing::config_snippets()` exists
    // to carry the token, and a string with no secret in it needs no round trip.
    const claudeCodeOauth = `claude mcp add --transport http betterdocs ${endpoint}`;

    const jsonHelp = endpointRest
        ? sprintf(
              /* translators: %s: the REST fallback endpoint URL. */
              __(
                  "Paste into any client that takes a JSON MCP config. If pretty permalinks are off, use %s as the url.",
                  "betterdocs",
              ),
              endpointRest,
          )
        : __("Paste into any client that takes a JSON MCP config.", "betterdocs");

    // Steps shared between the two modes, so the pair can only differ where it
    // is meant to: the browser flow has an approval step the token flow does not.
    const RUN = __("Copy the command above and run it in your terminal.", "betterdocs");
    const STATUS = __("Ask Claude to call bd-get-status to confirm the connection.", "betterdocs");
    const JSON_COPY = __("Copy the block above into the client's MCP configuration file.", "betterdocs");
    const JSON_RESTART = __("Restart the client so it reads the new server.", "betterdocs");
    const ASK_COPY = __("Copy the prompt above.", "betterdocs");
    const ASK_PASTE = __("Paste it into an assistant that can edit its own MCP configuration.", "betterdocs");

    const clients = [
        {
            id: "claude-code",
            name: "Claude Code",
            badge: __("CLI", "betterdocs"),
            // Claude Code is Anthropic's, so it wears Anthropic's mark on
            // Anthropic's tile — the generic sparkle at Claude's terracotta was
            // the "tinted glyph where the app icon belongs" this unit removes.
            Icon: IconClaude,
            accent: "#d97757",
            solid: true,
            desc: __("Add the server from your terminal, approve once in the browser.", "betterdocs"),
            browser: {
                label: __("Command", "betterdocs"),
                value: claudeCodeOauth,
                steps: [
                    RUN,
                    __(
                        "Run /mcp in Claude Code and choose BetterDocs — your browser opens this site's approval screen; sign in and approve.",
                        "betterdocs",
                    ),
                    STATUS,
                ],
            },
            token: {
                label: __("Command", "betterdocs"),
                value: data.config?.cli || "",
                multiline: true,
                steps: [RUN, STATUS],
            },
        },
        {
            id: "cursor",
            name: "Cursor",
            badge: __("Editor", "betterdocs"),
            Icon: IconCursor,
            accent: "#0f172a",
            // Near-black on a dark card is invisible, so the solid tile inverts
            // there: light square, near-black arrow.
            accentDark: "#cbd5e1",
            accentFgDark: "#0f172a",
            solid: true,
            desc: __("One click opens Cursor with BetterDocs prefilled.", "betterdocs"),
            browser: {
                href: cursorLink(oauthEntry),
                cta: __("Add to Cursor", "betterdocs"),
                hint: __("Opens cursor://… with the server URL.", "betterdocs"),
                steps: [
                    __('Click "Add to Cursor". It opens Cursor with BetterDocs prefilled.', "betterdocs"),
                    __("Confirm the install when Cursor asks.", "betterdocs"),
                    __("Approve the connection in the browser Cursor opens for this site's sign-in.", "betterdocs"),
                ],
            },
            token: {
                href: cursorLink(tokenEntry),
                cta: __("Add to Cursor", "betterdocs"),
                hint: __("Opens cursor://… with the server URL and the token.", "betterdocs"),
                steps: [
                    __('Click "Add to Cursor". It opens Cursor with BetterDocs prefilled.', "betterdocs"),
                    __("Confirm the install when Cursor asks.", "betterdocs"),
                ],
            },
        },
        {
            id: "vscode",
            name: "VS Code",
            badge: __("Editor", "betterdocs"),
            Icon: IconCode,
            accent: "#0098ff",
            accentDark: "#4db8ff",
            desc: __("One click opens VS Code with BetterDocs prefilled.", "betterdocs"),
            browser: {
                href: vscodeLink(oauthEntry),
                cta: __("Add to VS Code", "betterdocs"),
                hint: __("Opens vscode:mcp/install… with the server URL.", "betterdocs"),
                steps: [
                    __('Click "Add to VS Code". It opens VS Code with BetterDocs prefilled.', "betterdocs"),
                    __("Confirm the install when VS Code asks.", "betterdocs"),
                    __("Approve the connection in the browser VS Code opens for this site's sign-in.", "betterdocs"),
                ],
            },
            token: {
                href: vscodeLink(tokenEntry),
                cta: __("Add to VS Code", "betterdocs"),
                hint: __("Opens vscode:mcp/install… with the server URL and the token.", "betterdocs"),
                steps: [
                    __('Click "Add to VS Code". It opens VS Code with BetterDocs prefilled.', "betterdocs"),
                    __("Confirm the install when VS Code asks.", "betterdocs"),
                ],
            },
        },
        {
            id: "json",
            name: __("Claude Desktop & JSON clients", "betterdocs"),
            badge: __("JSON", "betterdocs"),
            badgeTone: "green",
            Icon: IconPlug,
            accent: BD_GREEN,
            desc: __("Paste a block into any client that takes a JSON MCP config.", "betterdocs"),
            browser: {
                label: __("mcpServers block", "betterdocs"),
                value: mcpServersBlock(oauthEntry),
                multiline: true,
                help: jsonHelp,
                steps: [
                    JSON_COPY,
                    JSON_RESTART,
                    __("Approve the connection in the browser it opens for this site's sign-in.", "betterdocs"),
                ],
            },
            token: {
                label: __("mcpServers block", "betterdocs"),
                value: data.config?.json || "",
                multiline: true,
                help: jsonHelp,
                steps: [JSON_COPY, JSON_RESTART],
            },
        },
        {
            id: "prompt",
            name: __("Ask your AI to set it up", "betterdocs"),
            badge: __("Prompt", "betterdocs"),
            badgeTone: "green",
            Icon: IconSpark,
            accent: BD_GREEN,
            desc: __("Paste a prompt and the assistant adds the connection itself.", "betterdocs"),
            browser: {
                label: __("Prompt", "betterdocs"),
                value: data.ai_prompt || "",
                multiline: true,
                help: __(
                    "It carries no credential — the assistant is sent here to sign in.",
                    "betterdocs",
                ),
                steps: [
                    ASK_COPY,
                    ASK_PASTE,
                    __("Approve the connection in the browser it opens, then ask it to call bd-get-status.", "betterdocs"),
                ],
            },
            token: {
                label: __("Prompt", "betterdocs"),
                value: data.ai_prompt_token || "",
                multiline: true,
                steps: [ASK_COPY, ASK_PASTE, STATUS],
            },
        },
    ];

    const current = clients.find((c) => c.id === selected) || clients[0];
    const payload = current[mode];

    // Roving focus over the rail, the way a `tablist` is meant to behave: the
    // selected item is the only tab stop, and the arrows move the selection.
    // The handler sits on the tabs rather than the list, because the tabs are
    // what hold focus — a `tablist` that is itself focusable would put a second,
    // useless stop in the page's tab order.
    const onRailKeyDown = (event) => {
        const index = clients.findIndex((c) => c.id === selected);
        let next = null;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            next = (index + 1) % clients.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            next = (index - 1 + clients.length) % clients.length;
        } else if (event.key === "Home") {
            next = 0;
        } else if (event.key === "End") {
            next = clients.length - 1;
        }

        if (next === null) return;

        event.preventDefault();
        pick(clients[next].id);
        const button = railRef.current?.querySelector(`[data-client="${clients[next].id}"]`);
        if (button) button.focus();
    };

    return (
        <div className="bd-mcp-split">
            <div
                ref={railRef}
                className="bd-mcp-rail"
                role="tablist"
                aria-orientation="vertical"
                aria-label={__("Pick your tool", "betterdocs")}
            >
                <span className="bd-mcp-rail__label">{__("Pick your tool", "betterdocs")}</span>
                {clients.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        role="tab"
                        data-client={c.id}
                        aria-selected={selected === c.id}
                        aria-controls="bd-mcp-detail"
                        tabIndex={selected === c.id ? 0 : -1}
                        className={`bd-mcp-rail__item${selected === c.id ? " is-selected" : ""}`}
                        onClick={() => pick(c.id)}
                        onKeyDown={onRailKeyDown}
                    >
                        <Tile
                            Icon={c.Icon}
                            accent={c.accent}
                            accentDark={c.accentDark}
                            accentFgDark={c.accentFgDark}
                            solid={c.solid}
                            size={28}
                        />
                        <span className="bd-mcp-rail__name">{c.name}</span>
                        <span className={`bda-badge ${c.badgeTone || "slate"}`}>{c.badge}</span>
                    </button>
                ))}
            </div>

            <div className="bd-mcp-detail" id="bd-mcp-detail" role="tabpanel" tabIndex={-1}>
                <div className="bd-mcp-detail__head">
                    <Tile
                        Icon={current.Icon}
                        accent={current.accent}
                        accentDark={current.accentDark}
                        accentFgDark={current.accentFgDark}
                        solid={current.solid}
                        size={36}
                    />
                    <div className="bd-mcp-detail__headtext">
                        <span className="bd-mcp-detail__name">
                            {current.name}
                            <span className={`bda-badge ${current.badgeTone || "slate"}`}>{current.badge}</span>
                        </span>
                        <span className="bd-mcp-detail__desc">{current.desc}</span>
                    </div>
                </div>

                <div className="bd-mcp-seg" role="group" aria-label={__("How this client signs in", "betterdocs")}>
                    <button
                        type="button"
                        className={`bd-mcp-seg__btn${mode === "browser" ? " is-active" : ""}`}
                        aria-pressed={mode === "browser"}
                        onClick={() => setMode("browser")}
                    >
                        {__("Sign in in your browser", "betterdocs")}
                        <small>{__("· Recommended", "betterdocs")}</small>
                    </button>
                    <button
                        type="button"
                        className={`bd-mcp-seg__btn${mode === "token" ? " is-active" : ""}`}
                        aria-pressed={mode === "token"}
                        onClick={() => setMode("token")}
                    >
                        {__("Use the connection token", "betterdocs")}
                    </button>
                </div>

                {mode === "token" && (
                    <p className="bd-mcp-warn">
                        <IconInfo size={14} />
                        {__(
                            "This carries your site's connection token. Only for a machine with no browser.",
                            "betterdocs",
                        )}
                    </p>
                )}

                <Payload payload={payload} />

                <span className="bd-mcp-detail__label">{__("How to", "betterdocs")}</span>
                <Steps steps={payload.steps} />
            </div>
        </div>
    );
}
