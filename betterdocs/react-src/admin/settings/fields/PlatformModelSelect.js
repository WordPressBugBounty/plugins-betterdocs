import React, { useEffect, useMemo, useRef, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import ReactSelect from 'react-select';
import { useBuilderContext, withLabel } from 'quickbuilder';
import '../../scss/model-select.scss';

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
// Each option carries its list price and tier when ModelRegistry knows them (#249),
// listed recommended → standard → older → premium like the AI Chatbot's picker.
// Models with no tier go last; ties keep their catalogue order.
const TIER_ORDER = [ 'recommended', 'standard', 'legacy', 'premium' ];
const tierRank = ( option ) => {
	const rank = TIER_ORDER.indexOf( option.tier );
	return rank === -1 ? TIER_ORDER.length : rank;
};
const toOptions = ( map, meta = {} ) =>
	Object.keys( map || {} )
		.map( ( value ) => ( { value, label: map[ value ], ...( meta[ value ] || {} ) } ) )
		.sort( ( a, b ) => tierRank( a ) - tierRank( b ) );

const TIERS = {
	recommended: __( 'Recommended', 'betterdocs' ),
	legacy: __( 'Older', 'betterdocs' ),
	premium: __( 'Premium', 'betterdocs' ),
};

// $2 → "$2", $0.6 → "$0.60", $0.075 → "$0.075"
const money = ( n ) => {
	if ( n === null || n === undefined ) return '—';
	if ( Number.isInteger( n ) ) return `$${ n }`;
	if ( n < 0.1 ) return `$${ n.toFixed( 3 ).replace( /0$/, '' ) }`;
	return `$${ n.toFixed( 2 ) }`;
};

// What a doc written with AI is assumed to read: the prompt, the title and
// the site's instructions. Its output is the site's own max-token setting.
const DOC_INPUT_TOKENS = 1000;

const OptionRow = ( { option, compact } ) => (
	<span className={ `betterdocs-model-opt${ compact ? ' is-compact' : '' }` }>
		<span className="betterdocs-model-opt__main">
			<span className="betterdocs-model-opt__name">
				<span className="betterdocs-model-opt__label" title={ option.label }>{ option.label }</span>
				{ /* The closed field keeps only the warning badges (Older, Premium), so the name has room. */ }
				{ TIERS[ option.tier ] && ! ( compact && 'recommended' === option.tier ) && (
					<span className={ `betterdocs-model-opt__tier is-${ option.tier }` }>{ TIERS[ option.tier ] }</span>
				) }
			</span>
			{ ! compact && option.note && <span className="betterdocs-model-opt__note">{ option.note }</span> }
		</span>
		{ option.input !== undefined && (
			<span className="betterdocs-model-opt__price" title={ __( 'USD per 1M tokens, input / output', 'betterdocs' ) }>
				{ money( option.input ) } <i>/</i> { money( option.output ) }
			</span>
		) }
	</span>
);

// Same families as AIHelper::token_family() and MinTokenNumber: GPT-6 and the
// gpt-5.x point releases share the heaviest floor.
const tokenFamily = ( model ) => {
	const id = String( model || '' );
	if ( /^gpt-(?:6|5\.\d)/.test( id ) ) {
		return 'gpt-6';
	}
	return 0 === id.indexOf( 'gpt-5' ) ? 'gpt-5' : 'gpt-4';
};

const PlatformModelSelect = ( props ) => {
	const builderContext = useBuilderContext();
	const { name, onChange, placeholder, search = true } = props;

	const platform = builderContext.values?.ai_platform || 'openai';
	const catalogue = props.catalogue || {};
	const defaults = props.defaults || {};

	const meta = props.model_meta || {};
	const options = useMemo( () => toOptions( catalogue[ platform ], meta[ platform ] ), [ platform ] );
	const priced = options.some( ( option ) => option.input !== undefined );
	const currentValue = builderContext.values?.[ name ];
	const tokenFloors = props.token_floors || {};
	const [ raisedNotice, setRaisedNotice ] = useState( '' );

	// The server refuses a save whose max-token fields sit below the model's
	// floor. Raise them as soon as the model is chosen (or on load, for a site
	// moved onto a heavier model), and say so — never lower them.
	const raiseTokenFloors = ( model ) => {
		const family = tokenFamily( model );
		const raised = [];
		let floor = 0;
		Object.keys( tokenFloors ).forEach( ( field ) => {
			const min = parseInt( tokenFloors[ field ]?.map?.[ family ] ?? 0, 10 );
			const stored = builderContext.values?.[ field ];
			const current = parseInt( stored ?? 0, 10 );
			if ( min > 0 && ( Number.isNaN( current ) || current < min ) ) {
				builderContext.setFieldValue( field, min );
				raised.push( tokenFloors[ field ]?.label || field );
				floor = Math.max( floor, min );
			}
		} );
		setRaisedNotice(
			raised.length
				? sprintf(
						/* translators: 1: feature names, e.g. "Write with AI, AI Doc Summarizer", 2: minimum tokens, 3: model name */
						__( 'Max tokens for %1$s raised to %2$s, the minimum for %3$s. Save to keep it.', 'betterdocs' ),
						raised.join( ', ' ),
						floor.toLocaleString(),
						options.find( ( option ) => option.value === model )?.label || model
				  )
				: ''
		);
	};

	// A site already on a heavier model (e.g. moved there by the retired-model
	// migration) gets its fields raised when the tab opens. Runs once, after
	// every token field has its stored value — before that a later
	// initialisation would overwrite the raise — and never again, so it cannot
	// fight a value the user types.
	const checkedOnLoad = useRef( false );
	const tokenValues = Object.keys( tokenFloors ).map( ( field ) => builderContext.values?.[ field ] );
	useEffect( () => {
		if ( checkedOnLoad.current || ! currentValue ) {
			return undefined;
		}
		if ( tokenValues.some( ( value ) => typeof value === 'undefined' ) ) {
			return undefined;
		}
		const timer = setTimeout( () => {
			checkedOnLoad.current = true;
			raiseTokenFloors( currentValue );
		}, 0 );
		return () => clearTimeout( timer );
	}, [ currentValue, ...tokenValues ] );

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
				raiseTokenFloors( fallback );
			}
		}
	}, [ platform ] );

	const selectedOption =
		options.find( ( option ) => option.value === currentValue ) || null;

	return (
		<div className={ `wprf-select-wrapper${ priced ? ' betterdocs-model-select' : '' }` }>
			<ReactSelect
				className="wprf-select"
				classNamePrefix="wprf-select"
				isSearchable={ search }
				name={ name }
				isMulti={ false }
				placeholder={ placeholder }
				// One group when prices are known, so the list says what they mean.
				options={ priced ? [ { label: __( 'USD per 1M tokens · input / output', 'betterdocs' ), options } ] : options }
				formatOptionLabel={ priced ? ( option, { context } ) => <OptionRow option={ option } compact={ context === 'value' } /> : undefined }
				value={ selectedOption }
				onChange={ ( option ) => {
					onChange( {
						target: {
							type: 'select',
							name,
							value: option?.value,
							options,
							multiple: false,
						},
					} );
					raiseTokenFloors( option?.value );
				} }
			/>
			{ selectedOption?.input !== undefined && ( () => {
				const maxOut = parseInt( builderContext.values?.ai_autowrite_max_token, 10 ) || 2500;
				const per100 = ( 100 * ( DOC_INPUT_TOKENS * selectedOption.input + maxOut * selectedOption.output ) ) / 1000000;
				return (
					<div className={ `betterdocs-model-estimate${ selectedOption.tier === 'premium' ? ' is-premium' : '' }` } role="note">
						<p>
							<b>{ sprintf(
								/* translators: %s: amount in USD. */
								__( 'Up to ≈ %s per 100 docs written with AI', 'betterdocs' ),
								money( Math.round( per100 * 100 ) / 100 )
							) }</b>
							{ selectedOption.tier === 'premium' && ` ${ __( 'One of the most expensive models; most sites don’t need it.', 'betterdocs' ) }` }
						</p>
						<small>{ sprintf(
							/* translators: 1: max output tokens, 2: date */
							__( 'At your Write with AI maximum of %1$s tokens per doc, billed to your own key. List prices as of %2$s; your provider bills the exact amount.', 'betterdocs' ),
							maxOut.toLocaleString(),
							props.prices_as_of
								? new Date( `${ props.prices_as_of }T00:00:00Z` ).toLocaleDateString( undefined, { dateStyle: 'medium', timeZone: 'UTC' } )
								: ''
						) }</small>
					</div>
				);
			} )() }
			{ raisedNotice && (
				<div className="betterdocs-min-token-notice betterdocs-min-token-raised" role="status">
					{ raisedNotice }
				</div>
			) }
		</div>
	);
};

export default withLabel( PlatformModelSelect );
