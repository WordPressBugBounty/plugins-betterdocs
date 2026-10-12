import apiFetch from "@wordpress/api-fetch";

const nonce = () => betterdocs_admin.nonce;

function withNonce() {
    apiFetch.use(apiFetch.createNonceMiddleware(nonce()));
}

// `meta` carries the raw icon/cover attachment ids (registered writable term meta);
// `thumbnail`/`handbookthumbnail` are read-only resolved URLs for display;
// `knowledge_base`(slugs)/`knowledge_base_ids` are the Pro KB assignment.
const CAT_FIELDS = "id,name,slug,description,parent,count,meta,doc_category_order,thumbnail,handbookthumbnail,knowledge_base,knowledge_base_ids,knowledge_base_titles,lang";

// On multilingual sites, fetch every language's terms in one pass so the admin
// can group/filter by language client-side (WPML/Polylang otherwise scope terms
// to the current/default language).
const allLangParam = () =>
    (typeof betterdocs_admin !== "undefined" && betterdocs_admin.is_multilingual)
        ? "&bd_all_languages=1"
        : "";

function fetchCategoryPage(page, per_page) {
    return apiFetch({
        path: `wp/v2/doc_category?per_page=${per_page}&page=${page}&orderby=id&order=asc&_fields=${CAT_FIELDS}${allLangParam()}`,
        method: "GET",
        parse: false,
    }).then((res) =>
        res.json().then((data) => ({
            data,
            total: parseInt(res.headers.get("X-WP-Total") || "0", 10),
            totalPages: parseInt(res.headers.get("X-WP-TotalPages") || "1", 10),
        })),
    );
}

// Fetch every category, not just the first page. The tree needs the complete set
// so newly created / empty categories aren't dropped when there are >100 terms.
export function getDocCategories({ per_page = 100 } = {}) {
    withNonce();
    return fetchCategoryPage(1, per_page).then((first) => {
        if (first.totalPages <= 1) return first;
        const rest = [];
        for (let p = 2; p <= first.totalPages; p++) rest.push(fetchCategoryPage(p, per_page));
        return Promise.all(rest).then((pages) => ({
            data: pages.reduce((acc, pg) => acc.concat(pg.data), first.data),
            total: first.total,
            totalPages: first.totalPages,
        }));
    });
}

export function createDocCategory(payload) {
    withNonce();
    return apiFetch({
        path: "wp/v2/doc_category",
        method: "POST",
        data: payload,
    });
}

export function updateDocCategory(id, payload) {
    withNonce();
    return apiFetch({
        path: `wp/v2/doc_category/${id}`,
        method: "POST",
        data: payload,
    });
}

export function deleteDocCategory(id, { force = false } = {}) {
    withNonce();
    return apiFetch({
        path: `wp/v2/doc_category/${id}?force=${force}`,
        method: "DELETE",
    });
}

// ── Term translation (WPML/Polylang) — shared across all three taxonomy admins ──

// Fetch a term's translation group + "this is a translation of" candidates.
export function getTermTranslations(params) {
    withNonce();
    const qs = new URLSearchParams(params).toString();
    return apiFetch({ path: `betterdocs/v1/term-translations?${qs}` });
}

// Authoritative write: set a term's language + link it into a translation group.
export function setTermLanguage(data) {
    withNonce();
    return apiFetch({ path: "betterdocs/v1/term-language", method: "POST", data });
}
