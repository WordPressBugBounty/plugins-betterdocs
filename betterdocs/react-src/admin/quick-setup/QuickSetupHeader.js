import React, { useState, useEffect, useCallback } from "react";
import { __ } from "@wordpress/i18n";
import { Logo, IconSun, IconMoon } from "../../icons";
import { setDarkMode as persistDarkMode, getInitialDarkMode } from "../utils/darkMode";

/* Quick Setup top bar — same design as the dashboard betterdocs-dashboard-header-top:
   BetterDocs logo on the left, dark-mode switcher on the right.
   Uses the SAME switcher as the dashboard (utils/darkMode): the choice is stored
   in the `betterdocs_admin_dark_mode` cookie — never the database — so toggling
   here carries to every other admin screen and never creates `betterdocs_settings`
   (which would hide the Quick Setup menu). */

const QuickSetupHeader = () => {
    const [darkMode, setDarkMode] = useState(getInitialDarkMode);

    useEffect(() => {
        persistDarkMode(darkMode);
    }, [darkMode]);

    const handleToggle = useCallback(() => {
        setDarkMode((mode) => !mode);
    }, []);

    return (
        <div className="betterdocs-dashboard-header-top betterdocs-quick-setup-header-top">
            <div className="betterdocs-dashboard-container">
                <div className="betterdocs-row betterdocs-logo-action">
                    <div className="betterdocs-dashboard-header-left betterdocs-dashboard-header-items">
                        <div className="betterdocs-dashboard-logo">
                            <Logo />
                        </div>
                    </div>
                    <div className="betterdocs-dashboard-header-right betterdocs-dashboard-header-items">
                        <ul className="betterdocs-dashboard-header-action-list betterdocs-text-align-right">
                            <li>
                                <button
                                    type="button"
                                    onClick={handleToggle}
                                    className="betterdocs-dashboard-header-action betterdocs-dashboard-header-action-mode"
                                    aria-label={__("Toggle dark mode", "betterdocs")}
                                >
                                    {darkMode ? <IconMoon /> : <IconSun />}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickSetupHeader;
