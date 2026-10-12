import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import {
	GenericInput,
	useBuilderContext,
	validFieldProps,
	withLabel
} from 'quickbuilder';

/**
 * Number input that shows an inline warning when its value falls below
 * the per-model minimum defined in `props.min_token_map`. The minimum is
 * keyed by the family of the currently-selected model field
 * (`props.model_field` -> read live from builderContext.values).
 *
 * Renders through quickbuilder's GenericInput + withLabel so the DOM
 * structure and styling match every other number field in BetterDocs
 * settings. The notice is informational only — actual save blocking
 * happens server-side in Core/Settings.php::save_settings().
 */
const MinTokenNumber = (props) => {
	const builderContext = useBuilderContext();

	const liveValue = builderContext.values?.[props.name];
	const currentVal = parseInt(
		typeof liveValue !== 'undefined' ? liveValue : props.value ?? props.default ?? 0,
		10
	);

	const currentModel = String(builderContext.values?.[props.model_field] ?? '');
	// gpt-5.x point releases (e.g. gpt-5.5) need a heavier token floor and longer
	// server limits than the base gpt-5 family, so they get their own map key.
	const isPointRelease = /^gpt-5\.\d/.test(currentModel);
	const family = isPointRelease
		? 'gpt-5.5'
		: currentModel.indexOf('gpt-5') === 0
			? 'gpt-5'
			: 'gpt-4';
	const minToken = parseInt(props.min_token_map?.[family] ?? 0, 10);
	const isBelow = minToken > 0 && currentVal < minToken;

	// Strip our custom props so they don't leak as HTML attributes on the input.
	const validProps = validFieldProps(props, ['min_token_map', 'model_field', 'context']);

	return (
		<>
			<GenericInput {...validProps} type="number" min={1} />
			{isBelow && (
				<div className="betterdocs-min-token-notice" role="alert">
					{sprintf(
						/* translators: 1: minimum number of tokens, 2: model identifier */
						__(
							'Recommended minimum is %1$d tokens for %2$s. Lower values can cause empty or truncated responses.',
							'betterdocs'
						),
						minToken,
						currentModel || family
					)}
				</div>
			)}
			{isPointRelease && (
				<div className="betterdocs-min-token-notice betterdocs-server-time-notice" role="alert">
					{__(
						'GPT-5.5 produces large, slow responses. Raise your server limits before using it — increase PHP max execution time / your web-server timeout (e.g. 300 seconds) and memory_limit, or generation may time out before it finishes.',
						'betterdocs'
					)}
				</div>
			)}
		</>
	);
};

export default withLabel(MinTokenNumber);
