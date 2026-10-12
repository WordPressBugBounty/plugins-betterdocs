/**
 * Build a hierarchical tree from a flat array of WP term objects.
 * Each term has: id, parent, name, slug, description, count, meta.
 */
export function buildTree(terms) {
    const map = {};
    const roots = [];

    // Match the legacy admin/frontend order: ascending by the BetterDocs
    // `doc_category_order` term meta. Terms missing the meta fall back to 0 (top),
    // mirroring the old LEFT JOIN behaviour. Array.sort is stable, so ties keep the
    // incoming order (fetched by id ascending). Sorting the flat list also orders
    // siblings within each parent, since buildTree appends children in array order.
    const sorted = [...terms].sort(
        (a, b) =>
            Number(a.doc_category_order ?? 0) - Number(b.doc_category_order ?? 0),
    );

    sorted.forEach((t) => {
        map[t.id] = { ...t, children: [] };
    });

    sorted.forEach((t) => {
        if (t.parent && map[t.parent]) {
            map[t.parent].children.push(map[t.id]);
        } else {
            roots.push(map[t.id]);
        }
    });

    return roots;
}

/**
 * Flatten a tree into display rows, tracking depth and connector-line state.
 * Returns [{node, depth, isLast, parentLastChain, hasChildren, isOpen}]
 */
export function flattenTree(nodes, expanded, depth = 0, parentLastChain = []) {
    const rows = [];

    nodes.forEach((node, i) => {
        const isLast = i === nodes.length - 1;
        const hasChildren = node.children && node.children.length > 0;
        const isOpen = expanded.has(node.id);

        rows.push({
            node,
            depth,
            isLast,
            parentLastChain: [...parentLastChain],
            hasChildren,
            isOpen,
        });

        if (hasChildren && isOpen) {
            const childRows = flattenTree(
                node.children,
                expanded,
                depth + 1,
                [...parentLastChain, isLast],
            );
            rows.push(...childRows);
        }
    });

    return rows;
}

export function findNode(nodes, id) {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children?.length) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

export function removeNode(nodes, id) {
    return nodes
        .filter((n) => n.id !== id)
        .map((n) => ({
            ...n,
            children: removeNode(n.children || [], id),
        }));
}

export function isDescendant(node, targetId) {
    if (!node.children?.length) return false;
    return node.children.some(
        (c) => c.id === targetId || isDescendant(c, targetId),
    );
}

/** Collect all ids in a subtree (the node itself + all descendants). */
export function collectIds(node) {
    const ids = [node.id];
    (node.children || []).forEach((c) => ids.push(...collectIds(c)));
    return ids;
}

/**
 * Insert newNode relative to targetId:
 *   pos = 'before' | 'after' | 'inside'
 */
export function insertNode(nodes, targetId, pos, newNode) {
    const result = [];

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (pos === 'before' && node.id === targetId) {
            result.push({ ...newNode, children: newNode.children || [] });
        }

        if (node.id === targetId && pos === 'inside') {
            result.push({
                ...node,
                children: [
                    { ...newNode, children: newNode.children || [] },
                    ...(node.children || []),
                ],
            });
        } else {
            result.push({
                ...node,
                children: insertNode(node.children || [], targetId, pos, newNode),
            });
        }

        if (pos === 'after' && node.id === targetId) {
            result.push({ ...newNode, children: newNode.children || [] });
        }
    }

    return result;
}

/** Generate a slug from a name string. */
export function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

/**
 * Mirror WordPress core's wp_unique_term_slug() behaviour: if `base` already
 * exists in `existingSlugs`, append -2, -3, … until the slug is unique.
 *
 * @param {string}   base          - The desired slug (already slugified).
 * @param {string[]} existingSlugs - All slugs currently in use.
 * @param {string}   [ownSlug]     - The term's current slug when editing
 *                                   (excluded from the conflict check so a
 *                                   no-op save doesn't bump its own suffix).
 */
export function makeUniqueSlug(base, existingSlugs, ownSlug = null) {
    const others = ownSlug
        ? existingSlugs.filter((s) => s !== ownSlug)
        : existingSlugs;
    if (!others.includes(base)) return base;
    let n = 2;
    while (others.includes(`${base}-${n}`)) n++;
    return `${base}-${n}`;
}
