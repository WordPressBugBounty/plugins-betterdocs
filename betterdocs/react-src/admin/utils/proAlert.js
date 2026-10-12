import { __, sprintf } from "@wordpress/i18n";
import { isObject } from "quickbuilder";
import Swal from "sweetalert2";

// Pro upgrade target for the Settings pro-teaser / license modals. Kept in sync
// with the analytics teaser's upgradeUrl() fallback (ProTeaser.js).
const UPGRADE_URL = "https://betterdocs.co/dashboard-upgrade-to-pro";

export const SweetAlert = (args = {}) => {
	return Swal.mixin({
		target: args?.target ?? "#betterdocsQuickBuilder",
		html: args?.html,
		title: args?.title ?? __("Title Goes Here: title", "betterdocs"),
		text: args?.text ?? __("Text Goes Here: text", "betterdocs"),
		icon: args?.icon ?? (args?.type || "success"),
		timer: args?.timer ?? null,
		...args,
	});
};
const proAlert = (html = null) => {
	const tabKey = document.querySelector('li.wprf-tab-nav-item.wprf-active-nav')?.getAttribute('data-key');

	let title = __('Upgrade to BetterDocs PRO', 'betterdocs');
	let description = __('To access this feature, simply upgrade to BetterDocs PRO for premium access.', 'betterdocs');


	if (tabKey === 'tab-ai-chatbot') {
		title = __('Upgrade To BetterDocs PRO & Get BetterDocs AI Chatbot Addon', 'betterdocs');
		description = __('To access this feature, simply upgrade to BetterDocs PRO, get the BetterDocs AI chatbot Addon, and activate the license keys.', 'betterdocs');
	}

	let htmlObject = {};
	let closeButtonHtml = `<svg class="betterdocs-close-button" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                            <path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="#475467"/>
                          </svg>`;
	if (html === null) {
		html = sprintf(
			'<div class="icon">' +
                '<i class="btd-icon btd-crown"></i>' +
            '</div>' +
            '<h3 class="title">%s</h3>' +
            '<p class="description">%s</p>' +
            '<div class="features">' +
                '<h5 class="feature-title">%s</h5>' +
                '<ul class="feature-list">' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                '</ul>' +
            '</div>' +
            '<div class="footer">' +
                '<a href="%s" target="_blank">%s</a>' +
            '</div>',
            title,
            description,
			__("Here’s what’s inside BetterDocs Pro.", "betterdocs"),
			__("Multiple Knowledge Bases", "betterdocs"),
			__("Internal Knowledge Base", "betterdocs"),
			__("Instant Answer", "betterdocs"),
			__("Git Sync", "betterdocs"),
			__("Insightful Analytics Report", "betterdocs"),
			__("User Role Management", "betterdocs"),
			__("Glossaries & Encyclopedia", "betterdocs"),
			__("AI-Powered Chatbot", "betterdocs"),
			UPGRADE_URL,
			__("Upgrade Now", "betterdocs")
		);
	}
	if (isObject(html)) {
		htmlObject = html;
		html = html.message || html.html;
	}
	let alertOptions = {
		showConfirmButton: false,
		showDenyButton: false,
		icon: false,
		type: "warning",
		title: false,
		showCloseButton: true,
		closeButtonHtml: closeButtonHtml,
		customClass: {
			container: "betterdocs-pro-alert-container",
			popup: "betterdocs-pro-alert-popup",
			closeButton: "betterdocs-pro-alert-close-button",
			htmlContainer: "betterdocs-pro-alert-html",
		},
		...htmlObject,
		html,
	};
	return SweetAlert(alertOptions);
};

export const licenseInactiveAlert = (html = null) => {
	let htmlObject = {};
	let closeButtonHtml = `<svg class="betterdocs-close-button" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                            <path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="#475467"/>
                          </svg>`;
	if (html === null) {
		html = sprintf(
			'<div class="icon">' +
                '<i class="btd-icon btd-crown"></i>' +
            '</div>' +
            '<h3 class="title">%s</h3>' +
            '<p class="description">%s</p>' +
            '<div class="features">' +
                '<h5 class="feature-title">%s</h5>' +
                '<ul class="feature-list">' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                    '<li class="list-item">%s</li>' +
                '</ul>' +
            '</div>' +
            '<div class="footer">' +
                '<a href="%s" target="_blank">%s</a>' +
            '</div>',
			__("License Not Activated", "betterdocs"),
			__("To access this feature, simply upgrade to BetterDocs PRO for premium access.", "betterdocs"),
			__("Here’s what’s inside BetterDocs Pro.", "betterdocs"),
			__("Multiple Knowledge Bases", "betterdocs"),
			__("Internal Knowledge Base", "betterdocs"),
			__("Instant Answer", "betterdocs"),
			__("Advanced Live Search", "betterdocs"),
			__("Insightful Analytics Report", "betterdocs"),
			__("User Role Management", "betterdocs"),
			UPGRADE_URL,
			__("Upgrade Now", "betterdocs")
		);
	}
	if (isObject(html)) {
		htmlObject = html;
		html = html.message || html.html;
	}
	let alertOptions = {
		showConfirmButton: false,
		showDenyButton: false,
		icon: false,
		title: false,
		showCloseButton: true,
		closeButtonHtml: closeButtonHtml,
		customClass: {
			container: "betterdocs-pro-alert-container",
			popup: "betterdocs-pro-alert-popup",
			closeButton: "betterdocs-pro-alert-close-button",
			htmlContainer: "betterdocs-pro-alert-html",
		},
		...htmlObject,
		html,
	};
	return SweetAlert(alertOptions);
};

export default proAlert;
