import { FormBuilder, useBuilderContext } from "quickbuilder";
import React, { useCallback, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { proAlert } from "../../utils";
import toastAlert from "../../utils/toastAlert";

const getCookie = (name) => {
    const match = document.cookie.match(
        "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return match ? match.pop() : "";
};

const QuickBuild = (props) => {
    const builder = useBuilderContext();
    const wrapperRef = useRef(null);
    // Furthest step the user has actually reached (via Proceed / Next), by DOM
    // index. Steps beyond this stay locked so the wizard is a real stepper.
    const maxReachedRef = useRef(0);

    useEffect(() => {
        builder.registerAlert("pro_alert", proAlert);
        builder.registerAlert("toast", toastAlert);
    }, []);

    builder.submit.onSubmit = useCallback((event, context) => {
        return 0;
    }, []);

    // Step gating. quickbuilder's Menu only has a global `clickable` flag, so we
    // enforce stepper rules on the tab <li>s directly:
    //   - a tab is clickable only once it has been reached (Proceed / Next);
    //   - "Getting Started" locks once the user consents (Proceed to Next Step),
    //     so there's no going back to the consent screen — matching the prior
    //     footer Back-disable behaviour, now that tabs are clickable too.
    const isStartClicked = builder?.values?.isStartClicked;
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) {
            return;
        }

        const applyGate = () => {
            const items = Array.from(
                wrapper.querySelectorAll(".wprf-tab-nav .wprf-tab-nav-item")
            );
            if (!items.length) {
                return;
            }

            const activeIndex = items.findIndex((el) =>
                el.classList.contains("wprf-active-nav")
            );
            if (activeIndex < 0) {
                return;
            }
            if (activeIndex > maxReachedRef.current) {
                maxReachedRef.current = activeIndex;
            }

            const consented =
                getCookie("betterdocs_insights_allowed") === "1" ||
                !!builder?.values?.isStartClicked;

            items.forEach((el, index) => {
                const isActive = index === activeIndex;
                const isGettingStarted =
                    el.classList.contains("getting-started");

                // Not yet reached → locked.
                let disabled = index > maxReachedRef.current;
                // Consent already given → the intro step is a dead end.
                if (isGettingStarted && consented) {
                    disabled = true;
                }

                el.classList.toggle("wprf-tab-disabled", disabled && !isActive);
            });
        };

        applyGate();

        const nav = wrapper.querySelector(".wprf-tab-nav");
        if (!nav) {
            return;
        }
        // Re-gate whenever the active tab changes (from tabs or footer buttons).
        const observer = new MutationObserver(applyGate);
        observer.observe(nav, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, [isStartClicked]);

    return (
        <div
            className="betterdocs-quick-setup-builder-wrapper"
            ref={wrapperRef}
        >
            <FormBuilder {...builder} />
        </div>
    );
};

export default QuickBuild;
