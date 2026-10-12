import React from "react";
import { useState, useEffect } from "@wordpress/element";
import { IconCheck, IconArrowRight, Sparkle } from "../../sample-docs/icons";
import { setLayoutPick } from "./layoutStore";

/* Quick Setup "Customize" field — interactive layout picker.
   Replaces the old Customizer.gif. Reads window.betterdocsCustomizeLayouts
   (groups with preview thumbnails + current theme_mod values). Selections are
   kept locally + in the shared store; they're persisted as theme_mods on
   Finish (Launch), not on click. */

const cfg = () => (typeof window !== "undefined" && window.betterdocsCustomizeLayouts) || {};

function LayoutGroup({ group }) {
    const [selected, setSelected] = useState(group.current);
    const cols = group.cols || 4;

    // Seed the shared store with the current value so Finish can save it.
    useEffect(() => {
        setLayoutPick(group.key, group.current);
    }, []);

    const choose = (value) => {
        if (value === selected) return;
        setSelected(value);
        setLayoutPick(group.key, value);
    };

    return (
        <section className="betterdocs-sd-layout-group">
            <div className="betterdocs-sd-layout-group-head">
                <h2 className="betterdocs-sd-layout-group-title">{group.title}</h2>
                {group.hint && <span className="betterdocs-sd-layout-group-hint">{group.hint}</span>}
            </div>
            <div
                className="betterdocs-sd-layout-grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    maxWidth: cols <= 3 ? 760 : undefined,
                }}
            >
                {group.options.map((opt) => (
                    <button
                        type="button"
                        key={opt.value}
                        className={`betterdocs-sd-layout-card${opt.value === selected ? " is-selected" : ""}`}
                        onClick={() => choose(opt.value)}
                        aria-pressed={opt.value === selected}
                    >
                        <span className="betterdocs-sd-layout-thumb">
                            <img src={opt.image} alt={opt.label} loading="lazy" />
                            {opt.value === selected && (
                                <span className="betterdocs-sd-layout-check">
                                    <IconCheck size={14} sw={3} />
                                </span>
                            )}
                        </span>
                        <span className="betterdocs-sd-layout-name">{opt.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

/* Block (FSE) themes don't read the Customizer theme_mods the picker writes, so the
   layout options are dead controls there. In their place, hand off to the Site Editor:
   copy on the left, preview on the right, one primary action. Built from the same card
   language as the Create Content step's AI banner (.betterdocs-sd-promo) so the wizard
   reads as one flow. Classic themes never see this. */
function FseHandoff({ fse }) {
    const features = Array.isArray(fse.features) ? fse.features : [];

    return (
        <div className="betterdocs-sd-fse">
            <div className="betterdocs-sd-fse-body">
                {/* The wizard's existing pill (same one the AI badge uses) — no bespoke variant. */}
                {fse.eyebrow && (
                    <span className="betterdocs-sd-badge">
                        <Sparkle size={14} /> {fse.eyebrow}
                    </span>
                )}
                <h2 className="betterdocs-sd-fse-title">{fse.title}</h2>
                <p className="betterdocs-sd-fse-text">{fse.description}</p>

                {features.length > 0 && (
                    <ul className="betterdocs-sd-fse-list">
                        {features.map((item) => (
                            <li key={item}>
                                <span className="betterdocs-sd-fse-tick">
                                    <IconCheck size={12} sw={3} />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}

                {fse.url && (
                    <div className="betterdocs-sd-fse-action">
                        {/* New tab: the wizard is mid-flow, and navigating away would lose it. */}
                        <a
                            className="betterdocs-sd-fse-button"
                            href={fse.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {fse.button} <IconArrowRight size={15} />
                        </a>
                        {fse.note && <span className="betterdocs-sd-fse-note">{fse.note}</span>}
                    </div>
                )}
            </div>

            {fse.image && (
                <div className="betterdocs-sd-fse-preview">
                    <img src={fse.image} alt="" loading="lazy" />
                </div>
            )}
        </div>
    );
}

function LayoutCustomizer(props) {
    const { groups, is_fse: isFse, fse } = cfg();

    // The FSE hand-off is its own card, so it does NOT go inside .betterdocs-sd-layouts
    // (that's the picker's frame — nesting produced a box inside a box).
    if (isFse && fse) {
        return <FseHandoff fse={fse} />;
    }

    if (!groups) {
        return null;
    }

    return (
        <div className={`betterdocs-sd-layouts ${props?.classes || ""}`}>
            {Object.keys(groups).map((key) => (
                <LayoutGroup key={key} group={groups[key]} />
            ))}
        </div>
    );
}

export default LayoutCustomizer;
