import { createHigherOrderComponent } from "@wordpress/compose";
import { Fragment, useState } from "@wordpress/element";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { suggestTerms, i18n, SUPPORTED_TAXONOMIES } from "./api";

// Gradient sparkle icon matching the "Analyze with BetterDocs AI" button. Each
// instance takes a `uid` (the taxonomy slug) so the gradient ids stay unique
// when multiple Suggest buttons render on the same screen.
const SparkleIcon = ( { uid = "s", size = 16 } ) => (
    <svg width={ size } height={ size } viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.32812 10.2207C3.32812 9.93383 3.56132 9.70404 3.84675 9.67574C6.30094 9.43242 8.2527 7.48064 8.49602 5.02643C8.52431 4.741 8.75411 4.50781 9.04093 4.50781C9.32776 4.50781 9.55755 4.741 9.58585 5.02643C9.82917 7.48064 11.7809 9.43242 14.2351 9.67574C14.5205 9.70404 14.7537 9.93383 14.7537 10.2207C14.7537 10.5075 14.5205 10.7373 14.2351 10.7656C11.7809 11.0089 9.82917 12.9607 9.58585 15.4149C9.55755 15.7003 9.32776 15.9335 9.04093 15.9335C8.75411 15.9335 8.52431 15.7003 8.49602 15.4149C8.2527 12.9607 6.30094 11.0089 3.84675 10.7656C3.56132 10.7373 3.32812 10.5075 3.32812 10.2207Z" fill={ `url(#bd-sp0-${ uid })` } />
        <path d="M13.6133 3.93261C13.6133 3.84656 13.6832 3.77762 13.7689 3.76913C14.5051 3.69613 15.0907 3.1106 15.1636 2.37434C15.1721 2.28871 15.2411 2.21875 15.3271 2.21875C15.4132 2.21875 15.4821 2.28871 15.4906 2.37434C15.5636 3.1106 16.1491 3.69613 16.8854 3.76913C16.971 3.77762 17.041 3.84656 17.041 3.93261C17.041 4.01865 16.971 4.08759 16.8854 4.09608C16.1491 4.16908 15.5636 4.75462 15.4906 5.49088C15.4821 5.5765 15.4132 5.64646 15.3271 5.64646C15.2411 5.64646 15.1721 5.5765 15.1636 5.49088C15.0907 4.75462 14.5051 4.16908 13.7689 4.09608C13.6832 4.08759 13.6133 4.01865 13.6133 3.93261Z" fill={ `url(#bd-sp1-${ uid })` } />
        <path d="M12.4727 15.9336C12.4727 15.8188 12.5659 15.7269 12.6801 15.7156C13.6618 15.6183 14.4425 14.8376 14.5398 13.8559C14.5511 13.7417 14.643 13.6484 14.7578 13.6484C14.8725 13.6484 14.9644 13.7417 14.9757 13.8559C15.0731 14.8376 15.8538 15.6183 16.8355 15.7156C16.9496 15.7269 17.0429 15.8188 17.0429 15.9336C17.0429 16.0483 16.9496 16.1402 16.8355 16.1515C15.8538 16.2489 15.0731 17.0296 14.9757 18.0113C14.9644 18.1254 14.8725 18.2187 14.7578 18.2187C14.643 18.2187 14.5511 18.1254 14.5398 18.0113C14.4425 17.0296 13.6618 16.2489 12.6801 16.1515C12.5659 16.1402 12.4727 16.0483 12.4727 15.9336Z" fill={ `url(#bd-sp2-${ uid })` } />
        <defs>
            <linearGradient id={ `bd-sp0-${ uid }` } x1="9.04093" y1="4.50781" x2="9.04093" y2="15.9335" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CD93FF" /><stop offset="1" stopColor="#A741FF" />
            </linearGradient>
            <linearGradient id={ `bd-sp1-${ uid }` } x1="15.3271" y1="2.21875" x2="15.3271" y2="5.64646" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D099FF" /><stop offset="1" stopColor="#CE96FF" />
            </linearGradient>
            <linearGradient id={ `bd-sp2-${ uid }` } x1="14.7578" y1="13.6484" x2="14.7578" y2="18.2187" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D099FF" /><stop offset="1" stopColor="#CE96FF" />
            </linearGradient>
        </defs>
    </svg>
);

/**
 * The "Suggest …" control rendered beneath a native taxonomy panel. Reads the
 * live editor content, asks the AI for term names, and lets the author add each
 * suggestion as a term — driving the canonical post attribute (key = taxonomy
 * slug, since doc_category / doc_tag have no rest_base) so the native
 * checkboxes/tokens update immediately.
 */
function SuggestPanel( { slug } ) {
    const [ loading, setLoading ] = useState( false );
    const [ suggestions, setSuggestions ] = useState( [] );
    const [ error, setError ] = useState( "" );
    const [ notice, setNotice ] = useState( "" );

    const { postId, content, title, selected } = useSelect(
        ( select ) => {
            const editor = select( "core/editor" );
            return {
                postId: editor.getCurrentPostId(),
                content: editor.getEditedPostContent(),
                title: editor.getEditedPostAttribute( "title" ),
                selected: editor.getEditedPostAttribute( slug ) || [],
            };
        },
        [ slug ]
    );

    const { editPost } = useDispatch( "core/editor" );
    const { saveEntityRecord } = useDispatch( "core" );

    const labelMap = {
        doc_category: i18n.suggestCategories,
        doc_tag: i18n.suggestTags,
    };
    const label = labelMap[ slug ] || i18n.suggestTags;

    // An empty result is a valid "nothing matched" outcome, not a failure — so it
    // gets a calm notice rather than the red error styling.
    const emptyNotice = i18n.noSuggestions;

    const fetchSuggestions = async () => {
        setLoading( true );
        setError( "" );
        setNotice( "" );
        try {
            const res = await suggestTerms( {
                taxonomy: slug,
                postId,
                content,
                title,
                maxSuggestions: 6,
            } );
            const list = ( res && res.data && res.data.suggestions ) || [];
            setSuggestions( list );
            if ( ! list.length ) {
                setNotice( emptyNotice );
            }
        } catch ( e ) {
            setError( ( e && e.message ) || i18n.error );
        } finally {
            setLoading( false );
        }
    };

    const addTerm = async ( suggestion, index ) => {
        setError( "" );
        setNotice( "" );
        try {
            let termId = suggestion.term_id;

            if ( ! termId ) {
                const created = await saveEntityRecord( "taxonomy", slug, {
                    name: suggestion.name,
                } );
                termId = created && created.id;
            }

            if ( ! termId ) {
                return;
            }

            const current = ( selected || [] ).map( Number );
            if ( ! current.includes( Number( termId ) ) ) {
                editPost( { [ slug ]: [ ...current, Number( termId ) ] } );
            }

            setSuggestions( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
        } catch ( e ) {
            const status = e && ( e.status || ( e.data && e.data.status ) );
            const denied =
                status === 403 ||
                ( e && e.code === "rest_cannot_create" ) ||
                ( e && e.code === "rest_forbidden" );
            setError( denied ? i18n.permissionError : ( ( e && e.message ) || i18n.error ) );
        }
    };

    return (
        <div className="betterdocs-docs-ai-suggest">
            <Button
                variant="secondary"
                className="betterdocs-docs-ai-suggest__btn"
                onClick={ fetchSuggestions }
                disabled={ loading }
            >
                <SparkleIcon uid={ slug } size={ 16 } />
                { loading ? i18n.suggesting : label }
            </Button>

            { !! error && (
                <p className="betterdocs-docs-ai__error">{ error }</p>
            ) }

            { !! notice && ! error && (
                <p className="betterdocs-docs-ai__notice">{ notice }</p>
            ) }

            { !! suggestions.length && (
                <div className="betterdocs-docs-ai-suggest__chips">
                    { suggestions.map( ( s, i ) => (
                        <button
                            type="button"
                            key={ `${ s.name }-${ i }` }
                            className="betterdocs-docs-ai-chip"
                            onClick={ () => addTerm( s, i ) }
                        >
                            <span className="betterdocs-docs-ai-chip__plus">+</span>
                            <span className="betterdocs-docs-ai-chip__name">
                                { s.name }
                            </span>
                            { s.is_new && (
                                <span className="betterdocs-docs-ai-chip__new">
                                    { i18n.newBadge }
                                </span>
                            ) }
                        </button>
                    ) ) }
                </div>
            ) }
        </div>
    );
}

/**
 * Wraps the native per-taxonomy panel (filter `editor.PostTaxonomyType`). Passes
 * non-doc taxonomies through untouched; appends the Suggest control only for
 * doc_category / doc_tag.
 */
export const withSuggestTerms = createHigherOrderComponent( ( OriginalComponent ) => {
    return ( props ) => {
        const { slug } = props;

        if ( ! SUPPORTED_TAXONOMIES.includes( slug ) ) {
            return <OriginalComponent { ...props } />;
        }

        return (
            <Fragment>
                <OriginalComponent { ...props } />
                <SuggestPanel slug={ slug } />
            </Fragment>
        );
    };
}, "withBetterDocsSuggestTerms" );
