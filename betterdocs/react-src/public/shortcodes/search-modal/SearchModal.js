import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addFilter, applyFilters } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import FolderIcon from './FolderIcon';
import DocsIcon from './DocsIcon';
import MagnifyIcon from './MagnifyIcon';
import FaqIcon from './FaqIcon';
import NoResultIcon from './NoResultIcon';
import ClearIcon from './ClearIcon';
import ExpandableContent from './ExpandableContent';
import Xmark from './Xmark';
import apiFetch from '@wordpress/api-fetch';

const SEARCH_DEBOUNCE_MS = 250;
const SEARCH_PER_PAGE = 20;

// Trailing debounce used for analytics; the search itself is debounced inline via a ref-tracked timer.
const debounce = (func, delay) => {
	let timeout;
	return (...args) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), delay);
	};
};

const SearchModal = ({ initialSearchQuery, closeModal, docCategories, popularDocs, recentFaqs, placeholder, enableFaqSearch, enableDocsSearch, enableAiSearchSuggestions, kbBasedSearch, topWrapperRef = null }) => {
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [activeTab, setActiveTab] = useState('docs');
	// 'idle' (showing popular/recent), 'loading', 'success', 'empty', 'error'
	const [status, setStatus] = useState('idle');
	const inputRef = useRef(null);
	const cache = useRef({});
	const abortRef = useRef(null);
	const debounceRef = useRef(null);
	// Last query the user typed — used to reject out-of-order responses even if AbortController is unsupported.
	const latestQueryRef = useRef('');
	const decodeHtmlEntities = (str) => {
		const textArea = document.createElement('textarea');
		textArea.innerHTML = str;
		return textArea.value;
	};

	const storeSearchKeyword = useCallback(
		debounce(async (query, noResult = false) => {
			const namespace = 'betterdocs/v1/';
			const relativePath = `search-insert?s=${query}${noResult ? '&no_result=1' : ''}`;
			try {
				await apiFetch({ path: `${namespace}${relativePath}` });
			} catch (error) {
				console.error('Error storing search keyword:', error);
			}
		}, 300),
		[]
	);

	// Note: third arg `tab` is retained for backward compatibility with the Pro
	// `betterdocs_search_modal_popular_keyword` filter, which calls this directly.
	const fetchSearchResults = useCallback(async (query, category, tab) => {
		// Cancel any in-flight request — only the most recent query may resolve into state.
		if (abortRef.current) {
			abortRef.current.abort();
		}
		const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
		abortRef.current = controller;
		latestQueryRef.current = query;

		const namespace = 'betterdocs/v1/';
		let apiPath = `${namespace}search?s=${encodeURIComponent(query)}&per_page=${SEARCH_PER_PAGE}`;

		if (category) {
			apiPath += `&doc_category=${encodeURIComponent(category)}`;
		}
		if (kbBasedSearch) {
			apiPath += `&knowledge_base=${encodeURIComponent(kbBasedSearch)}`;
		}

		const commit = (results) => {
			// Belt-and-suspenders: ignore responses that no longer match the latest query.
			if (latestQueryRef.current !== query) return;
			setSearchResults(results);
			setStatus(results.length === 0 ? 'empty' : 'success');
		};

		if (cache.current[apiPath]) {
			commit(cache.current[apiPath]);
			return;
		}

		setStatus('loading');

		try {
			const fetchOptions = {
				path: apiPath,
				headers: {
					'X-WP-Nonce': searchModalConfig?.nonce,
				},
			};
			if (controller) fetchOptions.signal = controller.signal;

			const results = await apiFetch(fetchOptions);
			if (latestQueryRef.current !== query) return;
			cache.current[apiPath] = results;
			commit(results);
			storeSearchKeyword(query, results.length === 0);
		} catch (error) {
			// Aborted requests are expected when the user keeps typing.
			if (error && (error.name === 'AbortError' || (controller && controller.signal.aborted))) {
				return;
			}
			if (latestQueryRef.current !== query) return;
			console.error('Error fetching search results:', error);
			setStatus('error');
		}
	}, [storeSearchKeyword, kbBasedSearch]);

	// Backward-compat shim: Pro's popular-keyword chip calls setHasSearched(true) before
	// firing fetchSearchResults. We no longer track hasSearched in state, but expose a no-op
	// setter so the filter contract doesn't break.
	const setHasSearched = useCallback((val) => {
		if (!val) {
			setStatus('idle');
			setSearchResults([]);
		}
	}, []);

	useEffect(() => {
		const shouldSearch = searchQuery.length >= betterdocsSearchModalConfig.search_letter_limit ||
			(searchQuery.length > 0 && selectedCategory);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
		}

		if (!shouldSearch) {
			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
			latestQueryRef.current = '';
			setStatus('idle');
			setSearchResults([]);
			return;
		}

		debounceRef.current = setTimeout(() => {
			fetchSearchResults(searchQuery, selectedCategory, activeTab);
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
				debounceRef.current = null;
			}
		};
	}, [searchQuery, selectedCategory, activeTab, fetchSearchResults]);

	useEffect(() => {
		return () => {
			if (abortRef.current) abortRef.current.abort();
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const handleCategoryChange = (selectedOption) => {
		// Always update the selected category state
		// The useEffect will handle whether to trigger a search based on searchQuery length
		setSelectedCategory(selectedOption ? selectedOption.value : '');
	};

	const handleInsideClick = (e) => {
		e.stopPropagation(); // Prevents the modal from closing when clicking inside it
	};

	const handleOutsideClick = () => {
		closeModal();
	};

	const handleClear = (e) => {
		e.stopPropagation(); // Prevent event from bubbling up
		setSearchQuery('');
		inputRef.current.focus(); // Refocus the input field
	};

	// Idle (no search) → fall back to props; otherwise use the live search results.
	const displayResults = status === 'idle'
		? (activeTab === 'docs' ? (popularDocs || []) : (recentFaqs || []))
		: searchResults;

	const filterResults = (type) => displayResults.filter(result => result.post_type === type);

	// FAQ tab should appear when there are FAQs to show in the current state.
	const hasFaqResults = status === 'idle'
		? (recentFaqs && recentFaqs.length > 0)
		: searchResults.some(r => r.post_type === 'betterdocs_faq');

	const tabs = [
		enableDocsSearch ? { label: __('Docs', 'betterdocs'), type: 'docs', icon: <DocsIcon /> } : {},
		...(hasFaqResults && enableFaqSearch ? [{ label: __('FAQ', 'betterdocs'), type: 'betterdocs_faq', icon: <FaqIcon /> }] : []), // Conditionally add FAQ tab
	];

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus(); // Set focus on the input field when the modal opens
		}
	}, []);

	useEffect(() => {
		if ((enableDocsSearch == null && enableFaqSearch == null) || (!enableDocsSearch && !enableFaqSearch)) { // if both are disabled
			setActiveTab('');
		} else if (!enableDocsSearch || (enableDocsSearch == null)) { // if docs is disabled
			setActiveTab('betterdocs_faq');
		} else if (!enableFaqSearch || (enableFaqSearch == null)) { // if faq is disabled
			setActiveTab('docs');
		}
	}, []);

	const searchNotFoundText = betterdocsSearchModalConfig?.search_not_found_text ? (betterdocsSearchModalConfig?.search_not_found_text
	).replace(/\.$/, '') + ' for' : __('No Docs found for', 'betterdocs');

	return (
		<div className="betterdocs-modal-overlay" onMouseDown={handleOutsideClick}>
			<div className="betterdocs-search-wrapper" style={{ display: 'block' }}>
				<div className="betterdocs-search-details" onMouseDown={handleInsideClick}>
					<div className="xmark">
						<Xmark onClick={closeModal} width="20" height="20" fill="#475467" />
					</div>
					<div className="betterdocs-search-header">
						<MagnifyIcon />
						<div className="betterdocs-searchform-input-wrap">
							<input
								type="text"
								className="betterdocs-search-field"
								aria-label={__('Search Input', 'betterdocs')}
								placeholder={placeholder}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								ref={inputRef}
								autoComplete="off"
								data-form-type="other"
							/>
							{searchQuery ? (
								<ClearIcon className='clear-icon' onClick={handleClear} />
							) : (
								<span className='esc-button'>{__('ESC', 'betterdocs')}</span>
							)}
						</div>
						{betterdocsSearchModalConfig.advance_search && docCategories.length > 0 && activeTab === 'docs' && applyFilters(
							"betterdocs_search_modal_category_select",
							[],
							[selectedCategory, handleCategoryChange, docCategories, topWrapperRef]
						)}
					</div>
					{applyFilters(
						"betterdocs_search_modal_after_srarch_header",
						[],
						[searchQuery, setSearchQuery, setHasSearched, selectedCategory, activeTab, fetchSearchResults, closeModal, topWrapperRef, enableAiSearchSuggestions]
					)}
					{betterdocsSearchModalConfig.advance_search && applyFilters(
						"betterdocs_search_modal_popular_keyword",
						[],
						[setSearchQuery, setHasSearched, selectedCategory, activeTab, fetchSearchResults, topWrapperRef]
					)}

					<div className="betterdocs-search-content">
						<div className="betterdocs-search-info-tab betterdocs-search-tabs">
							{tabs.map(tab => {
								if (Object.keys(tab)?.length > 0) {
									return <div
										key={tab.type}
										className={`betterdocs-tab-items ${activeTab === tab.type ? 'active' : ''}`}
										onClick={() => setActiveTab(tab.type)}
									>
										{tab.icon && <span className="tab-icon">{tab.icon}</span>}
										<span>{tab.label}</span>
									</div>
								}
							})}
						</div>
						<div className="betterdocs-search-items-wrapper betterdocs-search-tab-content-wrapper">
							{status === 'loading' ? (
								<div className="betterdocs-search-skeleton" aria-busy="true" aria-live="polite">
									{[0, 1, 2, 3, 4].map(i => (
										<div className="betterdocs-search-skeleton-row" key={i}>
											<div className="skeleton-icon" />
											<div className="skeleton-lines">
												<div className="skeleton-line skeleton-line-title" />
												<div className="skeleton-line skeleton-line-meta" />
											</div>
										</div>
									))}
								</div>
							) : filterResults(activeTab).length > 0 ? (
								filterResults(activeTab).map((result, index) => (
									<div className="betterdocs-search-item-content" key={result.permalink || index}>
										<div className="betterdocs-search-item-list">
											<div className="content-main">
												<DocsIcon />
												{result.permalink && result.post_type === 'docs' ? (
													<a className="hasperma" href={result.permalink}>
														<h4>{decodeHtmlEntities(result.title)}</h4>
													</a>
												) : (
													<h4>{decodeHtmlEntities(result.title)}</h4>
												)}
											</div>
											{result.post_type === 'betterdocs_faq' && (
												<ExpandableContent content={result.content} wordLimit={30} />
											)}
											{result.post_type === 'docs' && (
												<div className="content-sub">
													<FolderIcon />
													<h5>{result.taxonomies && result.taxonomies.length > 0 ? decodeHtmlEntities(result.taxonomies) : 'No taxonomy'}</h5>
												</div>
											)}
										</div>
									</div>
								))
							) : (status === 'empty' || status === 'error') && (
								<div className="betterdocs-search-items-not-found">
									<NoResultIcon />
									<h4>{activeTab === 'docs' ? searchNotFoundText : __('No FAQ found for', 'betterdocs')} "{searchQuery}"</h4>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchModal;
