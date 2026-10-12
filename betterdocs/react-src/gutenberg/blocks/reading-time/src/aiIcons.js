/**
 * Preview-only icons for the AI Actions half of the block.
 *
 * The frontend renders its own SVGs from the PHP registry
 * (Core\AIActions::icon), so these exist purely to make the editor placeholder
 * look like the real button — the action list is resolved per doc server-side and
 * is not knowable in the editor.
 */

const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

export const copyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export const caretIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);
