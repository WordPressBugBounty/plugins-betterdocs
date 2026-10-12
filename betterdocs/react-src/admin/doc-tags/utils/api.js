import apiFetch from "@wordpress/api-fetch";

const nonce = () => betterdocs_admin.nonce;

function withNonce() {
    apiFetch.use(apiFetch.createNonceMiddleware(nonce()));
}

function fetchTagPage(page, per_page, search) {
    const params = new URLSearchParams({
        per_page,
        page,
        orderby: "name",
        order: "asc",
        _fields: "id,name,slug,description,count,lang",
    });
    if (search) params.set("search", search);
    // Fetch every language's tags so the admin can group/filter client-side.
    if (typeof betterdocs_admin !== "undefined" && betterdocs_admin.is_multilingual) {
        params.set("bd_all_languages", "1");
    }

    return apiFetch({
        path: `wp/v2/doc_tag?${params}`,
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

// Fetch every tag, not just the first page, so a newly created tag (sorted by
// name, so it can land anywhere) is present even when there are >100 terms.
export function getDocTags({ per_page = 100, search = "" } = {}) {
    withNonce();
    return fetchTagPage(1, per_page, search).then((first) => {
        if (first.totalPages <= 1) return first;
        const rest = [];
        for (let p = 2; p <= first.totalPages; p++) rest.push(fetchTagPage(p, per_page, search));
        return Promise.all(rest).then((pages) => ({
            data: pages.reduce((acc, pg) => acc.concat(pg.data), first.data),
            total: first.total,
            totalPages: first.totalPages,
        }));
    });
}

export function createDocTag(payload) {
    withNonce();
    return apiFetch({ path: "wp/v2/doc_tag", method: "POST", data: payload });
}

export function updateDocTag(id, payload) {
    withNonce();
    return apiFetch({ path: `wp/v2/doc_tag/${id}`, method: "POST", data: payload });
}

export function deleteDocTag(id, { force = false } = {}) {
    withNonce();
    return apiFetch({ path: `wp/v2/doc_tag/${id}?force=${force}`, method: "DELETE" });
}
