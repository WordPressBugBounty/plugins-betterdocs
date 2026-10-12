import { addFilter } from "@wordpress/hooks";
import apiFetch from "@wordpress/api-fetch";
import { withSuggestTerms } from "./SuggestTerms";

const config = window.betterdocsDocsAI || {};

// Authenticate REST calls (the endpoint uses the standard wp_rest nonce).
if ( config.nonce ) {
    apiFetch.use( apiFetch.createNonceMiddleware( config.nonce ) );
}

// Inject "Suggest Categories / Tags" into the native taxonomy panels.
addFilter(
    "editor.PostTaxonomyType",
    "betterdocs/docs-ai-suggest-terms",
    withSuggestTerms
);
