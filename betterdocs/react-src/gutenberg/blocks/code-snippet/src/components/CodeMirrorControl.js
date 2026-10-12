import { __ } from '@wordpress/i18n';
import { BaseControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';

import './codemirror.scss';

/**
 * CodeMirror Control Component for Gutenberg
 *
 * Uses WordPress's built-in wp.codeEditor API which wraps CodeMirror
 */
const CodeMirrorControl = ({
    label,
    value,
    onChange,
    placeholder = '',
    help = '',
    rows = 15
}) => {
    const textareaRef = useRef(null);
    const editorRef = useRef(null);
    const isInitialized = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isCodeMirrorReady, setIsCodeMirrorReady] = useState(false);

    // Note: Language mode mapping removed since we use plain text mode for editor

    // Initialize CodeMirror with retry mechanism
    useEffect(() => {
        if (!textareaRef.current || isInitialized.current) {
            return;
        }

        const initializeCodeMirror = () => {
            // Check if wp.codeEditor is available
            if (typeof window.wp === 'undefined' ||
                typeof window.wp.codeEditor === 'undefined' ||
                typeof window.wp.codeEditor.initialize !== 'function') {
                console.warn('WordPress CodeEditor not available. Retrying...');
                return false;
            }

            // Check if CodeMirror is available
            if (typeof window.CodeMirror === 'undefined') {
                console.warn('CodeMirror library not loaded. Retrying...');
                return false;
            }

            console.log('Initializing CodeMirror for plain text editing (no syntax highlighting)');

            // CodeMirror settings - plain text mode for editor
            const settings = {
                codemirror: {
                    mode: 'text/plain', // Always use plain text mode
                    lineNumbers: true,
                    lineWrapping: true,
                    indentUnit: 4,
                    tabSize: 4,
                    indentWithTabs: false,
                    matchBrackets: false, // Disable bracket matching
                    autoCloseBrackets: false, // Disable auto-closing brackets
                    foldGutter: false, // Disable code folding
                    gutters: ['CodeMirror-linenumbers'], // Only line numbers
                    extraKeys: {
                        'Ctrl-Space': 'autocomplete',
                        'Tab': function(cm) {
                            if (cm.somethingSelected()) {
                                cm.indentSelection('add');
                            } else {
                                cm.replaceSelection('    ', 'end');
                            }
                        },
                        'Shift-Tab': function(cm) {
                            cm.indentSelection('subtract');
                        }
                    },
                    theme: 'default',
                    placeholder: placeholder
                }
            };

            try {
                // Initialize CodeMirror
                const editorInstance = window.wp.codeEditor.initialize(textareaRef.current, settings);
                editorRef.current = editorInstance;
                isInitialized.current = true;
                setIsLoading(false);
                setHasError(false);
                setIsCodeMirrorReady(true);

                // Hide the original textarea
                if (textareaRef.current) {
                    textareaRef.current.style.display = 'none';
                }

                // Set initial value
                if (value) {
                    editorInstance.codemirror.setValue(value);
                }

                // Listen for changes
                editorInstance.codemirror.on('change', (cm) => {
                    onChange(cm.getValue());
                });

                // Focus handling
                editorInstance.codemirror.on('focus', () => {
                    const control = textareaRef.current?.closest('.components-base-control');
                    if (control) {
                        control.classList.add('is-focused');
                    }
                });

                editorInstance.codemirror.on('blur', () => {
                    const control = textareaRef.current?.closest('.components-base-control');
                    if (control) {
                        control.classList.remove('is-focused');
                    }
                });

                // Refresh CodeMirror to ensure proper rendering
                setTimeout(() => {
                    if (editorInstance.codemirror) {
                        editorInstance.codemirror.refresh();
                    }
                }, 100);

                console.log('CodeMirror initialized successfully in plain text mode');
                return true;

            } catch (error) {
                console.error('Failed to initialize CodeMirror:', error);
                setHasError(true);
                setIsLoading(false);
                setIsCodeMirrorReady(false);
                return false;
            }
        };

        // Try to initialize immediately
        if (!initializeCodeMirror()) {
            // If failed, retry after a short delay
            const retryTimeout = setTimeout(() => {
                if (!isInitialized.current) {
                    if (!initializeCodeMirror()) {
                        // Final fallback - show error state and show textarea
                        setIsLoading(false);
                        setHasError(true);
                        setIsCodeMirrorReady(false);
                        if (textareaRef.current) {
                            textareaRef.current.style.display = 'block';
                        }
                        console.warn('CodeMirror failed to initialize after retry. Using plain textarea.');
                    }
                }
            }, 1000);

            return () => clearTimeout(retryTimeout);
        }

        // Cleanup function
        return () => {
            if (editorRef.current && editorRef.current.codemirror) {
                try {
                    editorRef.current.codemirror.toTextArea();
                } catch (error) {
                    console.warn('Error during CodeMirror cleanup:', error);
                }
                editorRef.current = null;
                isInitialized.current = false;
                setIsCodeMirrorReady(false);
                // Show textarea again if CodeMirror is destroyed
                if (textareaRef.current) {
                    textareaRef.current.style.display = 'block';
                }
            }
        };
    }, []); // Only run once on mount

    // Note: Language mode updates removed since we use plain text mode

    // Update value when prop changes (external updates)
    useEffect(() => {
        if (editorRef.current && editorRef.current.codemirror && isInitialized.current) {
            const currentValue = editorRef.current.codemirror.getValue();
            if (currentValue !== value) {
                editorRef.current.codemirror.setValue(value || '');
            }
        }
    }, [value]);

    return (
        <BaseControl
            label={label}
            help={help || (hasError ? __('CodeMirror failed to load. Using plain textarea.', 'betterdocs') : '')}
            className={`betterdocs-codemirror-control ${isLoading ? 'is-loading' : ''} ${hasError ? 'has-error' : ''} ${isCodeMirrorReady ? 'is-codemirror-ready' : ''}`}
        >
            {isLoading && (
                <div className="codemirror-loading">
                    <span>{__('Loading code editor...', 'betterdocs')}</span>
                </div>
            )}
            <textarea
                ref={textareaRef}
                defaultValue={value || ''}
                placeholder={placeholder}
                rows={rows}
                onChange={(e) => {
                    // Fallback for when CodeMirror is not available
                    if (!isInitialized.current) {
                        onChange(e.target.value);
                    }
                }}
                style={{
                    width: '100%',
                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical',
                    minHeight: '200px',
                    display: (isLoading || (!isCodeMirrorReady && hasError)) ? 'block' : 'none'
                }}
            />
        </BaseControl>
    );
};

export default CodeMirrorControl;
