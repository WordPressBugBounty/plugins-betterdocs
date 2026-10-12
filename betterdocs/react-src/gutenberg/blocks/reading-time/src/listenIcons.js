/**
 * The Listen player's icons, as components.
 *
 * Unlike the AI Actions half — whose registry lives in PHP and hands its icons to
 * the editor as markup, because a third party can add an entry — the Listen
 * player's four glyphs are fixed. So they are written out here rather than shipped
 * through `betterDocsBlocksHelper`, and the paths are the same ones
 * Core\Listen::icon() draws.
 */

const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

export const headphonesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" />
    </svg>
);

// Filled, not stroked: both of these are drawn at 9px inside the play button, and
// a stroked triangle at that size is a smudge.
export const playIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4l14 8-14 8z" />
    </svg>
);

export const pauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="4" width="4.5" height="16" rx="1" />
        <rect x="14.5" y="4" width="4.5" height="16" rx="1" />
    </svg>
);

export const closeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        {...stroke}
        strokeWidth={2.6}
    >
        <path d="M6 6l12 12M18 6 6 18" />
    </svg>
);
