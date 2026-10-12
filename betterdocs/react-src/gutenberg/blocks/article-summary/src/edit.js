import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";

import Inspector from "./inspector";
import Style from "./style";

const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const {
        blockId,
        customTitle,
        showTitle,
        iconSize,
    } = attributes;

    // Set unique block ID
    useEffect(() => {
        if (!blockId) {
            setAttributes({ blockId: `betterdocs-article-summary-${clientId}` });
        }
    }, [clientId, blockId, setAttributes]);

    const blockProps = useBlockProps({
        className: `betterdocs-article-summary ${blockId || ''}`,
    });

    // Determine title text
    const titleText = customTitle || __("Doc Summary", "betterdocs");

    return (
        <>
            <Inspector {...props} />
            <Style attributes={attributes} setAttributes={setAttributes} clientId={clientId} />

            <div {...blockProps} id="betterdocs-article-summary" data-post-id="1" data-post-type="docs" className={`${blockProps.className} betterdocs-editor-mode`}>
                {showTitle && (
                    <div className="betterdocs-summary-header" id="betterdocs-summary-toggle">
                        <span className="betterdocs-summary-title">
                            <img
                                src="/wp-content/plugins/betterdocs/assets/images/ai-summary-icon.svg"
                                alt={__("AI Article Summary", "betterdocs")}
                            />
                            {titleText}
                            <span className="betterdocs-summary-arrow">
                                <svg
                                    className="angle-icon angle-right"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ display: "none" }}
                                >
                                    <path d="M6 9L12 15L18 9" stroke="#98A2B3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <svg
                                    className="angle-icon angle-down"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18 15L12 9L6 15" stroke="#98A2B3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </span>
                    </div>
                )}

                <div className="betterdocs-summary-content" id="betterdocs-summary-content" style={{ display: "block" }}>
                    <div className="betterdocs-summary-loading" id="betterdocs-summary-loading" style={{ display: "none" }}>
                        <img
                            src="../../../../../assets/static/images/thinking-icon.svg"
                            alt={__("Doc Summarizer Thinking", "betterdocs")}
                        />
                        <span className="betterdocs-thinking-text">
                            {__("Thinking", "betterdocs")}<span className="betterdocs-thinking-dots"></span>
                        </span>
                    </div>
                    <div className="betterdocs-summary-text" id="betterdocs-summary-text">
                        <div className="betterdocs-summary-preview">
                            <p>
                                {__(
                                    "This is a preview of the Doc Summarizer block. The actual AI-generated summary will appear here when viewed on the frontend.",
                                    "betterdocs"
                                )}
                            </p>
                            <p>
                                {__(
                                    "The summary will be automatically generated based on the article content using OpenAI technology.",
                                    "betterdocs"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
