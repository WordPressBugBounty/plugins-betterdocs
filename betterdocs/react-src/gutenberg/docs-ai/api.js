import apiFetch from "@wordpress/api-fetch";

const config = window.betterdocsDocsAI || {};

export const i18n = config.i18n || {};
export const SUPPORTED_TAXONOMIES = config.taxonomies || [ "doc_category", "doc_tag" ];

/**
 * Request AI-suggested taxonomy terms for the current doc.
 *
 * @return {Promise<Object>} REST response: { success, data: { taxonomy, suggestions, model } }
 */
export function suggestTerms( { taxonomy, postId, content, title, maxSuggestions } ) {
    return apiFetch( {
        url: config.restSuggestTerms,
        method: "POST",
        data: {
            taxonomy,
            post_id: postId,
            content,
            title,
            max_suggestions: maxSuggestions,
        },
    } );
}
