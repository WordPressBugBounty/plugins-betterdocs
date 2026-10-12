export const WRAPPER_MARGIN = "wrapper_margin";
export const WRAPPER_PADDING = "wrapper_padding";
export const WRAPPER_BACKGROUND = "wrapper_background";
export const WRAPPER_BORDER = 'wrapper_border';
export const READING_TIME_SIZE = 'reading_time_size';

// AI Actions half of the block. Prefixed rather than reusing the WRAPPER_*
// controls above, which target `.reading-time.betterdocs` — the two halves sit
// side by side in the meta row and are styled independently.
export const AI_ACTIONS_PADDING = 'ai_actions_padding';
export const AI_ACTIONS_BACKGROUND = 'ai_actions_background';
export const AI_ACTIONS_BORDER = 'ai_actions_border';
export const AI_ACTIONS_ICON_SIZE = 'ai_actions_icon_size';

// Listen half of the block. Prefixed for the same reason the AI Actions controls
// are: all three occupants of the meta row are styled independently.
export const LISTEN_PADDING = 'listen_padding';
export const LISTEN_BACKGROUND = 'listen_background';
export const LISTEN_BORDER = 'listen_border';
export const LISTEN_ICON_SIZE = 'listen_icon_size';
