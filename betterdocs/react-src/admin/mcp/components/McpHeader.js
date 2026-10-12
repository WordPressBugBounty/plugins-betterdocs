import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { __ } from "@wordpress/i18n";

import DarkModeToggle from "../../components/DarkModeToggle";
import { IconMcp } from "./Icons";

/**
 * The MCP screen's own header row, portalled into the admin shell's header the
 * way the Analytics route does it (`analytics/components/Chrome.js`).
 *
 * The page needs the title, the status badge and the master switch on one row
 * (ADR-062), and the switch reads state this component's parent owns — so the
 * row cannot be built out of the shell's `betterdocs_admin_header_title` /
 * `_action_icons` filters, which are registered in `Routes.js`, outside this
 * tree. `Header.js` therefore skips its default row for `betterdocs-mcp` and
 * this row takes its place, carrying the dark-mode switcher across with it:
 * that switcher is the only global control on the screen, and dropping the
 * shell row without re-rendering it is what U12b refused to do.
 *
 * @since 4.9.0
 */
const HOST_SELECTOR = ".betterdocs-dashboard-header > .betterdocs-dashboard-container";

export default function McpHeader({ status, enabled, saving, onToggle }) {
    const [host, setHost] = useState(null);

    useEffect(() => {
        const target = document.querySelector(HOST_SELECTOR);
        if (!target) {
            return undefined;
        }
        const node = document.createElement("div");
        // `bd-mcp-header-host` also carries the `--bda-*` alias block, because
        // this row renders outside `.bd-mcp-wrapper` and the badge inside it is
        // a `bda-badge` — which Pro's admin-wide `analytics.css` redefines in
        // terms of variables it only declares on its own root (U12b).
        node.className = "bd-mcp-header-host";
        target.appendChild(node);
        setHost(node);
        return () => {
            node.remove();
        };
    }, []);

    if (!host) {
        return null;
    }

    return createPortal(
        <div className="betterdocs-row bd-mcp-header">
            <div className="betterdocs-col betterdocs-header-left betterdocs-col-xs-6 bd-mcp-header__left">
                <span className="bd-mcp-header__tile">
                    <IconMcp size={20} />
                </span>
                <h2 className="betterdocs-dashboard-header-title bd-mcp-header__title">
                    {__("MCP", "betterdocs")}
                </h2>
                <span className={`bda-badge ${status.tone}`}>{status.label}</span>
            </div>
            <div className="betterdocs-col betterdocs-header-right betterdocs-col-xs-6 betterdocs-d-flex betterdocs-justify-end bd-mcp-header__right">
                {saving && <span className="bd-mcp-muted">{__("Saving…", "betterdocs")}</span>}
                <label className="bd-mcp-switch" htmlFor="betterdocs-enable-mcp">
                    <span className="bd-mcp-switch__label">{__("Enable MCP access", "betterdocs")}</span>
                    <input
                        id="betterdocs-enable-mcp"
                        type="checkbox"
                        checked={enabled}
                        onChange={onToggle}
                        disabled={saving}
                    />
                    <span className="bd-mcp-switch__track" aria-hidden="true">
                        <span className="bd-mcp-switch__thumb" />
                    </span>
                </label>
                <ul className="betterdocs-dashboard-header-action-list betterdocs-text-align-right">
                    <li>
                        <DarkModeToggle />
                    </li>
                </ul>
            </div>
        </div>,
        host,
    );
}
