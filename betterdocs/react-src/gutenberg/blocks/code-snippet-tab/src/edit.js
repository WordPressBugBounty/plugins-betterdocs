import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';

import Inspector from './inspector';
import Style from '../../code-snippet/src/style';

const DEFAULT_CODE_PLACEHOLDER = `{\n  "success": true\n}`;

// First digit of the status → the `--Nxx` colour bucket.
const statusClass = (status) => {
    const s = String(status || '').trim();
    return /^[0-9]/.test(s) ? `betterdocs-api-response--${s[0]}xx` : '';
};

const Edit = (props) => {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const {
        blockId,
        responses = [],
        showCopyButton,
        showHeader,
        showLineNumbers,
        theme,
    } = attributes;

    const tabs = responses.filter((r) => r && (r.codeContent || '').length >= 0);
    const [activeIndex, setActiveIndex] = useState(0);
    const safeIndex = activeIndex < tabs.length ? activeIndex : 0;
    const active = tabs[safeIndex] || { status: '', language: 'json', codeContent: '' };

    useEffect(() => {
        const BLOCK_PREFIX = 'betterdocs-code-snippet-tab';
        if (!blockId) {
            setAttributes({ blockId: BLOCK_PREFIX + '-' + clientId.substr(0, 8) });
        }
    }, []);

    const blockRef = useRef(null);
    const blockProps = useBlockProps({
        className: `betterdocs-code-snippet-tab-block ${blockId}`,
        ref: blockRef,
    });

    const activeLanguage = active.language || 'json';
    const displayContent = active.codeContent || DEFAULT_CODE_PLACEHOLDER;

    // Editor-preview syntax highlighting (iframe-safe theme CSS injection),
    // mirroring the Code Snippet block.
    useEffect(() => {
        if (!blockRef.current) return;

        const hljsConfig = window.BetterDocsCodeSnippetTabConfig || window.BetterDocsCodeSnippetConfig || {};

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

        const loadHighlightJS = () => new Promise((resolve) => {
            if (window.hljs) return resolve(window.hljs);
            if (!hljsConfig.hljsUrl) return resolve(null);
            if (!document.getElementById('betterdocs-hljs-script')) {
                const script = document.createElement('script');
                script.id = 'betterdocs-hljs-script';
                script.src = hljsConfig.hljsUrl;
                script.onload = () => window.hljs && resolve(window.hljs);
                document.head.appendChild(script);
            } else {
                const checkHljs = () => (window.hljs ? resolve(window.hljs) : setTimeout(checkHljs, 100));
                checkHljs();
            }
        });

        const applyHighlighting = async () => {
            try {
                const codeElement = blockRef.current?.querySelector('.betterdocs-code-snippet-panel.is-active .betterdocs-code-snippet-code')
                    || blockRef.current?.querySelector('.betterdocs-code-snippet-code');
                ensureThemeCss(codeElement ? codeElement.ownerDocument : document);
                const hljs = await loadHighlightJS();
                if (codeElement && hljs) {
                    codeElement.removeAttribute('data-highlighted');
                    codeElement.className = `betterdocs-code-snippet-code language-${activeLanguage}`;
                    const codeInner = codeElement.querySelector('code');
                    if (codeInner) codeInner.textContent = displayContent;
                    hljs.highlightElement(codeElement);
                }
            } catch (error) {
                console.warn('Failed to apply syntax highlighting:', error);
            }
        };

        const timeoutId = setTimeout(applyHighlighting, 100);
        return () => clearTimeout(timeoutId);
    }, [displayContent, activeLanguage, theme, showLineNumbers, safeIndex]);

    return (
        <>
            {isSelected && <Inspector {...props} />}
            <Style {...props} />
            <div {...blockProps}>
                <div className={`betterdocs-code-snippet-wrapper betterdocs-code-snippet-tab theme-${theme} ${blockId} is-multi-tab`}
                     data-language={activeLanguage}
                     data-copy-button={showCopyButton ? 'true' : 'false'}>
                    {showHeader && (
                        <div className="betterdocs-code-snippet-header betterdocs-file-preview-header betterdocs-code-snippet-tab-header">
                            <div className="betterdocs-file-preview-left">
                                <div className="betterdocs-code-snippet-tabs" role="tablist">
                                    {tabs.map((tab, i) => (
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                                        <button
                                            key={i}
                                            type="button"
                                            className={`betterdocs-code-snippet-tab-item${i === safeIndex ? ' is-active' : ''} ${statusClass(tab.status)}`}
                                            role="tab"
                                            aria-selected={i === safeIndex}
                                            onClick={() => setActiveIndex(i)}
                                        >
                                            <span className={`betterdocs-code-snippet-tab-dot ${statusClass(tab.status)}`}></span>
                                            <span className="betterdocs-code-snippet-tab-label">{tab.status || (i + 1)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="betterdocs-file-preview-right">
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
                        {showLineNumbers && (
                            <div className="betterdocs-code-snippet-line-numbers" aria-hidden="true">
                                {displayContent.split('\n').map((_, index) => (
                                    <div key={index} className="line-number">{index + 1}</div>
                                ))}
                            </div>
                        )}
                        <div className="betterdocs-code-snippet-panel is-active">
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
