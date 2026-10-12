/**
 * Defaults inherited from the BetterDocs Settings panel.
 *
 * Every control on this block starts life showing what Settings says, so turning
 * a feature on there is enough and the block control is only for overriding one
 * instance. The values arrive on `betterDocsBlocksHelper.settings`, put there by
 * Editors\BlockEditor::block_setting_defaults() — the editor cannot read
 * `betterdocs_settings` itself, since the REST route behind it requires
 * `edit_docs_settings` and an author does not have that.
 *
 * Reading them here rather than at render time is deliberate. Gutenberg omits any
 * attribute still equal to its declared default from the serialized block, so an
 * untouched control writes nothing and keeps tracking the Settings panel even
 * after somebody changes it. Touch the control once and that instance is frozen,
 * which is exactly what "override this one" should mean.
 *
 * The fallbacks matter: `attributes.js` is evaluated at module load, and the
 * localized object is absent in the block unit-test environment and on any screen
 * that loads the editor bundle without going through our enqueue.
 */

const panel =
    (typeof window !== "undefined" &&
        window.betterDocsBlocksHelper &&
        window.betterDocsBlocksHelper.settings) ||
    {};

/**
 * A boolean setting. Booleans survive the trip because they are nested one level
 * down — wp_localize_script stringifies top-level scalars only.
 *
 * @param {string}  key
 * @param {boolean} fallback Used when the panel value is missing entirely, not
 *                           when it is a legitimate `false`.
 * @return {boolean}
 */
export const settingFlag = (key, fallback = true) =>
    typeof panel[key] === "undefined" ? fallback : !!panel[key];

/**
 * A text setting. Blank counts as absent, matching Settings::get(), which
 * substitutes the registered default for an empty string.
 *
 * @param {string} key
 * @param {string} fallback
 * @return {string}
 */
export const settingText = (key, fallback = "") => {
    const value = panel[key];

    return typeof value === "string" && value !== "" ? value : fallback;
};

/**
 * A numeric setting.
 *
 * Numbers survive the trip for the same reason booleans do — they are nested one
 * level down, so wp_localize_script JSON-encodes them rather than stringifying
 * them — but a site that saved "180" through the text path would still arrive as a
 * string, which is why this coerces rather than trusting the type.
 *
 * @param {string} key
 * @param {number} fallback Used when the panel value is missing or unusable, which
 *                          includes 0: a words-per-minute of 0 would divide the
 *                          duration estimate by nothing.
 * @return {number}
 */
export const settingNumber = (key, fallback = 0) => {
    const value = parseFloat(panel[key]);

    return Number.isFinite(value) && value > 0 ? value : fallback;
};
