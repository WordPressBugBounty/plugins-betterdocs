import { __, _n, sprintf } from "@wordpress/i18n";

/**
 * Date helpers shared by the KPI tiles and the connected-apps table.
 *
 * Every timestamp this page receives is a Unix time in seconds (the pairing's
 * `connected_at` / `last_used`, each app's `created` / `last_used`), but the
 * REST layer is free to hand back a date string, so both shapes are accepted
 * and anything unparseable is treated as "no value" rather than printed as
 * `Invalid Date`.
 *
 * @since 4.9.0
 */

/**
 * A timestamp in milliseconds, or `null` when there is no usable value.
 *
 * @param {number|string|null} value Unix seconds, a parseable date string, or nothing.
 * @return {number|null} Milliseconds since the epoch, or `null`.
 */
export function toMillis(value) {
    if (!value) {
        return null;
    }
    const ts = typeof value === "number" ? value * 1000 : Date.parse(value);
    return Number.isNaN(ts) ? null : ts;
}

/**
 * A short absolute date in the reader's own locale — "Aug 20, 2026".
 *
 * The year is kept: a pairing made last year is a materially different fact
 * from one made this month, and the tile has room for four more characters.
 *
 * @param {number|string|null} value Unix seconds or a parseable date string.
 * @return {string} The formatted date, or "Never".
 */
export function formatDate(value) {
    const ts = toMillis(value);
    if (ts === null) {
        return __("Never", "betterdocs");
    }
    return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * How long ago something happened, in words.
 *
 * Coarse on purpose: the server records one `last_used` stamp per credential
 * and no history at all, so "3 hours ago" is the whole of what is known. Past a
 * week the absolute date says more than a growing day count, so it takes over.
 *
 * @param {number|string|null} value Unix seconds or a parseable date string.
 * @param {number}             now   Milliseconds to measure from; defaults to the current time.
 * @return {string} A relative description, or "Never".
 */
export function relativeTime(value, now = Date.now()) {
    const ts = toMillis(value);
    if (ts === null) {
        return __("Never", "betterdocs");
    }

    const seconds = Math.round((now - ts) / 1000);

    // A clock skew between the server and the browser can put a stamp a few
    // seconds into the future; "in 4 seconds" would be nonsense, "Just now" is
    // both true and useful.
    if (seconds < 60) {
        return __("Just now", "betterdocs");
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        /* translators: %d: number of minutes. */
        return sprintf(_n("%d minute ago", "%d minutes ago", minutes, "betterdocs"), minutes);
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        /* translators: %d: number of hours. */
        return sprintf(_n("%d hour ago", "%d hours ago", hours, "betterdocs"), hours);
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        /* translators: %d: number of days. */
        return sprintf(_n("%d day ago", "%d days ago", days, "betterdocs"), days);
    }

    return formatDate(value);
}
