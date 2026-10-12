import apiFetch from "@wordpress/api-fetch";

/**
 * Give QuickBuilder's ajax requests an HTTP method.
 *
 * QuickBuilder's `hitAAJX()` calls `apiFetch({ path, data })` and never passes a
 * method — not even the one the field config declares. `data` makes apiFetch
 * attach a request body, and with no method the browser defaults to GET, so
 * `fetch()` rejects before anything leaves the page:
 *
 *     TypeError: Request with GET/HEAD method cannot have body.
 *
 * apiFetch turns that rejection into `{ code: "fetch_error", message: "Could not
 * get a valid response from the server." }` — which reads like a server or
 * network fault while the request was never actually sent. Every QuickBuilder
 * ajax button hits this: the AI Chatbot "Save", report test, import/export.
 *
 * This cannot regress a working request. It only fills in a method where the
 * call throws today, 100% of the time, so there is no success path to break.
 *
 * Scoped to our own namespace ON PURPOSE. Some select fields point `ajax.api` at
 * core routes (`/wp/v2/docs`, `/wp/v2/knowledge_base`) with data and an intended
 * `method: "GET"`; POSTing those would CREATE a post or a term instead of
 * reading a list. Those stay exactly as they are — the real repair for them is
 * teaching `hitAAJX()` to forward `ajax.method` upstream in QuickBuilder.
 */
const registerQuickBuilderFetchFix = () => {
    apiFetch.use( ( options, next ) => {
        const path = options?.path || "";
        const isOurs =
            path.startsWith( "/betterdocs/" ) || path.startsWith( "betterdocs/" );

        if ( isOurs && options?.data && ! options?.method ) {
            return next( { ...options, method: "POST" } );
        }

        return next( options );
    } );
};

export default registerQuickBuilderFetchFix;
