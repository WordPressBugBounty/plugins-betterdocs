import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';

import Inspector from './inspector';
import Style from './style';
import { DEFAULT_CODE_PLACEHOLDER, LANGUAGE_OPTIONS } from './constants';

const Edit = (props) => {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const {
        blockId,
        blockMeta,
        codeContent,
        language,
        codeVariants = [],
        showCopyButton,
        showHeader,
        showLineNumbers,
        theme,
        resOption,
        fileName,
        showFileIcon,
        fileIcon,
        showTrafficLights,
    } = attributes;

    // Combined language list: the primary language/code first, then each
    // non-empty variant. One entry → single-language (as before); more → the
    // header shows a language dropdown to switch the previewed panel.
    const variants = [
        { language, codeContent, fileName },
        ...codeVariants.filter((v) => v && (v.codeContent || '').length > 0),
    ];
    const isMulti = variants.length > 1;

    const [activeIndex, setActiveIndex] = useState(0);
    const [langOpen, setLangOpen] = useState(false);
    const safeIndex = activeIndex < variants.length ? activeIndex : 0;
    const active = variants[safeIndex] || { language, codeContent, fileName };
    const languageLabel = (lang) =>
        (LANGUAGE_OPTIONS.find((o) => o.value === lang) || {}).label || lang;

    // Set unique block ID
    useEffect(() => {
        const BLOCK_PREFIX = 'betterdocs-code-snippet';
        if (!blockId) {
            setAttributes({ blockId: BLOCK_PREFIX + '-' + clientId.substr(0, 8) });
        }
    }, []);

    // Set block meta
    useEffect(() => {
        setAttributes({
            blockMeta: {
                desktop: resOption === 'Desktop' ? true : false,
                tab: resOption === 'Tablet' ? true : false,
                mobile: resOption === 'Mobile' ? true : false,
            },
        });
    }, [resOption]);

    const blockRef = useRef(null);

    const blockProps = useBlockProps({
        className: `betterdocs-code-snippet-block ${blockId}`,
        ref: blockRef
    });

    // Editor-side preview of the copy button: hover tooltip + "Copied!" state,
    // matching the frontend. Placement and the icon swap are handled by CSS
    // (`.show` / `.is-copied`), so this only toggles classes and label text.
    useEffect(() => {
        if (!blockRef.current) return;

        const copyButton = blockRef.current.querySelector('.betterdocs-code-snippet-copy-button');
        const tooltip = blockRef.current.querySelector('.betterdocs-code-snippet-tooltip');

        if (!copyButton || !tooltip) return;

        let resetTimer;

        const showTooltip = () => tooltip.classList.add('show');
        const hideTooltip = () => {
            if (copyButton.classList.contains('is-copied')) return;
            tooltip.classList.remove('show');
        };

        const handleCopyClick = () => {
            clearTimeout(resetTimer);
            copyButton.classList.add('is-copied');
            tooltip.textContent = __('Copied!', 'betterdocs');
            tooltip.classList.add('show', 'is-copied');

            resetTimer = setTimeout(() => {
                copyButton.classList.remove('is-copied');
                tooltip.textContent = __('Copy', 'betterdocs');
                tooltip.classList.remove('is-copied');
                if (!copyButton.matches(':hover')) {
                    tooltip.classList.remove('show');
                }
            }, 2000);
        };

        copyButton.addEventListener('mouseenter', showTooltip);
        copyButton.addEventListener('mouseleave', hideTooltip);
        copyButton.addEventListener('blur', hideTooltip);
        copyButton.addEventListener('click', handleCopyClick);

        return () => {
            clearTimeout(resetTimer);
            copyButton.removeEventListener('mouseenter', showTooltip);
            copyButton.removeEventListener('mouseleave', hideTooltip);
            copyButton.removeEventListener('blur', hideTooltip);
            copyButton.removeEventListener('click', handleCopyClick);
        };
    }, [showCopyButton, showHeader, showTrafficLights, showFileIcon]);

    const activeLanguage = active.language || 'javascript';
    const displayContent = active.codeContent || DEFAULT_CODE_PLACEHOLDER;

    // Initialize syntax highlighting for editor preview
    useEffect(() => {
        if (!blockRef.current) return;

        // Highlight.js is bundled with the plugin (self-hosted, no CDN); URLs
        // come from the localized config in CodeSnippet::register_scripts().
        const hljsConfig = window.BetterDocsCodeSnippetConfig || {};

        // (Re)apply the theme CSS into the SAME document as the block. The editor
        // renders block previews inside an iframe, so the top document's <head>
        // would NOT style the iframe's code — this is what makes the editor's
        // dark colors identical to the frontend.
        const ensureThemeCss = (doc) => {
            const themeHref = theme === 'dark' ? hljsConfig.cssDark : hljsConfig.cssLight;
            if (!themeHref || !doc || !doc.head) return;

            const existing = doc.getElementById('betterdocs-hljs-theme');
            if (existing && existing.getAttribute('href') === themeHref) return;
            if (existing) existing.remove();

            const link = doc.createElement('link');
            link.id = 'betterdocs-hljs-theme';
            link.rel = 'stylesheet';
            link.href = themeHref;
            doc.head.appendChild(link);
        };

        const loadHighlightJS = () => {
            return new Promise((resolve) => {
                if (window.hljs) {
                    resolve(window.hljs);
                    return;
                }

                if (!hljsConfig.hljsUrl) {
                    // No bundled URL — resolve without highlighting rather than hit a CDN.
                    resolve(null);
                    return;
                }

                // The hljs library is a global — load it once in the top document.
                if (!document.getElementById('betterdocs-hljs-script')) {
                    const script = document.createElement('script');
                    script.id = 'betterdocs-hljs-script';
                    script.src = hljsConfig.hljsUrl;
                    script.onload = () => {
                        if (window.hljs) {
                            resolve(window.hljs);
                        }
                    };
                    document.head.appendChild(script);
                } else {
                    // Script already exists, wait for it to load
                    const checkHljs = () => {
                        if (window.hljs) {
                            resolve(window.hljs);
                        } else {
                            setTimeout(checkHljs, 100);
                        }
                    };
                    checkHljs();
                }
            });
        };

        const applyHighlighting = async () => {
            try {
                const codeElement = blockRef.current?.querySelector('.betterdocs-code-snippet-code');

                // Theme CSS must live in the block's document (iframe-safe).
                ensureThemeCss(codeElement ? codeElement.ownerDocument : document);

                const hljs = await loadHighlightJS();

                if (codeElement && hljs) {
                    // "cURL" has no highlight.js grammar — alias it to bash.
                    try {
                        if (hljs.registerAliases) {
                            hljs.registerAliases('curl', { languageName: 'bash' });
                        }
                    } catch (e) {}

                    // Clear any existing highlighting
                    codeElement.removeAttribute('data-highlighted');
                    codeElement.className = `betterdocs-code-snippet-code language-${activeLanguage}`;

                    // Clear existing highlighted content
                    const codeInner = codeElement.querySelector('code');
                    if (codeInner) {
                        codeInner.innerHTML = displayContent;
                    }

                    // Apply new highlighting
                    hljs.highlightElement(codeElement);
                }
            } catch (error) {
                console.warn('Failed to load or apply syntax highlighting:', error);
            }
        };

        // Small delay to ensure DOM is updated
        const timeoutId = setTimeout(applyHighlighting, 100);

        return () => clearTimeout(timeoutId);
    }, [displayContent, activeLanguage, theme, showLineNumbers, safeIndex]);

    // Get file icon based on language
    const getLanguageIcon = (lang) => {
        const icons = {
            'javascript': '📄',
            'typescript': '📘',
            'jsx': '⚛️',
            'tsx': '⚛️',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'sass': '🎨',
            'less': '🎨',
            'php': '🐘',
            'python': '🐍',
            'java': '☕',
            'csharp': '🔷',
            'cpp': '⚙️',
            'c': '⚙️',
            'ruby': '💎',
            'go': '🐹',
            'rust': '🦀',
            'swift': '🦉',
            'kotlin': '🎯',
            'sql': '🗃️',
            'json': '📋',
            'yaml': '📋',
            'xml': '📄',
            'markdown': '📝',
            'curl': '💻',
            'bash': '💻',
            'shell': '💻',
            'powershell': '💻',
            'dockerfile': '🐳',
        };
        return icons[lang] || '📄';
    };

    return (
        <>
            {isSelected && <Inspector {...props} />}
            <Style {...props} />
            <div {...blockProps}>
                <div className={`betterdocs-code-snippet-wrapper theme-${theme} ${blockId}${isMulti ? ' is-multi-lang' : ''}`}
                     data-language={activeLanguage}
                     data-copy-button={showCopyButton ? 'true' : 'false'}>
                    {showHeader && (
                        <div className="betterdocs-code-snippet-header betterdocs-file-preview-header">
                        <div className="betterdocs-file-preview-left">
                            {showTrafficLights && (
                                <div className="betterdocs-traffic-lights">
                                    <span className="traffic-light traffic-light-red"></span>
                                    <span className="traffic-light traffic-light-yellow"></span>
                                    <span className="traffic-light traffic-light-green"></span>
                                </div>
                            )}

                            {!isMulti && (
                                <div className="betterdocs-file-info">
                                    {showFileIcon && (
                                        <div className="betterdocs-file-icon">
                                            {fileIcon ? (
                                                <img src={fileIcon} alt={__('File icon', 'betterdocs')} />
                                            ) : (
                                                <span className="betterdocs-file-icon-emoji">{getLanguageIcon(activeLanguage)}</span>
                                            )}
                                        </div>
                                    )}

                                    {active.fileName && (
                                        <div className="betterdocs-file-name">
                                            <span className="file-name-text">{active.fileName}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="betterdocs-file-preview-right">
                            {isMulti && (
                                <div className={`betterdocs-code-lang-dropdown${langOpen ? ' is-open' : ''}`}>
                                    <button
                                        type="button"
                                        className="betterdocs-code-lang-toggle"
                                        onClick={() => setLangOpen(! langOpen)}
                                        aria-haspopup="listbox"
                                        aria-expanded={langOpen}
                                    >
                                        <span className="betterdocs-code-lang-current">
                                            {showFileIcon && (
                                                <span className="betterdocs-file-icon-emoji">{getLanguageIcon(activeLanguage)}</span>
                                            )}
                                            <span className="betterdocs-code-lang-label">{languageLabel(activeLanguage)}</span>
                                        </span>
                                        <svg className="betterdocs-code-lang-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <ul className="betterdocs-code-lang-menu" role="listbox">
                                        {variants.map((v, i) => (
                                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                                            <li
                                                key={i}
                                                className={`betterdocs-code-lang-option${i === safeIndex ? ' is-active' : ''}`}
                                                role="option"
                                                aria-selected={i === safeIndex}
                                                onClick={() => { setActiveIndex(i); setLangOpen(false); }}
                                            >
                                                {showFileIcon && (
                                                    <span className="betterdocs-file-icon-emoji">{getLanguageIcon(v.language)}</span>
                                                )}
                                                <span className="betterdocs-code-lang-label">{languageLabel(v.language)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {showCopyButton && (
                                <div className="betterdocs-code-snippet-copy-container">
                                    <button className="betterdocs-code-snippet-copy-button" type="button" aria-label={__('Copy code to clipboard', 'betterdocs')}>
                                        <span className="betterdocs-code-snippet-copy-icon" aria-hidden="true">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="12.5" height="12.5" rx="3" stroke="currentColor" strokeWidth="1.7"/>
                                                <path d="M15.5 5.75V5A2.5 2.5 0 0 0 13 2.5H5A2.5 2.5 0 0 0 2.5 5v8A2.5 2.5 0 0 0 5 15.5h.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <span className="betterdocs-code-snippet-copied-icon" aria-hidden="true">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6.5 9.5 17 4 11.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </button>
                                    <span className="betterdocs-code-snippet-tooltip" role="status" data-copy-label={__('Copy', 'betterdocs')} data-copied-label={__('Copied!', 'betterdocs')} data-error-label={__('Copy failed', 'betterdocs')}>{__('Copy', 'betterdocs')}</span>
                                </div>
                            )}
                        </div>
                        </div>
                    )}
                    <div className="betterdocs-code-snippet-content">
                        {/* The flex row (line numbers + code) lives on the panel,
                            mirroring views/templates/parts/code-snippet.php. Without
                            this wrapper `.content` stays display:block and the code
                            stacks below the line numbers — rendering blank in the
                            iframed editor canvas. */}
                        <div className="betterdocs-code-snippet-panel is-active">
                            {showLineNumbers && (
                                <div className="betterdocs-code-snippet-line-numbers" aria-hidden="true">
                                    {displayContent.split('\n').map((_, index) => (
                                        <div key={index} className="line-number">
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <pre className={`betterdocs-code-snippet-code language-${activeLanguage}`}>
                                {displayContent}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
