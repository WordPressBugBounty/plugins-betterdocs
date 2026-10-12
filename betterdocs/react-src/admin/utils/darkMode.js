/**
 * Shared admin dark/light mode helper.
 *
 * The theme is a CLIENT-SIDE preference stored in the `betterdocs_admin_dark_mode`
 * cookie — never the database. PHP (Admin::is_dark_mode + body_classes) reads the
 * same cookie on every BetterDocs admin screen and adds the `betterdocs-dark-mode`
 * body class server-side, so the choice carries across full-page navigations with
 * no flash and without touching `betterdocs_settings`.
 *
 * Both the dashboard header and the Quick Setup header use this, so the two
 * switchers behave identically.
 */

export const DARK_CLASS = "betterdocs-dark-mode";
export const DARK_COOKIE = "betterdocs_admin_dark_mode";

/** Apply the mode now (this page) and persist it for other admin pages. */
export const setDarkMode = (dark) => {
    document.body.classList.toggle(DARK_CLASS, !!dark);
    // path=/ so PHP receives it on every wp-admin request; 1-year max-age.
    document.cookie = `${DARK_COOKIE}=${dark ? "1" : "0"};path=/;max-age=31536000;samesite=lax`;
};

/**
 * Initial mode for a freshly-mounted switcher. PHP already rendered the body class
 * (and localized window.betterdocs_admin.dark_mode) from the cookie, so we read
 * whichever is available — no localStorage, no DB.
 */
export const getInitialDarkMode = () =>
    Boolean(window.betterdocs_admin?.dark_mode) ||
    (typeof document !== "undefined" &&
        document.body.classList.contains(DARK_CLASS));
