/**
 * The AI Actions half of the block, as the editor sees it.
 *
 * Two sources, and the split matters:
 *
 *  - `AI_ACTION_TOGGLES` is the fixed map from block attribute to action id. It
 *    has to be spelled out because the attributes are declared statically in
 *    `attributes.js` and mirrored in `Blocks\ReadingTime::AI_ACTIONS`; all three
 *    lists have to agree.
 *  - `catalog()` is the live registry, handed over by
 *    `Editors\BlockEditor::ai_actions_catalog()`. Labels, descriptions, icons and
 *    order come from there, so the preview matches the frontend exactly and an
 *    entry a third party added through `betterdocs_ai_actions` still shows up.
 */

import { __ } from "@wordpress/i18n";
import { settingFlag } from "./settingDefaults";

/**
 * Block attribute => registry id, in registry priority order.
 *
 * The labels are the inspector's, not the registry's: a toggle reads better in
 * title case beside the other controls, while the menu keeps the registry's own
 * sentence-case wording.
 */
export const AI_ACTION_TOGGLES = [
    { attribute: "aiCopyPage", id: "copy-page", label: __("Copy Page", "betterdocs") },
    { attribute: "aiViewMarkdown", id: "view-markdown", label: __("View as Markdown", "betterdocs") },
    { attribute: "aiChatGPT", id: "open-chatgpt", label: __("Open in ChatGPT", "betterdocs") },
    { attribute: "aiClaude", id: "open-claude", label: __("Open in Claude", "betterdocs") },
    { attribute: "aiGemini", id: "open-aistudio", label: __("Open in Google AI Studio", "betterdocs") },
    { attribute: "aiPerplexity", id: "open-perplexity", label: __("Open in Perplexity", "betterdocs") },
    { attribute: "aiGrok", id: "open-grok", label: __("Open in Grok", "betterdocs") },
];

const payload =
    (typeof window !== "undefined" &&
        window.betterDocsBlocksHelper &&
        window.betterDocsBlocksHelper.aiActions) ||
    {};

/**
 * The disclosure arrow, as rendered by Core\AIActions::icon('caret').
 *
 * @return {string} SVG markup, or "" when the payload is missing.
 */
export const caretMarkup = () => payload.caret || "";

/**
 * The registry entries this instance should show, in order.
 *
 * An entry with a block attribute follows that attribute — which itself defaults
 * to the Settings panel, so an untouched control still tracks the site-wide
 * value. An entry without one (a third-party addition) follows its `setting_key`,
 * which is what Core\AIActions::action_enabled() does server-side.
 *
 * @param {Object} attributes
 * @return {Object[]}
 */
export const enabledActions = (attributes) =>
    (payload.items || []).filter((action) => {
        const toggle = AI_ACTION_TOGGLES.find(({ id }) => id === action.id);

        if (toggle) {
            return !!attributes[toggle.attribute];
        }

        // No setting key at all means "always on", same as the server.
        return action.setting_key ? settingFlag(action.setting_key) : true;
    });
