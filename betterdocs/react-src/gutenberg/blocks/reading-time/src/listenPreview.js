/**
 * The Listen pill, drawn in the editor canvas.
 *
 * Same markup and classes as views/templates/parts/listen.php, so the frontend
 * stylesheet dresses it without a line of editor-only CSS, and so the block's
 * style controls — which select on `.betterdocs-listen-trigger` and friends — hit
 * the preview exactly as they hit the real thing.
 *
 * It is deliberately silent. The frontend player is delegated from `body` in
 * public/betterdocs.js, which never runs in the editor, and firing up
 * `speechSynthesis` inside the canvas would read the author's own draft aloud
 * while they were editing it. So clicking the pill morphs it into the player and
 * stops there: the point is to show what the control looks like and how much room
 * it takes, not to be the control.
 *
 * The times are the block's real estimate, computed from the same word count the
 * server would use, so an author sizing the pill against their layout is sizing it
 * against the width it will actually have.
 */

import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "@wordpress/element";
import { headphonesIcon, playIcon, pauseIcon, closeIcon } from "./listenIcons";

/**
 * m:ss.
 *
 * @param {number} seconds
 * @return {string}
 */
const clock = (seconds) => {
    const total = Math.max(0, Math.round(seconds || 0));

    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const ListenPreview = ({ attributes, words = 0, wpm = 180 }) => {
    const { listenButtonLabel, listenShowSpeed } = attributes;
    const [isOpen, setIsOpen] = useState(false);
    const wrapper = useRef(null);
    const player = useRef(null);

    const label = listenButtonLabel || __("Listen", "betterdocs");
    const total = wpm > 0 ? (words / wpm) * 60 : 0;

    // The same measure-then-animate the frontend does, for the same reason: the
    // pill is as wide as its label in whatever language the site runs in, and the
    // player as wide as its own contents at whatever font size the style controls
    // set, so neither width can be written down anywhere.
    useEffect(() => {
        const el = wrapper.current;

        if (!el) {
            return;
        }

        if (!isOpen) {
            el.style.width = "";
            return;
        }

        el.style.width = `${Math.ceil(player.current.getBoundingClientRect().width)}px`;
    }, [isOpen, label, listenShowSpeed]);

    return (
        <div
            className={`betterdocs-listen${isOpen ? " is-active" : ""}`}
            ref={wrapper}
            data-bd-words={words}
            data-bd-wpm={wpm}
        >
            <button
                type="button"
                className="betterdocs-listen-trigger"
                aria-label={__("Listen to this article", "betterdocs")}
                onClick={(event) => {
                    event.preventDefault();
                    setIsOpen(true);
                }}
            >
                <span className="betterdocs-listen-icon" aria-hidden="true">
                    {headphonesIcon()}
                </span>
                <span className="betterdocs-listen-label">{label}</span>
            </button>

            <div className="betterdocs-listen-player" ref={player}>
                <button
                    type="button"
                    className="betterdocs-listen-play"
                    aria-label={__("Play", "betterdocs")}
                    onClick={(event) => event.preventDefault()}
                >
                    <span className="betterdocs-listen-icon betterdocs-listen-icon-play" aria-hidden="true">
                        {playIcon()}
                    </span>
                    <span className="betterdocs-listen-icon betterdocs-listen-icon-pause" aria-hidden="true">
                        {pauseIcon()}
                    </span>
                </button>

                <div className="betterdocs-listen-seek">
                    <div className="betterdocs-listen-track">
                        <span className="betterdocs-listen-fill" />
                        <span className="betterdocs-listen-thumb" />
                    </div>
                </div>

                <span className="betterdocs-listen-time">
                    <span className="betterdocs-listen-elapsed">{clock(0)}</span>
                    <span className="betterdocs-listen-separator" aria-hidden="true">
                        {" / "}
                    </span>
                    <span className="betterdocs-listen-total">{clock(total)}</span>
                </span>

                {listenShowSpeed && (
                    <button
                        type="button"
                        className="betterdocs-listen-speed"
                        aria-label={__("Playback speed", "betterdocs")}
                        onClick={(event) => event.preventDefault()}
                    >
                        1×
                    </button>
                )}

                <button
                    type="button"
                    className="betterdocs-listen-close"
                    aria-label={__("Close player", "betterdocs")}
                    onClick={(event) => {
                        event.preventDefault();
                        setIsOpen(false);
                    }}
                >
                    <span className="betterdocs-listen-icon" aria-hidden="true">
                        {closeIcon()}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ListenPreview;
