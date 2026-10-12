import apiFetch from "@wordpress/api-fetch";
import sampleData from "../sample-faq.json";
import React, { useEffect, useState } from "react";

// Default taxonomy for the General FAQ Builder. Product FAQ Groups pass
// `betterdocs_product_faq_category` so the same data layer serves both tabs.
const DEFAULT_TAXONOMY = "betterdocs_faq_category";



const ORDER_MAP = {
    default:        { order: 'asc',  orderby: 'id'    },
    most_recent:    { order: 'desc', orderby: 'id'    },
    least_recent:   { order: 'asc',  orderby: 'id'    },
    a_to_z:         { order: 'asc',  orderby: 'name'  },
    z_to_a:         { order: 'desc', orderby: 'name'  },
    most_questions: { order: 'desc', orderby: 'count' },
};

// Generate an FAQ answer via the internal endpoint (server-side OpenAI call).
// The API key never leaves the server. Returns { success, data: { answer, model } }.
export const generateFaqAnswer = ({ question, keywords = "" }) => {
    apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
    return apiFetch({
        path: `betterdocs/v1/ai-faq`,
        method: "POST",
        data: {
            question,
            keywords,
            nonce: betterdocs_admin.nonce,
        },
    });
};

// this function work for fetch all categories.
export const getAllCategories = ({ queryKey }) => {
    const [_, perPage, currentPage, orderKey, taxonomy = DEFAULT_TAXONOMY] = queryKey;
    const { order, orderby } = ORDER_MAP[orderKey] || ORDER_MAP.most_recent;
    apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
    let response = apiFetch({
        // betterdocs_faq_order drives the server-side ordering (and pagination
        // boundaries) via FAQBuilder::faq_category_orderby_meta, so the whole
        // list — not just the current page — is sorted in the chosen order.
        path: `wp/v2/${taxonomy}?per_page=${perPage}&page=${currentPage}&order=${order}&orderby=${orderby}&betterdocs_faq_order=${orderKey || 'default'}`,
        method: "GET",
        parse: false,
    });

    let total = 0;
    let totalPages = 0;

    return response
        .then((res) => {
            totalPages = res?.headers?.get("X-WP-TotalPages");
            total = res?.headers?.get("X-WP-Total");
            return res.json();
        })
        .then((res) => {
            return {
                data: res,
                totalPages,
                total,
            };
        });
};

// Find which pagination page a given FAQ group falls on, under the active sort
// order. The group list is server-paginated, so the current page alone can't
// tell us where an off-page group lives — we fetch the full ordered id list
// (ids only, in batches) and compute the page from the target's index. Pages
// are bounded by the server `orderby` (the same one getAllCategories uses), so
// this matches where the group will actually render. Returns a 1-based page
// (1 if the group isn't found).
export const findCategoryPage = ({ taxonomy = DEFAULT_TAXONOMY, orderKey = 'default', perPage = 10, targetId }) => {
    const { order, orderby } = ORDER_MAP[orderKey] || ORDER_MAP.most_recent;
    apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
    const BATCH = 100;

    const collect = (page, acc) =>
        apiFetch({
            path: `wp/v2/${taxonomy}?per_page=${BATCH}&page=${page}&order=${order}&orderby=${orderby}&betterdocs_faq_order=${orderKey || 'default'}&_fields=id`,
            method: "GET",
            parse: false,
        }).then((res) => {
            const totalPages = Number(res?.headers?.get("X-WP-TotalPages") || 1);
            return res.json().then((rows) => {
                const ids = acc.concat((rows || []).map((r) => r?.id));
                return page >= totalPages ? ids : collect(page + 1, ids);
            });
        });

    return collect(1, []).then((ids) => {
        const idx = ids.findIndex((id) => String(id) === String(targetId));
        return idx < 0 ? 1 : Math.floor(idx / perPage) + 1;
    });
};

export const getSearchedFaqCategories = ({queryKey}) => {
    const [_, faqKeyword, taxonomy = DEFAULT_TAXONOMY] = queryKey;
    apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
    let response = apiFetch({
        path: `betterdocs/v1/faq-terms-by-keyword-search?search=${encodeURIComponent(faqKeyword)}&taxonomy=${encodeURIComponent(taxonomy)}`,
        method: "GET",
        parse: false,
    });

    return response
        .then((res) => {
            return res.json();
        }).then((res) => {
            return res;
        });
}


// this function work for fetch all categories.
export const searchCategories = (searchString, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/category_search/?title=${searchString}&taxonomy=${taxonomy}`,
		method: "GET",
	});
};

// this function work for create new faq category
export const createFaqCategory = (data, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/create_category`,
		method: "POST",
		data: {
			title: data?.title,
			group_icon_url:data?.icon,
			// slug: data?.slug,
			slug: null,
			// description: data?.description ? data?.description : "undefined",
			description: null,
			taxonomy: taxonomy,
			product_cats: data?.product_cats || [],
			products: data?.products || [],
			all_products: data?.all_products ? 1 : 0,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for update faq category
export const updateFaqCategory = (data, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/update_category`,
		method: "POST",
		data: {
			term_id: data?.term_id,
			title: data?.title,
			group_icon_url:data?.icon,
			// slug: data?.slug,
			slug: null,
			// description: data?.description ? data?.description : "undefined",
			description: null,
			taxonomy: taxonomy,
			product_cats: data?.product_cats || [],
			products: data?.products || [],
			all_products: data?.all_products ? 1 : 0,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for delete faq category
export const deleteFaqCategory = (id, with_all_post, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/delete_category`,
		method: "POST",
		data: {
			term_id: id,
			with_all_post: with_all_post,
			taxonomy: taxonomy,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for change category active status
export const categoryStatusChange = (term_id, status) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/category_status`,
		method: "POST",
		data: {
			term_id: term_id,
			status: status,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for change category order
export const reOrderCategories = (data) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	const faq_category_order = JSON.stringify(data);
	return apiFetch({
		path: `betterdocs/faq/category_order`,
		method: "POST",
		data: {
			faq_category_order: faq_category_order,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// Persist the FAQ Builder header order dropdown so the front end mirrors it.
// Stored as a single global preference (option `betterdocs_faq_order`).
export const saveFaqOrder = (order) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/order`,
		method: "POST",
		data: { order: order, nonce: betterdocs_admin.nonce },
	});
};

// this function work for fetch all faqs based on category.
export const getAllFaqBasedOnCategory = async ({ queryKey }) => {
	const [_, id, taxonomy = DEFAULT_TAXONOMY] = queryKey;
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `wp/v2/betterdocs_faq?${taxonomy}=${id}&status=publish,draft&posts_per_page=-1`,
		method: "GET",
	});
};

// this function work for fetch all Uncategorized faqs.
// Ungrouped FAQs for the active tab. The taxonomy scopes the bucket: the Product tab
// gets the FAQs scoped to Product that have no Product group, the General tab gets the
// rest — so an ungrouped Product FAQ no longer surfaces under General.
export const getAllUncategorizedFaq = async ({ queryKey }) => {
	const [_, taxonomy = DEFAULT_TAXONOMY] = queryKey;
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/uncategorised?status=publish,draft&taxonomy=${taxonomy}`,
		method: "GET",
	});
};

// this function work for create new faq under category
export const createFAQ = (data, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/create_post`,
		method: "POST",
		data: {
			post_title: data?.post_title,
			post_content: data?.post_content,
			term_id: data?.term_id ? data?.term_id : null,
			taxonomy: taxonomy,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for update faq under category
export const updateFaq = (data, taxonomy = DEFAULT_TAXONOMY) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/update_post`,
		method: "POST",
		data: {
			post_id: data?.post_id,
			post_title: data?.post_title,
			post_content: data?.post_content,
			term_id: data?.term_id,
			taxonomy: taxonomy,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for delate faq under category
export const deleteFaq = (id) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/delete_post`,
		method: "POST",
		data: {
			post_id: id,
			nonce: betterdocs_admin.nonce,
		},
	});
};

// this function work for change faq active status
export const faqStatusChange = (post_id, status) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `wp/v2/betterdocs_faq/${post_id}`,
		method: "POST",
		data: { status: status, nonce: betterdocs_admin.nonce },
	});
};

// this function work for change faq order
export const reOrderFaqList = (category, updatedFaqsList) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/update_order_by_category?term_id=${category}&posts=${updatedFaqsList}`,
		method: "POST",
		data: {
			nonce: betterdocs_admin.nonce,
		},
	});
};

// ---------------------------------------------------------------------------
// WooCommerce Product FAQ — Category Assignments
// ---------------------------------------------------------------------------

// Fetch WooCommerce product categories as { id, name } options for the
// Product FAQ Group assignment selector. Optional search narrows by name.
export const getProductCategories = async (search = "") => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/v1/woo-product-faq/product-categories?search=${encodeURIComponent(
			search
		)}`,
		method: "GET",
	});
};

// Search products by title, or resolve specific products by id (include is a
// comma-separated id list) to prefill the Products selector when editing.
export const searchProducts = async ({ q = "", include = "" } = {}) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/v1/woo-product-faq/assignable-products?q=${encodeURIComponent(
			q
		)}&include=${encodeURIComponent(include)}`,
		method: "GET",
	});
};

export const getWooFaqDisplaySettings = async () => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/v1/woo-product-faq/display-settings`,
		method: "GET",
	});
};

export const saveWooFaqDisplaySettings = (settings) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/v1/woo-product-faq/display-settings`,
		method: "POST",
		data: { settings: settings, nonce: betterdocs_admin.nonce },
	});
};

// this function work for create sample data
export const generateSampleData = () => {
	const data = JSON.stringify(sampleData);
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/faq/sample_data`,
		method: "POST",
		data: { sample_data: data, nonce: betterdocs_admin.nonce },
	});
};


// submit toggle response data
export const getToggleResponse = (id, toggle) => {
	apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));
	return apiFetch({
		path: `betterdocs/v1/faq-accordion-toggle`,
		method: "POST",
		body: JSON.stringify({ faq_id:id, nonce: betterdocs_admin.nonce, toggle: toggle}),
	});
};

export const getSettingsData = async () => {
	try {
		apiFetch.use(apiFetch.createNonceMiddleware(betterdocs_admin.nonce));

		const response = await apiFetch({
			path: 'betterdocs/v1/settings',
		});

		if (!response || response.error) {
			throw new Error('Failed to fetch settings data');
		}

		return response;
	} catch (error) {
		console.error('Error fetching settings data:', error);
		throw error;
	}
};

export const mediaUpload = (callback) => {
	// Ensure wp.media is available
	if (typeof wp === "undefined" || typeof wp.media === "undefined") {
	  console.error("WordPress Media Library is not loaded.");
	  return;
	}

	// Create the media frame
	const mediaFrame = wp.media({
	  title: "Select or Upload Media",
	  button: {
		text: "Use this media",
	  },
	  multiple: false, // Single file selection
	});

	// On select, retrieve the selected media
	mediaFrame.on("select", () => {
	  const attachment = mediaFrame.state().get("selection").first().toJSON();
	  if (callback && typeof callback === "function") {
		callback(attachment.url, attachment.id); // Return the URL of the uploaded/selected image
	  }
	});

	// Open the media frame
	mediaFrame.open();
  };

// Wait out the 0.32s slide-open transition (see _category-list.scss /
// _faq-list.scss) before measuring, so the scroll lands on the panel's FINAL
// position instead of a mid-animation one. Measuring too early made the page
// scroll while the panel was still growing — reading as a "scroll, then jump".
export const EXPAND_ANIM_MS = 340;
// Gap left above the item head when scrolling it to the top of its section.
const SCROLL_PAD = 12;

// Height of the fixed/sticky chrome at the top of the viewport: the WP admin bar
// plus the now-sticky BetterDocs dashboard header (.betterdocs-dashboard-header-top).
// Page-level smooth scrolls must subtract this so the target lands BELOW the
// sticky header instead of underneath it. `pad` is extra breathing room.
export const getStickyTopOffset = (pad = 16) => {
  const adminBar     = document.getElementById("wpadminbar");
  const stickyHeader = document.querySelector(".betterdocs-dashboard-header-top");
  return (adminBar?.offsetHeight || 32) + (stickyHeader?.offsetHeight || 0) + pad;
};

// Walk up from `el` to the nearest ancestor that actually scrolls vertically
// (overflow-y auto/scroll AND content taller than the box). Returns null when
// nothing between the element and the document scrolls — e.g. a FAQ group row,
// or a FAQ inside a short, un-capped list — so the caller falls back to the page.
const getScrollableParent = (el) => {
  let node = el.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

/**
 * After an accordion item (FAQ group / FAQ / glossary) is expanded, bring it into
 * view — but only when it isn't already fully visible, so on-screen items never
 * jump. Call this ONLY from the open branch of a toggle, never on close.
 *
 * If the item lives inside a capped, independently-scrollable section (e.g.
 * `.bd-faq-category-body-inner`, max-height 575px), it scrolls WITHIN that
 * section — moving the page would be the wrong axis. Otherwise it falls back to a
 * page scroll that lands the header just below the WP admin bar.
 *
 * The element is found by a namespaced `data-bd-expand-id` attribute on its root
 * node (e.g. `ctg-12`, `faq-34`) rather than a ref, because every row's root
 * already carries react-beautiful-dnd's `provided.innerRef`.
 *
 * @param {string} id Namespaced expand id, e.g. `ctg-${termId}` or `faq-${postId}`.
 */
export const scrollExpandedIntoView = (id) => {
  if (id === undefined || id === null) return;
  // rAF defers past the state-commit/paint that starts the open transition; the
  // timeout lets the panel reach (near) final height before we measure.
  requestAnimationFrame(() => {
    setTimeout(() => {
      const el = document.querySelector(`[data-bd-expand-id="${id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const container = getScrollableParent(el);

      if (container) {
        // Scroll inside the section so the item head sits at its top.
        const cRect = container.getBoundingClientRect();
        // Already fully visible within the section → don't move.
        if (rect.top >= cRect.top && rect.bottom <= cRect.bottom) return;
        container.scrollTo({
          top: container.scrollTop + (rect.top - cRect.top) - SCROLL_PAD,
          behavior: "smooth",
        });
        return;
      }

      // Page-level fallback: land the head just below the admin bar AND the
      // sticky dashboard header. Panels can exceed the viewport, so align the
      // head (not the whole element).
      const offset = getStickyTopOffset();
      if (rect.top >= offset && rect.bottom <= window.innerHeight) return;
      window.scrollTo({
        top: window.scrollY + rect.top - offset,
        behavior: "smooth",
      });
    }, EXPAND_ANIM_MS);
  });
};





