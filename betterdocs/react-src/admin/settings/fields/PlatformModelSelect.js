import React, { useEffect, useMemo } from 'react';
import ReactSelect from 'react-select';
import { useBuilderContext, withLabel } from 'quickbuilder';

/**
 * Model dropdown whose options follow the selected AI platform.
 *
 * Reads the live `ai_platform` value from the builder context and renders the
 * curated model list for that platform (passed from PHP via the field's
 * `catalogue` / `defaults` props — see ModelRegistry). When the platform
 * changes, or the stored model is not valid for the new platform, it resets the
 * value to that platform's default so the saved `ai_model` is always coherent.
 *
 * Bound to the single global `ai_model` setting; no live API calls.
 */
const toOptions = ( map ) =>
	Object.keys( map || {} ).map( ( value ) => ( { value, label: map[ value ] } ) );

const PlatformModelSelect = ( props ) => {
	const builderContext = useBuilderContext();
	const { name, onChange, placeholder, search = true } = props;

	const platform = builderContext.values?.ai_platform || 'openai';
	const catalogue = props.catalogue || {};
	const defaults = props.defaults || {};

	const options = useMemo( () => toOptions( catalogue[ platform ] ), [ platform ] );
	const currentValue = builderContext.values?.[ name ];

	// Keep the stored model valid for the active platform.
	useEffect( () => {
		const isValid = options.some( ( option ) => option.value === currentValue );
		if ( ! isValid ) {
			const fallback =
				defaults[ platform ] || ( options[ 0 ] && options[ 0 ].value ) || '';
			if ( fallback !== currentValue ) {
				onChange( {
					target: { type: 'select', name, value: fallback, options, multiple: false },
				} );
			}
		}
	}, [ platform ] );

	const selectedOption =
		options.find( ( option ) => option.value === currentValue ) || null;

	return (
		<div className="wprf-select-wrapper">
			<ReactSelect
				className="wprf-select"
				classNamePrefix="wprf-select"
				isSearchable={ search }
				name={ name }
				isMulti={ false }
				placeholder={ placeholder }
				options={ options }
				value={ selectedOption }
				onChange={ ( option ) =>
					onChange( {
						target: {
							type: 'select',
							name,
							value: option?.value,
							options,
							multiple: false,
						},
					} )
				}
			/>
		</div>
	);
};

export default withLabel( PlatformModelSelect );
