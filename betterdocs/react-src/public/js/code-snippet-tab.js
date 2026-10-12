/**
 * BetterDocs Code Snippet Tab Frontend JavaScript
 *
 * Reuses the Code Snippet shell (wrapper / panels / copy button) but switches
 * panels via a row of HTTP-status tabs instead of a language dropdown. Handles
 * self-hosted highlight.js + copy-to-clipboard, scoped to
 * `.betterdocs-code-snippet-tab` wrappers so it stays independent of the Code
 * Snippet script (either may be absent on a given page).
 */

(function () {
    'use strict';

    window.BetterDocsCodeSnippetTab = window.BetterDocsCodeSnippetTab || {};

    const localConfig = window.BetterDocsCodeSnippetTabConfig || window.BetterDocsCodeSnippetConfig || {};
    const config = {
        highlightJsUrl: localConfig.hljsUrl || '',
        highlightJsCssLight: localConfig.cssLight || '',
        highlightJsCssDark: localConfig.cssDark || '',
        copySuccessTimeout: 2000
    };

    let highlightJsLoaded = false;
    let highlightJsLoading = false;

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function () {
            console.warn('BetterDocs Code Snippet Tab: Failed to load script:', src);
            if (callback) callback(false);
        };
        document.head.appendChild(script);
    }

    function loadStylesheet(href) {
        if (!href || document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    function loadHighlightJs(callback) {
        if (highlightJsLoaded || window.hljs) {
            highlightJsLoaded = true;
            if (callback) callback(true);
            return;
        }
        if (highlightJsLoading) {
            const checkLoaded = setInterval(function () {
                if (highlightJsLoaded || !highlightJsLoading) {
                    clearInterval(checkLoaded);
                    if (callback) callback(highlightJsLoaded);
                }
            }, 100);
            return;
        }
        if (!config.highlightJsUrl) {
            if (callback) callback(false);
            return;
        }

        highlightJsLoading = true;

        const wrappers = document.querySelectorAll('.betterdocs-code-snippet-tab');
        let hasDark = false;
        let hasLight = false;
        wrappers.forEach(function (w) {
            if (w.classList.contains('theme-dark')) hasDark = true;
            if (w.classList.contains('theme-light')) hasLight = true;
        });
        if (hasDark) loadStylesheet(config.highlightJsCssDark);
        if (hasLight) loadStylesheet(config.highlightJsCssLight);

        loadScript(config.highlightJsUrl, function (success) {
            highlightJsLoading = false;
            highlightJsLoaded = !!(success && window.hljs);
            if (callback) callback(highlightJsLoaded);
        });
    }

    function applySyntaxHighlighting() {
        if (!window.hljs) return;
        // Highlight the inner <code>, not the <pre>: hljs replaces the innerHTML
        // of whatever it is handed, and eating the <code> breaks the copy button.
        const codeBlocks = document.querySelectorAll('.betterdocs-code-snippet-tab .betterdocs-code-snippet-code > code:not(.hljs)');
        codeBlocks.forEach(function (block) {
            try {
                window.hljs.highlightElement(block);
            } catch (error) {
                console.warn('BetterDocs Code Snippet Tab: Error highlighting code block:', error);
            }
        });
    }

    function copyToClipboard(text, callback) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                if (callback) callback(true);
            }).catch(function () {
                fallbackCopyToClipboard(text, callback);
            });
        } else {
            fallbackCopyToClipboard(text, callback);
        }
    }

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
            if (callback) callback(false);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function getTooltip(button) {
        const container = button.closest('.betterdocs-code-snippet-copy-container');
        return container ? container.querySelector('.betterdocs-code-snippet-tooltip') : null;
    }

    /**
     * Flip the button into a transient state ("copied" / "error") and back.
     * Class + text driven, so repeated clicks can't corrupt the icon markup.
     */
    function flashState(button, state, label) {
        const tooltip = getTooltip(button);

        clearTimeout(button._betterDocsResetTimer);

        button.classList.remove('is-copied', 'is-error');
        button.classList.add(state);

        if (tooltip) {
            tooltip.textContent = label;
            tooltip.classList.add('show', state);
        }

        button._betterDocsResetTimer = setTimeout(function () {
            button.classList.remove('is-copied', 'is-error');
            if (tooltip) {
                tooltip.textContent = tooltip.dataset.copyLabel || 'Copy';
                tooltip.classList.remove('is-copied', 'is-error');
                if (!button.matches(':hover') && !button.matches(':focus-visible')) {
                    tooltip.classList.remove('show');
                }
            }
        }, config.copySuccessTimeout);
    }

    function showCopySuccess(button) {
        const tooltip = getTooltip(button);
        flashState(button, 'is-copied', tooltip ? (tooltip.dataset.copiedLabel || 'Copied!') : '');
    }

    function showCopyError(button) {
        const tooltip = getTooltip(button);
        flashState(button, 'is-error', tooltip ? (tooltip.dataset.errorLabel || 'Copy failed') : '');
    }

    /**
     * Hover/focus tooltip. Placement is pure CSS, so nothing to reposition.
     */
    function initTooltip(button) {
        const tooltip = getTooltip(button);
        if (!tooltip) return;

        const show = function () {
            tooltip.classList.add('show');
        };
        const hide = function () {
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
     * The code element of the currently-active status panel. hljs may have
     * replaced the inner <code>, so accept the <pre> too — same `textContent`.
     */
    function getActiveCodeElement(snippet) {
        const panel = snippet.querySelector('.betterdocs-code-snippet-panel.is-active')
            || snippet.querySelector('.betterdocs-code-snippet-panel')
            || snippet;

        return panel.querySelector('.betterdocs-code-snippet-code code')
            || panel.querySelector('.betterdocs-code-snippet-code');
    }

    function initCopyButton(snippet) {
        const copyButton = snippet.querySelector('.betterdocs-code-snippet-copy-button');
        if (!copyButton) return;

        // The Code Snippet script matches this wrapper too — bind once.
        if (copyButton._betterDocsCopyInitialized) return;
        copyButton._betterDocsCopyInitialized = true;

        initTooltip(copyButton);

        copyButton._betterDocsClickHandler = function (event) {
            event.preventDefault();
            const codeElement = getActiveCodeElement(snippet);
            const codeText = codeElement ? (codeElement.textContent || codeElement.innerText || '') : '';
            if (!codeText.trim()) {
                showCopyError(copyButton);
                return;
            }
            copyToClipboard(codeText, function (success) {
                if (success) {
                    showCopySuccess(copyButton);
                } else {
                    showCopyError(copyButton);
                }
            });
        };
        copyButton.addEventListener('click', copyButton._betterDocsClickHandler);
    }

    /**
     * Switch the active status panel + tab.
     */
    function setActivePanel(snippet, index) {
        const panels = snippet.querySelectorAll('.betterdocs-code-snippet-panel');
        const tabs = snippet.querySelectorAll('.betterdocs-code-snippet-tab-item');

        panels.forEach(function (panel) {
            const isActive = String(panel.dataset.tabIndex) === String(index);
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

        tabs.forEach(function (tab) {
            const isActive = String(tab.dataset.tabIndex) === String(index);
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function initTabs(snippet) {
        const tabs = snippet.querySelectorAll('.betterdocs-code-snippet-tab-item');
        if (!tabs.length || snippet._betterDocsTabsInitialized) return;
        snippet._betterDocsTabsInitialized = true;

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                setActivePanel(snippet, tab.dataset.tabIndex);
            });
        });
    }

    function initializeCodeSnippetTabs() {
        const snippets = document.querySelectorAll('.betterdocs-code-snippet-tab');
        if (snippets.length === 0) return;

        loadHighlightJs(function (loaded) {
            if (loaded) applySyntaxHighlighting();
        });

        snippets.forEach(function (snippet) {
            if (snippet.dataset.copyButton === 'true') {
                initCopyButton(snippet);
            }
            initTabs(snippet);
        });
    }

    window.BetterDocsCodeSnippetTab = {
        init: initializeCodeSnippetTabs,
        reinit: initializeCodeSnippetTabs,
        initCopyButton: initCopyButton,
        applySyntaxHighlighting: applySyntaxHighlighting,
        loadHighlightJs: loadHighlightJs
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCodeSnippetTabs);
    } else {
        initializeCodeSnippetTabs();
    }

    if (window.MutationObserver) {
        const observer = new MutationObserver(function (mutations) {
            let shouldReinit = false;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('betterdocs-code-snippet-tab')) {
                                shouldReinit = true;
                            } else if (node.querySelector && node.querySelector('.betterdocs-code-snippet-tab')) {
                                shouldReinit = true;
                            }
                        }
                    });
                }
            });
            if (shouldReinit) setTimeout(initializeCodeSnippetTabs, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
