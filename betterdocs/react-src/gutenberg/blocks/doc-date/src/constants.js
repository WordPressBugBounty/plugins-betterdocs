import { __ } from '@wordpress/i18n';

const {
	Dashicon
} = wp.components;

export const DOC_DATE_ALIGNMENT = [
	{ label: __(<Dashicon icon={"editor-alignleft"} />, "betterdocs"), value: "left" },
	{ label: __(<Dashicon icon={"editor-aligncenter"} />, "betterdocs"), value: "center" },
	{ label: __(<Dashicon icon={"editor-alignright"} />, "betterdocs"), value: "right" }
];

export const DOC_DATE_BACKGROUND = 'doc_date_background';
export const DOC_DATE_MARGIN     = 'doc_date_margin';
export const DOC_DATE_PADDING    = 'doc_date_padding';
export const DOC_DATE_BORDER     = 'doc_date_border';
