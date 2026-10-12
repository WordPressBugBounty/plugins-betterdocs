import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BuilderProvider, useBuilder } from "quickbuilder";
import QuickBuild from "./QuickBuild";
import { addAction } from "@wordpress/hooks";

const TAB_ID_PREFIX = "tab-";

// Convert a URL hash like `#layout` (or `#tab-layout`) into a builder tab id
// like `tab-layout`. Returns null if the hash is empty.
const hashToTabId = (rawHash) => {
    const slug = (rawHash || "").replace(/^#/, "").trim();
    if (!slug) return null;
    return slug.startsWith(TAB_ID_PREFIX) ? slug : `${TAB_ID_PREFIX}${slug}`;
};

// Convert a tab id like `tab-layout` into a user-friendly hash slug like `layout`.
const tabIdToHashSlug = (tabId) => {
    if (!tabId) return "";
    return tabId.startsWith(TAB_ID_PREFIX) ? tabId.slice(TAB_ID_PREFIX.length) : tabId;
};

// Hash anchor (#layout) wins; legacy ?tab=tab-layout is honored as a fallback.
const getInitialTabFromUrl = () => {
    const fromHash = hashToTabId(window.location.hash);
    if (fromHash) return fromHash;
    const queryTab = new URLSearchParams(window.location.search).get("tab");
    if (!queryTab) return null;
    return queryTab.startsWith(TAB_ID_PREFIX) ? queryTab : `${TAB_ID_PREFIX}${queryTab}`;
};

const QuickBuildWrapper = (props) => {
    const builder                   = useBuilder(betterdocsAdminSettings);
    const [isLoading, setIsLoading] = useState(true);
	const [triggerEffect, setTriggerEffect] = useState(false);

    builder.values.is_pro_active = betterdocsAdminSettings?.is_pro_active;

	const settingsCopyObject = {...betterdocsAdminSettings};

	useEffect(() => {
		if( builder?.values?.multiple_kb == true && builder?.values?.internal_knowledge_base_type == 'specific-docs' && betterdocsAdminSettings?.values?.multiple_kb == false && builder?.values?.betterdocs_access_control_repeater_kb != undefined && builder?.values?.betterdocs_access_control_repeater_kb?.length == 0 ){
			builder.values.internal_knowledge_base_type = 'all-docs';
		}
	}, [builder?.values?.multiple_kb]);

	// useEffect(() => {
	// 	const submitButton = document.querySelector('.wprf-submit .wprf-submit-button');
	// 	if( builder?.values?.betterdocs_access_control_repeater?.length == 0 && builder?.values?.betterdocs_access_control_repeater?.length != betterdocsAdminSettings.values?.betterdocs_access_control_repeater?.length && submitButton.style.display == 'block') {
	// 		submitButton.style.display == 'block';
	// 	}
	// }, [builder?.values?.betterdocs_access_control_repeater]);

    useEffect(() => {
        if( builder.values.enable_disable == false ) { //related I/A settings preview
            builder.values.ia_enable_preview = false;
        }
        betterdocsAdminSettings.values = builder.values;
    }, [builder.values]);

    // Deep-link initial tab from the URL. `#layout` wins; `?tab=tab-layout` is a fallback.
    useEffect(() => {
        const initial = getInitialTabFromUrl();
        if (initial) {
            builder.setActiveTab(initial);
        }
    }, []);

    // Reflect the active tab in the URL hash so links can be shared and
    // browser back/forward stays in sync. `replaceState` keeps tab clicks
    // out of the history stack.
    useEffect(() => {
        const active = builder?.config?.active;
        if (!active) return;
        const desiredHash = `#${tabIdToHashSlug(active)}`;
        if (window.location.hash === desiredHash) return;
        const url = `${window.location.pathname}${window.location.search}${desiredHash}`;
        window.history.replaceState(null, "", url);
    }, [builder?.config?.active]);

    // Pick up hash edits and back/forward navigation.
    useEffect(() => {
        const handleHashChange = () => {
            const tabId = hashToTabId(window.location.hash);
            if (tabId && tabId !== builder?.config?.active) {
                builder.setActiveTab(tabId);
            }
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, [builder]);

    useEffect(() => {
        setIsLoading(false);
    }, []);


	useEffect(() => {
		const externalButtons    = document.querySelectorAll('.title-advance-settings-tab .wprf-tab-nav-item');

		const handleClick = () => {
			setTriggerEffect(prev => !prev); // or setTriggerEffect(true);
		};

		if (externalButtons) {
			for(let button of externalButtons){
				button.addEventListener('click', handleClick);
			}
		}

		// Cleanup
		return () => {
			if (externalButtons) {
				for(let button of externalButtons){
					button.removeEventListener('click', handleClick);
				}
			}
		};
	}, [builder]);

	useEffect(() => {
		const submitButton = document.querySelector('.wprf-submit .wprf-submit-button');
		if( ( builder?.config?.active == 'tab-advance-settings' && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater?.length == 0 && settingsCopyObject?.values?.betterdocs_access_control_repeater?.length == 1 && submitButton?.style?.display == 'block' && ! builder?.values?.multiple_kb ) || ( builder?.config?.active == 'tab-advance-settings' && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater_kb?.length == 0 && settingsCopyObject?.values?.betterdocs_access_control_repeater_kb?.length == 1 && submitButton?.style?.display == 'block' && builder?.values?.multiple_kb ) ) {
			return;
		} else if( builder?.config?.active == 'tab-advance-settings' && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater?.length == 0 && submitButton && ! builder?.values?.multiple_kb ) {
			submitButton.style.display = 'none';
		} else if( builder?.config?.active == 'tab-advance-settings' && builder?.values?.multiple_kb && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater_kb?.length == 0 && submitButton  ) {
			submitButton.style.display = 'none';
		} else if( builder?.config?.active == 'tab-advance-settings' && builder?.values?.multiple_kb && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater_kb?.length > 0 && submitButton )  {
			submitButton.style.display = 'block';
		} else if( builder?.config?.active == 'tab-advance-settings' && builder?.values?.internal_knowledge_base_type == 'specific-docs' && builder?.values?.betterdocs_access_control_repeater?.length > 0 && submitButton && ! builder?.values?.multiple_kb ) {
			submitButton.style.display = 'block';
		} else if( submitButton ) {
			submitButton.style.display = 'block';
		}
	}, [triggerEffect, builder?.config?.active, builder?.values?.internal_knowledge_base_type, builder?.values?.betterdocs_access_control_repeater,  builder?.values?.betterdocs_access_control_repeater_kb, builder?.values?.multiple_kb]);

	useEffect(() => {
		const submitButton = document.querySelector('.wprf-submit .wprf-submit-button');
		if( builder?.values?.enable_content_restriction == false && submitButton?.style?.display == 'none' ) {
			submitButton.style.display = 'block';
		}
	}, [builder?.values?.enable_content_restriction]);

    return (
        <BuilderProvider value={{ ...builder, isLoading, setIsLoading }}>
            <QuickBuild isLoading={isLoading} />
        </BuilderProvider>
    );
};
export default QuickBuildWrapper;
