/**
 * The AI Actions split button, drawn in the editor canvas.
 *
 * Same markup and classes as views/templates/parts/ai-actions.php, so the
 * frontend stylesheet dresses it without a line of editor-only CSS, and so the
 * block's style controls — which select on `.betterdocs-ai-actions-primary` and
 * friends — hit the preview exactly as they hit the real thing.
 *
 * It is deliberately inert. The frontend delegates clicks from `body` in
 * public/betterdocs.js, which never runs in the editor, so the disclosure is
 * driven by React state here instead. Nothing navigates and nothing touches the
 * clipboard: the point is to show the author what the toggles do, not to be the
 * button.
 */

import { __ } from "@wordpress/i18n";
import { Fragment, useEffect, useRef, useState } from "@wordpress/element";
import { caretMarkup, enabledActions } from "./aiActions";
import { copyIcon, caretIcon } from "./aiIcons";

/**
 * Registry icons arrive as SVG markup rather than components, because they come
 * from Core\AIActions::icon() — one source of truth for both surfaces, including
 * whatever a third-party registry entry supplies.
 */
const Icon = ({ markup, className = "" }) => (
    <span
        className={`betterdocs-ai-actions-icon${className ? ` ${className}` : ""}`}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: markup }}
    />
);

/**
 * The static button, for when the localized registry is missing — a screen that
 * loaded the editor bundle without going through our enqueue, or a test. Better
 * an unopenable button than an empty block.
 */
const Placeholder = ({ label }) => (
    <div className="betterdocs-ai-actions betterdocs-ai-actions-placeholder">
        <span className="betterdocs-ai-actions-primary">
            <span className="betterdocs-ai-actions-icon">{copyIcon()}</span>
            <span className="betterdocs-ai-actions-label">{label}</span>
        </span>
        <span className="betterdocs-ai-actions-toggle">
            <span className="betterdocs-ai-actions-caret">{caretIcon()}</span>
        </span>
    </div>
);

const AIActionsPreview = ({ attributes }) => {
    const { aiButtonLabel } = attributes;
    const [isOpen, setIsOpen] = useState(false);
    const wrapper = useRef(null);

    const actions = enabledActions(attributes);
    const primary = actions.find((action) => action.primary);
    const label = aiButtonLabel || (primary ? primary.label : __("AI Actions", "betterdocs"));

    // The canvas is an iframe in WP 6.3+, so these have to be bound to the
    // element's *own* document — `document` here is the admin frame's, which never
    // sees a click inside the canvas.
    useEffect(() => {
        if (!isOpen || !wrapper.current) {
            return;
        }

        const doc = wrapper.current.ownerDocument;
        const onDocumentClick = (event) => {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === "Escape" || event.key === "Esc") {
                setIsOpen(false);
            }
        };

        doc.addEventListener("click", onDocumentClick);
        doc.addEventListener("keydown", onKeyDown);

        return () => {
            doc.removeEventListener("click", onDocumentClick);
            doc.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    if (!actions.length) {
        return <Placeholder label={label} />;
    }

    const caret = caretMarkup();

    return (
        <div
            className={`betterdocs-ai-actions${primary ? "" : " betterdocs-ai-actions-no-primary"}`}
            ref={wrapper}
        >
            {primary && (
                <button
                    type="button"
                    className="betterdocs-ai-actions-primary"
                    onClick={(event) => event.preventDefault()}
                >
                    <Icon markup={primary.icon} className="betterdocs-ai-actions-icon-idle" />
                    <span className="betterdocs-ai-actions-label">{label}</span>
                </button>
            )}

            <button
                type="button"
                className="betterdocs-ai-actions-toggle"
                aria-expanded={isOpen}
                aria-label={__("AI actions", "betterdocs")}
                // Not stopPropagation: the click also has to reach Gutenberg, or
                // opening the menu on an unselected block would fail to select it.
                // The outside-click listener already ignores clicks inside the
                // wrapper, so nothing here closes what it just opened.
                onClick={(event) => {
                    event.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                {caret ? (
                    <Icon markup={caret} />
                ) : (
                    <span className="betterdocs-ai-actions-caret">{caretIcon()}</span>
                )}
            </button>

            <ul className="betterdocs-ai-actions-menu" hidden={!isOpen}>
                {actions.map((action, index) => (
                    <Fragment key={action.id}>
                        {/* Same rule the frontend view draws: wherever the group
                            changes between two consecutive rows. */}
                        {index > 0 && action.group !== actions[index - 1].group && (
                            <li className="betterdocs-ai-actions-separator" role="presentation" />
                        )}
                        <li className="betterdocs-ai-actions-row">
                            <button
                                type="button"
                                className="betterdocs-ai-actions-item"
                                onClick={(event) => event.preventDefault()}
                            >
                                <Icon markup={action.icon} />
                                <span className="betterdocs-ai-actions-text">
                                    <span className="betterdocs-ai-actions-title">
                                        {action.label}
                                    </span>
                                    {action.description && (
                                        <span className="betterdocs-ai-actions-desc">
                                            {action.description}
                                        </span>
                                    )}
                                </span>
                            </button>
                        </li>
                    </Fragment>
                ))}
            </ul>
        </div>
    );
};

export default AIActionsPreview;
