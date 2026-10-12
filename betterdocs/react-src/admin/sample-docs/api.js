/* REST helpers for the Sample Docs flow. Works from both the dashboard
   (betterdocs_admin.ai_sample_docs) and the quick-setup wizard
   (betterdocsSampleDocs). */

function cfg() {
    if (typeof window !== "undefined") {
        if (window.betterdocs_admin?.ai_sample_docs) {
            return {
                base: window.betterdocs_admin.ai_sample_docs.rest_base,
                restUrl: window.betterdocs_admin.rest_url,
                nonce: window.betterdocs_admin.nonce,
                enabled: !!window.betterdocs_admin.ai_sample_docs.enabled,
            };
        }
        if (window.betterdocsSampleDocs) {
            return {
                base: window.betterdocsSampleDocs.rest_base,
                restUrl: window.betterdocsSampleDocs.rest_url,
                nonce: window.betterdocsSampleDocs.nonce,
                enabled: !!window.betterdocsSampleDocs.enabled,
            };
        }
    }
    return { base: "", restUrl: "/wp-json/", nonce: "", enabled: false };
}

/* Fetch the doc categories that already have docs, grouped for the read-only
   grid: [{ id, name, icon, color, articles:[titles] }]. Returns [] on any error. */
export async function fetchExistingDocs() {
    const { restUrl, nonce } = cfg();
    const headers = nonce ? { "X-WP-Nonce": nonce } : {};
    try {
        const [cats, grouped] = await Promise.all([
            wp.apiFetch({ url: `${restUrl}wp/v2/doc_category?per_page=100&orderby=count&order=desc`, headers }),
            wp.apiFetch({ url: `${restUrl}betterdocs/v1/doc-categories?per_page=100`, headers }),
        ]);
        const data = (grouped && grouped.data) || {};
        return (Array.isArray(cats) ? cats : [])
            .map((c) => ({
                id: "cat_" + c.id,
                name: c.name,
                icon: "book",
                color: "#00B884",
                articles: (data[c.id] || []).map((d) => (typeof d?.title === "string" ? d.title : d?.title?.rendered || "")),
            }))
            .filter((c) => c.articles.length > 0);
    } catch (e) {
        return [];
    }
}

async function call(endpoint, data) {
    const { base, nonce } = cfg();
    const res = await wp.apiFetch({
        url: `${base}/${endpoint}`,
        method: "POST",
        headers: nonce ? { "X-WP-Nonce": nonce } : {},
        data,
    });
    // BaseAPI::success() wraps payloads as { success, data }.
    return res && typeof res === "object" && "data" in res ? res.data : res;
}

export const sampleDocsEnabled = () => cfg().enabled;

export const detectSite = (contentType) => call("detect", { content_type: contentType });

export const generateDocs = (payload) => call("generate", payload);

/* Deep KB (docs): step 1 designs the whole information architecture. */
export const generateOutline = (payload) => call("outline", payload);

/* Deep KB (docs): step 2 expands one article of the issued outline. */
export const generateArticle = (payload) => call("article", payload);

export const insertDocs = (payload) => call("insert", payload);

export const undoDocs = (contentType) => call("undo", { content_type: contentType });
