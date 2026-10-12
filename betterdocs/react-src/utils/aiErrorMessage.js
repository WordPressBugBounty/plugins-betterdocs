import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";

/**
 * Normalize any AI-request rejection into a friendly, human-readable string.
 *
 * The AI Content Suite modals (FAQ AI, Glossary AI, Write/Edit with AI) all hit
 * REST endpoints that, on a provider failure, return a WP_Error. Depending on the
 * transport the rejection carries the message inconsistently — sometimes at
 * `error.message`, sometimes `error.data.message`, sometimes `error.responseJSON.message`
 * — and some reset paths stored a bare object. Reading `${error.message}` blindly
 * printed "undefined", and storing the object printed "[object Object]".
 *
 * This always returns a string, extracts the message in priority order, and maps the
 * common "bad API key" case (the provider text on an OpenAI 401) to an actionable line.
 *
 * @param {*}      error    The caught rejection (object, Error, string or nullish).
 * @param {string} fallback Optional generic message when nothing usable is found.
 * @return {string} A human-readable, non-empty error string.
 */
export const normalizeAIError = ( error, fallback ) => {
	const generic =
		fallback || __( "Something went wrong. Please try again.", "betterdocs" );

	if ( ! error ) {
		return generic;
	}
	if ( typeof error === "string" ) {
		return error;
	}

	const code =
		error.code || ( error.data && error.data.code ) || "";
	const status =
		( error.data && error.data.status ) != null
			? error.data.status
			: error.status;

	const raw =
		( error.data && error.data.message ) ||
		error.message ||
		( error.responseJSON && error.responseJSON.message ) ||
		"";
	const rawText = typeof raw === "string" ? raw : "";

	// The provider wraps an OpenAI 401 as "Incorrect API key provided: ...". Surface a
	// single, actionable line that points at where the key is configured.
	const looksLikeBadKey =
		status === 401 ||
		status === 403 ||
		code === "invalid_api_key" ||
		code === "incorrect_api_key" ||
		code === "missing_key" ||
		/incorrect api key|invalid api key|unauthor|api key/i.test( rawText );

	if ( looksLikeBadKey ) {
		return __(
			"Incorrect or missing API key. Check your key in Settings → AI Content Suite.",
			"betterdocs"
		);
	}

	return rawText ? decodeEntities( rawText ) : generic;
};

export default normalizeAIError;
