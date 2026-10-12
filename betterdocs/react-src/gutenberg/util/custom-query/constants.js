const { __ } = wp.i18n;

export const SOURCES = [
	{ label: __("Post", "betterdocs"), value: "posts" },
	// { label: __("Page", "betterdocs"), value: "pages" },
];

export const ORDER_BY = [
	{ label: __("Date", "betterdocs"), value: "date" },
	{ label: __("Modified Date", "betterdocs"), value: "modified" },
	{ label: __("Title", "betterdocs"), value: "title" },
	{ label: __("ID", "betterdocs"), value: "id" },
	{ label: __("Parent", "betterdocs"), value: "parent" },
];

export const ORDER = [
	{ label: __("Desc", "betterdocs"), value: "desc" },
	{ label: __("Asc", "betterdocs"), value: "asc" },
];