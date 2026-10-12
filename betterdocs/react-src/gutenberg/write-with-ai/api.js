// ===== write-with-ai/api.js — REST client for betterdocs/v1/write-with-ai =====

import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";

export const getConfig = () =>
    (typeof window !== "undefined" && window.betterdocsWriteWithAI) || {};

// Normalize a thrown/responded error into the { code, message } shape the
// PreviewAccept Banner understands.
const toError = (e) => {
    if (e && e.code && e.message) return { code: e.code, message: e.message };
    const message = (e && e.message) || __("Failed to reach the AI service. Please try again.", "betterdocs");
    let code = "empty";
    if (/rate|429/i.test(message)) code = "rate_limit";
    else if (/time/i.test(message)) code = "timeout";
    return { code, message };
};

// POST one action to the endpoint. Resolves with the `data` object on success,
// rejects with { code, message } on failure.
export const callWriteWithAI = async (action, payload = {}) => {
    const config = getConfig();
    if (!config.rest_url) {
        throw { code: "missing_key", message: __("Write with AI is not properly initialized.", "betterdocs") };
    }

    try {
        const response = await apiFetch({
            url: config.rest_url,
            method: "POST",
            headers: { "X-WP-Nonce": config.rest_nonce },
            data: { action, post_id: config.post_id, ...payload },
        });

        if (response && response.success && response.data) {
            return response.data;
        }
        const message = (response && response.message) || __("Unexpected response from the server.", "betterdocs");
        throw { code: "empty", message };
    } catch (e) {
        throw toError(e);
    }
};

// POST one action with an uploaded file (multipart/form-data) to the same
// endpoint — used by the "From Attachment" source. apiFetch sends the FormData
// as-is (no JSON encoding) and still attaches the REST nonce. Arrays are sent as
// repeated `key[]` fields so the PHP side reads them as arrays.
export const callWriteWithAIMultipart = async (action, fields = {}, file) => {
    const config = getConfig();
    if (!config.rest_url) {
        throw { code: "missing_key", message: __("Write with AI is not properly initialized.", "betterdocs") };
    }

    const form = new FormData();
    form.append("action", action);
    form.append("post_id", config.post_id || 0);
    Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => form.append(`${key}[]`, item));
        } else if (value !== undefined && value !== null) {
            form.append(key, value);
        }
    });
    if (file) {
        form.append("file", file, file.name);
    }

    try {
        const response = await apiFetch({
            url: config.rest_url,
            method: "POST",
            headers: { "X-WP-Nonce": config.rest_nonce },
            body: form,
        });

        if (response && response.success && response.data) {
            return response.data;
        }
        const message = (response && response.message) || __("Unexpected response from the server.", "betterdocs");
        throw { code: "empty", message };
    } catch (e) {
        throw toError(e);
    }
};

// Ask betterdocs/v1/ai-suggest-terms for AI-suggested terms of one taxonomy,
// based on the freshly generated doc. Resolves with the suggestions array
// ([{ name, term_id, is_new }]); a disabled suite / missing key / upstream
// failure is non-fatal here — it just yields no suggestions for the taxonomy.
export const suggestTerms = async ({ taxonomy, content, title }) => {
    const config = getConfig();
    if (!config.rest_suggest_url) return [];

    try {
        const response = await apiFetch({
            url: config.rest_suggest_url,
            method: "POST",
            headers: { "X-WP-Nonce": config.rest_nonce },
            data: {
                taxonomy,
                post_id: config.post_id,
                content,
                title,
                max_suggestions: 6,
            },
        });

        if (response && response.success && response.data && Array.isArray(response.data.suggestions)) {
            return response.data.suggestions;
        }
        return [];
    } catch (e) {
        return [];
    }
};
