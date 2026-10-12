// ===== write-with-ai/index.js — mounts the redesigned "Write with AI" modal =====
// Replaces the legacy inline PHP/jQuery template. Registers a hidden editor
// plugin that (a) injects the "Write with AI" button into the editor header and
// (b) renders the StudioGenerateModal via a portal.

import { __ } from "@wordpress/i18n";
import { registerPlugin } from "@wordpress/plugins";
import { useState, useEffect, useRef, createPortal } from "@wordpress/element";
import { subscribe } from "@wordpress/data";

import { AIMarkWhite } from "../ai-shared/kit";
import StudioGenerateModal from "./StudioGenerateModal";

// Header trigger button — styled with the shared kit tokens (wrapped in
// `.bd-ai-scope` because it is portaled into the WP editor header, outside the
// modal scope).
const HeaderButton = ({ onClick }) => (
    <span className="bd-ai-scope" style={{ display: "inline-flex", marginRight: 8 }}>
        <button type="button" onClick={onClick} className="bd-write-with-ai-button" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--green)", color: "#fff", border: "none",
            height: 36, padding: "0 14px", borderRadius: 8, cursor: "pointer",
            fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
            boxShadow: "0 1px 0 rgba(0,0,0,.04), inset 0 -1px 0 rgba(0,0,0,.06)",
            transition: "background .15s",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--green-600)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--green)"; }}>
            <span style={{ display: "flex" }}><AIMarkWhite size={16} /></span>
            {__("Write with AI", "betterdocs")}
        </button>
    </span>
);

const findHeaderNode = () =>
    document.querySelector(".edit-post-header__settings") ||
    document.querySelector(".editor-header__settings");

const WriteWithAIApp = () => {
    const [open, setOpen] = useState(false);
    const [host, setHost] = useState(null);
    const hostRef = useRef(null);
    const headerRef = useRef(null);

    // Watch the editor chrome until the header settings area exists, then mount
    // the button there. We render into our own host node and PREPEND it (first
    // child) so it sits beside the Git Sync button — matching master, where the
    // legacy jQuery did `$('.…-header__settings').prepend(bdAIButton)`. A plain
    // portal would append (far right) instead.
    useEffect(() => {
        let mounted = true;
        if (!hostRef.current) {
            const node = document.createElement("span");
            // `betterdocs-ai-button-container` is the anchor Pro's Git Sync looks
            // for: it inserts its button at `aiContainer.nextSibling`, so this
            // node ends up directly to the LEFT of the Git Sync button (master
            // parity — the legacy free button used the same wrapper class).
            node.className = "betterdocs-ai-button-container bd-write-with-ai-host";
            hostRef.current = node;
        }
        const sync = () => {
            const header = findHeaderNode();
            if (!header || header === headerRef.current) return;
            headerRef.current = header;
            header.prepend(hostRef.current);
            if (mounted && !host) setHost(hostRef.current);
        };
        sync();
        const unsubscribe = subscribe(() => { window.requestAnimationFrame(sync); });
        return () => { mounted = false; unsubscribe(); };
    }, [host]);

    return (
        <>
            {host && createPortal(<HeaderButton onClick={() => setOpen(true)} />, host)}
            <StudioGenerateModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};

// Registered unconditionally — the render slot (PluginArea) only mounts inside
// the block editor, so this is inert on the classic editor. The bundle itself is
// enqueued by PHP only on the `docs` editor screen.
registerPlugin("betterdocs-write-with-ai", { render: WriteWithAIApp });
