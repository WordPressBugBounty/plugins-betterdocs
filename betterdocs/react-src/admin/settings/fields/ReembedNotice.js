import React from "react";
import { __ } from "@wordpress/i18n";
import { useBuilderContext } from "quickbuilder";
import { platformChanged, embedModelChangedOnly } from "./reembedChange";

/**
 * Compact inline warning rendered directly under the field it relates to (like
 * the AI Content Suite max-token notice), shown the moment the admin changes the
 * AI platform or embedding model — before they save — so the cost/time of the
 * full re-embed is visible up front (the confirm dialog at Save is the second
 * gate). Renders nothing otherwise.
 *
 * Two instances are wired in PHP, one per field, distinguished by `trigger`:
 *   - 'platform' → shows under the AI Platform field when the platform changed.
 *   - 'embed'    → shows under the Embed Model field when ONLY the embedding
 *                  model changed (a platform change is covered by the platform
 *                  notice, so the embed notice is suppressed then).
 *
 * PHP field config:
 *   'type' => 'reembed_notice',
 *   'reembed_notice' => array(
 *       'trigger'         => 'platform' | 'embed',
 *       'platform_field'  => 'ai_chatbot_chat_provider',
 *       'model_field_map' => array( 'openai' => 'ai_chatbot_embed_model', 'gemini' => 'ai_chatbot_embed_model_gemini' ),
 *       'title'   => '...', // optional
 *       'message' => '...',
 *   ),
 */
const ReembedNotice = ( props ) => {
    const context = useBuilderContext();
    const cfg = props.reembed_notice;

    const shouldShow =
        cfg &&
        ( cfg.trigger === "platform"
            ? platformChanged( cfg, context.values )
            : embedModelChangedOnly( cfg, context.values ) );

    if ( ! shouldShow ) {
        return null;
    }

    // A short bold headline over the detail line reads far better than one dense
    // sentence. Callers may set their own `title`; otherwise pick a sensible
    // default from the trigger so the notice is self-sufficient.
    const title =
        cfg.title ||
        ( cfg.trigger === "platform"
            ? __( "Switching the AI platform re-embeds everything", "betterdocs" )
            : __( "Changing the embedding model re-embeds everything", "betterdocs" ) );

    // Outer row carries the full-width divider BELOW the notice; the preceding
    // field drops its own border (see settings.scss) so the field + this notice
    // read as one cell instead of the notice looking like the next setting.
    return (
        <div className="betterdocs-reembed-notice-row">
            <div className="betterdocs-reembed-notice" role="alert">
                <span className="betterdocs-reembed-notice__icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 9.25v3.5M12 16.25h.01M10.3 4.4 2.4 18.05A1.85 1.85 0 0 0 4 20.85h16a1.85 1.85 0 0 0 1.6-2.8L13.7 4.4a1.85 1.85 0 0 0-3.4 0Z"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <div className="betterdocs-reembed-notice__body">
                    <strong className="betterdocs-reembed-notice__title">
                        { title }
                    </strong>
                    <span className="betterdocs-reembed-notice__text">
                        { cfg.message ||
                            __(
                                "Changing the AI platform or embedding model re-embeds all of your content when you save. This takes time and uses API credits.",
                                "betterdocs"
                            ) }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReembedNotice;
