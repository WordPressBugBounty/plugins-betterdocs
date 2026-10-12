import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from "react";
import { IconSun, IconMoon } from "../../icons/index";
import { setDarkMode as persistDarkMode, getInitialDarkMode } from "../utils/darkMode";

/* Shared dark/light mode switcher — the single source of truth for the admin
   mode toggle, reused by the main header (Header.js) and the Analytics header
   (analytics/components/Chrome.js) so they share one icon, markup, behaviour and
   stylesheet. Persistence is the cookie-based helper in utils/darkMode (the same
   one the Quick Setup header uses): PHP reads the `betterdocs_admin_dark_mode`
   cookie on every admin screen and sets the body class server-side, so the choice
   carries across full-page navigations with no flash and no DB write. State
   initialises from the live body class / localized config, so a re-mounting host
   (e.g. the Analytics route) never re-inits from a stale value. */
const DarkModeToggle = () => {
    const [ dark, setDark ] = useState( getInitialDarkMode );

    useEffect( () => {
        persistDarkMode( dark );
    }, [ dark ] );

    const onClick = () => setDark( ( prev ) => ! prev );

    return (
        <button
            type="button"
            onClick={ onClick }
            className="betterdocs-dashboard-header-action betterdocs-dashboard-header-action-mode"
            aria-label={ __( "Toggle dark mode", "betterdocs" ) }
        >
            { dark ? <IconMoon /> : <IconSun /> }
        </button>
    );
};

export default DarkModeToggle;
