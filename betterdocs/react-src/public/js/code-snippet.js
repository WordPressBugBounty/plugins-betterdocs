/**
 * BetterDocs Code Snippet Frontend JavaScript
 * Handles syntax highlighting and copy-to-clipboard functionality
 */

(function() {
    'use strict';

    // Global namespace
    window.BetterDocsCodeSnippet = window.BetterDocsCodeSnippet || {};

    // Configuration. Highlight.js is bundled with the plugin (self-hosted, no
    // CDN); URLs come from the localized config set in CodeSnippet::register_scripts().
    const localConfig = window.BetterDocsCodeSnippetConfig || {};
    const config = {
        highlightJsUrl: localConfig.hljsUrl || '',
        highlightJsCssLight: localConfig.cssLight || '',
        highlightJsCssDark: localConfig.cssDark || '',
        copySuccessTimeout: 2000,
        retryAttempts: 3,
        retryDelay: 1000
    };

    // State management
    let highlightJsLoaded = false;
    let highlightJsLoading = false;
    let copyButtonsInitialized = false;

    /**
     * Utility function to load external scripts
     */
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.warn('BetterDocs Code Snippet: Failed to load script:', src);
            if (callback) callback(false);
        };
        document.head.appendChild(script);
    }

    /**
     * Utility function to load external stylesheets
     */
    function loadStylesheet(href) {
        // Check if stylesheet is already loaded
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onerror = function() {
            console.warn('BetterDocs Code Snippet: Failed to load stylesheet:', href);
        };
        document.head.appendChild(link);
    }

    /**
     * Load Highlight.js library and CSS
     */
    function loadHighlightJs(callback) {
        if (highlightJsLoaded) {
            if (callback) callback(true);
            return;
        }

        if (highlightJsLoading) {
            // Wait for current loading to complete
            const checkLoaded = setInterval(function() {
                if (highlightJsLoaded || !highlightJsLoading) {
                    clearInterval(checkLoaded);
                    if (callback) callback(highlightJsLoaded);
                }
            }, 100);
            return;
        }

        // No bundled URL available — skip highlighting rather than request a CDN.
        if (!config.highlightJsUrl) {
            if (callback) callback(false);
            return;
        }

        highlightJsLoading = true;

        // Load CSS based on theme
        const darkThemeSnippets = document.querySelectorAll('.betterdocs-code-snippet-wrapper.theme-dark');
        const lightThemeSnippets = document.querySelectorAll('.betterdocs-code-snippet-wrapper.theme-light');

        if (darkThemeSnippets.length > 0) {
            loadStylesheet(config.highlightJsCssDark);
        }
        if (lightThemeSnippets.length > 0) {
            loadStylesheet(config.highlightJsCssLight);
        }

        // Load Highlight.js
        loadScript(config.highlightJsUrl, function(success) {
            highlightJsLoading = false;
            if (success && window.hljs) {
                highlightJsLoaded = true;
                console.log('BetterDocs Code Snippet: Highlight.js loaded successfully');
            } else {
                console.warn('BetterDocs Code Snippet: Failed to load Highlight.js');
            }
            if (callback) callback(highlightJsLoaded);
        });
    }

    /**
     * Apply syntax highlighting to code blocks
     */
    function applySyntaxHighlighting() {
        if (!highlightJsLoaded || !window.hljs) {
            return;
        }

        // "cURL" is a first-class language choice but highlight.js has no curl
        // grammar — alias it to bash so `language-curl` still highlights.
        try {
            if (window.hljs.registerAliases) {
                window.hljs.registerAliases('curl', { languageName: 'bash' });
            }
        } catch (e) {}

        // Highlight the inner <code>, not the <pre>. hljs replaces the innerHTML
        // of whatever it is given — pointing it at the <pre> deletes the <code>
        // the copy button reads from, which silently broke copying.
        const codeBlocks = document.querySelectorAll('.betterdocs-code-snippet-code > code:not(.hljs)');

        codeBlocks.forEach(function(block) {
            try {
                window.hljs.highlightElement(block);
            } catch (error) {
                console.warn('BetterDocs Code Snippet: Error highlighting code block:', error);
            }
        });
    }

    /**
     * Copy text to clipboard using modern Clipboard API with fallback
     */
    function copyToClipboard(text, callback) {
        // Modern Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                if (callback) callback(true);
            }).catch(function(error) {
                console.warn('BetterDocs Code Snippet: Clipboard API failed:', error);
                fallbackCopyToClipboard(text, callback);
            });
        } else {
            fallbackCopyToClipboard(text, callback);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    function fallbackCopyToClipboard(text, callback) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        try {
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            if (callback) callback(successful);
        } catch (error) {
            console.warn('BetterDocs Code Snippet: Fallback copy failed:', error);
            if (callback) callback(false);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * The tooltip bubble that belongs to a copy button, if one is rendered.
     */
    function getTooltip(button) {
        const container = button.closest('.betterdocs-code-snippet-copy-container');
        return container ? container.querySelector('.betterdocs-code-snippet-tooltip') : null;
    }

    /**
     * Flip the button into a transient state ("copied" / "error") and back.
     * Purely class + text driven so repeated clicks can't corrupt the markup —
     * the previous implementation swapped `svg.outerHTML` and would bake the
     * tick in permanently if you clicked twice inside its restore window.
     */
    function flashState(button, state, label, duration) {
        const tooltip = getTooltip(button);

        clearTimeout(button._betterDocsResetTimer);

        button.classList.remove('is-copied', 'is-error');
        button.classList.add(state);

        if (tooltip) {
            tooltip.textContent = label;
            tooltip.classList.add('show', state);
        }

        button._betterDocsResetTimer = setTimeout(function() {
            button.classList.remove('is-copied', 'is-error');
            if (tooltip) {
                tooltip.textContent = tooltip.dataset.copyLabel || 'Copy';
                tooltip.classList.remove('is-copied', 'is-error');
                // Only keep it visible while the pointer is still on the button.
                if (!button.matches(':hover') && !button.matches(':focus-visible')) {
                    tooltip.classList.remove('show');
                }
            }
        }, duration);
    }

    function showCopySuccess(button) {
        const tooltip = getTooltip(button);
        flashState(
            button,
            'is-copied',
            tooltip ? (tooltip.dataset.copiedLabel || 'Copied!') : '',
            config.copySuccessTimeout
        );
    }

    function showCopyError(button) {
        const tooltip = getTooltip(button);
        flashState(
            button,
            'is-error',
            tooltip ? (tooltip.dataset.errorLabel || 'Copy failed') : '',
            config.copySuccessTimeout
        );
    }

    /**
     * Show/hide the tooltip on hover + keyboard focus. Placement is pure CSS
     * (absolute, anchored to the container), so there is nothing to reposition
     * on scroll or resize.
     */
    function initTooltip(button) {
        const tooltip = getTooltip(button);
        if (!tooltip) return;

        const show = function() {
            tooltip.classList.add('show');
        };
        const hide = function() {
            // Don't yank a "Copied!" confirmation away the moment the pointer leaves.
            if (button.classList.contains('is-copied') || button.classList.contains('is-error')) {
                return;
            }
            tooltip.classList.remove('show');
        };

        button.addEventListener('mouseenter', show);
        button.addEventListener('focus', show);
        button.addEventListener('mouseleave', hide);
        button.addEventListener('blur', hide);
    }

    /**
     * The code element of the currently-visible language panel (falls back to
     * the first for single-language snippets). Highlight.js can replace the
     * inner <code> with its own markup, so accept the <pre> itself as well —
     * `textContent` is identical either way.
     */
    function getActiveCodeElement(snippet) {
        const panel = snippet.querySelector('.betterdocs-code-snippet-panel.is-active')
            || snippet.querySelector('.betterdocs-code-snippet-panel')
            || snippet;

        return panel.querySelector('.betterdocs-code-snippet-code code')
            || panel.querySelector('.betterdocs-code-snippet-code');
    }

    /**
     * Initialize copy button for a specific snippet
     */
    function initCopyButton(snippet) {
        const copyButton = snippet.querySelector('.betterdocs-code-snippet-copy-button');

        if (!copyButton) {
            return;
        }

        // The Code Snippet Tab wrapper also carries `.betterdocs-code-snippet-wrapper`,
        // so both scripts can reach the same button. Bind once.
        if (copyButton._betterDocsCopyInitialized) {
            return;
        }
        copyButton._betterDocsCopyInitialized = true;

        // Initialize tooltip functionality
        initTooltip(copyButton);

        // Create new click handler
        copyButton._betterDocsClickHandler = function(event) {
            event.preventDefault();

            // Re-query at click time so the copy tracks the active language.
            const codeElement = getActiveCodeElement(snippet);
            const codeText = codeElement ? (codeElement.textContent || codeElement.innerText || '') : '';

            if (!codeText.trim()) {
                console.warn('BetterDocs Code Snippet: no code to copy');
                showCopyError(copyButton);
                return;
            }

            copyToClipboard(codeText, function(success) {
                if (success) {
                    showCopySuccess(copyButton);

                    // Fire custom event
                    const customEvent = new CustomEvent('betterdocs-code-copied', {
                        detail: {
                            snippet: snippet,
                            code: codeText,
                            language: snippet.dataset.language
                        }
                    });
                    document.dispatchEvent(customEvent);
                } else {
                    console.error('BetterDocs Code Snippet: Failed to copy code to clipboard');
                    showCopyError(copyButton);
                }
            });
        };

        // Add event listener
        copyButton.addEventListener('click', copyButton._betterDocsClickHandler);
    }

    /**
     * Switch the active language panel of a multi-language snippet.
     */
    function setActivePanel(snippet, index) {
        const panels = snippet.querySelectorAll('.betterdocs-code-snippet-panel');
        const options = snippet.querySelectorAll('.betterdocs-code-lang-option');

        panels.forEach(function(panel) {
            const isActive = String(panel.dataset.langIndex) === String(index);
            panel.classList.toggle('is-active', isActive);
            if (isActive) {
                panel.removeAttribute('hidden');
                const code = panel.querySelector('.betterdocs-code-snippet-code');
                if (code) {
                    snippet.dataset.language = (code.className.match(/language-([\w-]+)/) || [])[1] || snippet.dataset.language;
                }
            } else {
                panel.setAttribute('hidden', '');
            }
        });

        options.forEach(function(option) {
            option.classList.toggle('is-active', String(option.dataset.langIndex) === String(index));
        });
    }

    /**
     * Wire the Mintlify-style language dropdown for a multi-language snippet.
     */
    function initLanguageDropdown(snippet) {
        const dropdown = snippet.querySelector('.betterdocs-code-lang-dropdown');
        if (!dropdown || dropdown._betterDocsInitialized) {
            return;
        }
        dropdown._betterDocsInitialized = true;

        const toggle = dropdown.querySelector('.betterdocs-code-lang-toggle');
        const current = dropdown.querySelector('.betterdocs-code-lang-current');
        const options = dropdown.querySelectorAll('.betterdocs-code-lang-option');

        const close = function() {
            dropdown.classList.remove('is-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        };

        if (toggle) {
            toggle.addEventListener('click', function(event) {
                event.stopPropagation();
                const willOpen = !dropdown.classList.contains('is-open');
                dropdown.classList.toggle('is-open', willOpen);
                toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            });
        }

        options.forEach(function(option) {
            option.addEventListener('click', function() {
                const index = option.dataset.langIndex;
                setActivePanel(snippet, index);
                // Mirror the chosen option (icon + label) into the toggle.
                if (current) {
                    current.innerHTML = option.innerHTML;
                }
                close();
            });
        });

        // Close on outside click / Escape.
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                close();
            }
        });
        dropdown.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') close();
        });
    }

    /**
     * Initialize all code snippets on the page
     */
    function initializeCodeSnippets() {
        const snippets = document.querySelectorAll('.betterdocs-code-snippet-wrapper');

        if (snippets.length === 0) {
            return;
        }

        // Load Highlight.js if needed
        loadHighlightJs(function(loaded) {
            if (loaded) {
                applySyntaxHighlighting();
            }
        });

        // Initialize copy buttons + language dropdowns
        snippets.forEach(function(snippet) {
            const hasCopyButton = snippet.dataset.copyButton === 'true';
            if (hasCopyButton) {
                initCopyButton(snippet);
            }
            if (snippet.dataset.multiLang === 'true') {
                initLanguageDropdown(snippet);
            }
        });

        copyButtonsInitialized = true;
    }

    /**
     * Re-initialize code snippets (useful for dynamic content)
     */
    function reinitialize() {
        copyButtonsInitialized = false;
        initializeCodeSnippets();
    }

    /**
     * Public API
     */
    window.BetterDocsCodeSnippet = {
        init: initializeCodeSnippets,
        reinit: reinitialize,
        initCopyButton: initCopyButton,
        applySyntaxHighlighting: applySyntaxHighlighting,
        loadHighlightJs: loadHighlightJs
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCodeSnippets);
    } else {
        initializeCodeSnippets();
    }

    // Re-initialize on dynamic content changes (for AJAX-loaded content)
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldReinit = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('betterdocs-code-snippet-wrapper')) {
                                shouldReinit = true;
                            } else if (node.querySelector && node.querySelector('.betterdocs-code-snippet-wrapper')) {
                                shouldReinit = true;
                            }
                        }
                    });
                }
            });

            if (shouldReinit) {
                setTimeout(reinitialize, 100); // Small delay to ensure DOM is stable
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();
