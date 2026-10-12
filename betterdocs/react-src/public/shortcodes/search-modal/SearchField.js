import React, { useState, useEffect, useRef } from "react";
import apiFetch from "@wordpress/api-fetch";
import LayoutOne from "./LayoutOne";
import LayoutTwo from "./LayoutTwo";
import LayoutSidebar from "./LayoutSidebar";
import SearchModal from "./SearchModal";

const SearchField = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [docCategories, setDocCategories] = useState([]);
    const [popularDocs, setPopularDocs] = useState([]);
    const [recentFaqs, setRecentFaqs] = useState([]);

    // Extracting attributes from props
    const {
        layout,
        placeholder,
        heading,
        subheading,
        headingTag,
        subheadingTag,
        buttonText,
        numberofdocs,
        numberoffaqs,
        doc_ids,
        doc_categories_ids,
        faq_categories_ids,
        searchButton,
		enable_docs_search,
		enable_faq_search,
		enable_ai_powered_search,
		kbBasedSearch,
        topWrapperRef = null
    } = props;

    const modalRef = useRef(null); // Ref to keep track of the modal element

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
            }
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                setIsModalOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const fetchDocCategories = async () => {
			try {
				const namespace = 'betterdocs/v1/';
				let relativePath = `get-terms?taxonomy=doc_category`;
				
				// Add KB filter if provided
				if (kbBasedSearch) {
					relativePath += `&knowledge_base=${encodeURIComponent(kbBasedSearch)}`;
				}
				
				const categories = await apiFetch({
					path: `${namespace}${relativePath}`,
				});
				setDocCategories(categories);
			} catch (error) {
				console.error("Error fetching doc categories:", error);
			}
		};

        fetchDocCategories();
    }, [kbBasedSearch]);

    useEffect(() => {
        const fetchInitialResults = async () => {
            try {
                const popularDocs = await apiFetch({
                    path: `betterdocs/v1/search?initial=true&per_page=${numberofdocs}${
                        doc_ids ? `&doc_ids=${doc_ids}` : ""
                    }${
                        doc_categories_ids
                            ? `&doc_categories_ids=${doc_categories_ids}`
                            : ""
                    }${
                        kbBasedSearch
                            ? `&knowledge_base=${encodeURIComponent(kbBasedSearch)}`
                            : ""
                    }`,
                });
                setPopularDocs(popularDocs);

                const recentFaqs = await apiFetch({
                    path: `betterdocs/v1/search?initial=true&post_type=betterdocs_faq&per_page=${numberoffaqs}${
                        faq_categories_ids
                            ? `&faq_categories_ids=${faq_categories_ids}`
                            : ""
                    }`,
                });
                setRecentFaqs(recentFaqs);
            } catch (error) {
                console.error("Error fetching initial results:", error);
            }
        };

        fetchInitialResults();
    }, [numberofdocs, numberoffaqs, doc_ids, doc_categories_ids, faq_categories_ids, kbBasedSearch]);

    // Use stopPropagation on the trigger so that the click that opens the modal
    // does NOT continue bubbling to document / React's event delegation.
    // Background: React 18 with createRoot still uses event delegation at the
    // root container. setState flushes cause the modal overlay to enter the DOM
    // before the click finishes bubbling, so React's delegation fires the
    // overlay's onMouseDown on the SAME click that opened the modal.
    const handleSearchFieldClick = (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Use mousedown (not click) on the document so that it fires BEFORE the
    // click event and is not affected by the trigger's stopPropagation on click.
    // Store the handler in a ref so the same function reference is always used
    // with addEventListener / removeEventListener — prevents stale-handler leak.
    const outsideMouseDownRef = useRef(null);

    useEffect(() => {
        outsideMouseDownRef.current = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsModalOpen(false);
            }
        };
    }); // runs after every render — keeps ref current

    useEffect(() => {
        const handler = (e) => {
            if (outsideMouseDownRef.current) {
                outsideMouseDownRef.current(e);
            }
        };

        if (isModalOpen) {
            // Use mousedown instead of click:
            // - fires before click, so it doesn't race with the trigger's click
            // - stopPropagation on the trigger's click doesn't affect mousedown
            document.addEventListener("mousedown", handler);
        }

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [isModalOpen]);

    return (
        <>
            {layout === "betterdocs-search-modal-sidebar" && (
                <div onClick={handleSearchFieldClick}>
                    <LayoutSidebar placeholder={placeholder} />
                </div>
            )}

            {layout === "betterdocs-search-modal-archive" && (
                <div onClick={handleSearchFieldClick}>
                    <LayoutTwo
                        placeholder={placeholder}
                        buttonText={buttonText}
                        searchButton={searchButton}
                    />
                </div>
            )}

            {layout === "betterdocs-search-modal-layout-1" && (
                <LayoutOne
                    handleSearchFieldClick={handleSearchFieldClick}
                    placeholder={placeholder}
                    heading={heading}
                    subheading={subheading}
                    headingTag={headingTag}
                    subheadingTag={subheadingTag}
                    buttonText={buttonText}
                    searchButton={searchButton}
                />
            )}

            {isModalOpen && (
                <div ref={modalRef}>
                    <SearchModal
                        topWrapperRef={topWrapperRef}
                        initialSearchQuery={searchQuery}
                        closeModal={closeModal}
                        docCategories={docCategories}
                        popularDocs={popularDocs}
                        recentFaqs={recentFaqs}
                        placeholder={placeholder}
						enableFaqSearch={enable_faq_search}
						enableDocsSearch={enable_docs_search}
						enableAiSearchSuggestions={enable_ai_powered_search}
						kbBasedSearch={kbBasedSearch}
                    />
                </div>
            )}
        </>
    );
};

export default SearchField;
