import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import Swal from "sweetalert2";
import {
    hitAAJX,
    isObject,
    useBuilderContext,
    validFieldProps,
    withLabel,
} from "quickbuilder";
import { reembedNeeded } from "./reembedChange";

/**
 * Submit button that warns before a destructive re-embed.
 *
 * Behaves exactly like the standard QuickBuilder button (same loading/saved
 * text states, toast, reload, error handling), EXCEPT: when the field's
 * `reembed_confirm` config is present and the *active* embedding model changed,
 * it shows a confirmation dialog before firing the request. The user must
 * confirm; cancelling aborts the save entirely.
 *
 * The active embedding model is platform-dependent, mirroring the server's
 * re-embed trigger in REST/Settings.php::embed_aichatbot()
 * ($prev_active_embed !== $new_active_embed): a change to the embedding-model
 * field for the current platform, OR a switch of the platform itself, both
 * mean every doc/product gets re-embedded.
 *
 * PHP field config:
 *   'type' => 'reembed_confirm_button',
 *   'reembed_confirm' => array(
 *       'platform_field'  => 'ai_chatbot_chat_provider',
 *       'model_field_map' => array(
 *           'openai' => 'ai_chatbot_embed_model',
 *           'gemini' => 'ai_chatbot_embed_model_gemini',
 *       ),
 *       'title'        => '...',
 *       'message'      => '...',
 *       'confirm_text' => '...',
 *       'cancel_text'  => '...',
 *   ),
 */
const ReembedConfirmButton = ( props ) => {
    const context = useBuilderContext();
    const [ isLoading, setIsLoading ] = useState( false );

    const validProps = validFieldProps( props, [
        "is_pro",
        "visible",
        "disable",
        "parentIndex",
        "context",
        "onBlur",
        "value",
        "ajax",
        "text",
        "reembed_confirm",
    ] );

    // Faithful copy of QuickBuilder Button's submit flow.
    const runRequest = () => {
        if ( ! props?.ajax ) {
            return;
        }
        setIsLoading( true );
        hitAAJX( props.ajax, context )
            .then( ( res ) => {
                setIsLoading( false );
                if ( res?.status == "error" ) {
                    throw new Error( res?.message );
                }
                props.onChange( {
                    target: { type: "button", name: props.name, value: true },
                } );
                if ( ! props.ajax?.hideSwal ) {
                    const type = props.ajax?.swal?.icon || "success";
                    const message = props.ajax?.swal?.text || "Complete";
                    context.alerts.toast( type, message, {
                        autoClose: props.ajax?.swal?.autoClose,
                    } );
                }
                if ( props.ajax?.reload ) {
                    if (
                        typeof props.ajax.reload === "boolean" &&
                        props.ajax.reload
                    ) {
                        setTimeout( () => window.location.reload(), 1000 );
                    } else if ( typeof props.ajax.reload === "string" ) {
                        window.location.href = props.ajax.reload;
                    }
                }
            } )
            .catch( ( err ) => {
                console.error( "Error In ReembedConfirmButton", props.name, err );
                setIsLoading( false );
                props.onChange( {
                    target: { type: "button", name: props.name, value: false },
                } );
                if ( ! props.ajax?.hideSwal ) {
                    context.alerts.toast(
                        "error",
                        err?.message || __( "Something went wrong.", "betterdocs" )
                    );
                }
            } );
    };

    const handleClick = () => {
        if ( ! props?.ajax ) {
            return;
        }
        const cfg = props.reembed_confirm;
        if ( cfg && reembedNeeded( cfg, context.values ) ) {
            Swal.fire( {
                title:
                    cfg.title || __( "Change AI embedding model?", "betterdocs" ),
                text:
                    cfg.message ||
                    __(
                        "This re-embeds all of your content on the AI server and may take a while.",
                        "betterdocs"
                    ),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText:
                    cfg.confirm_text || __( "Yes, re-embed", "betterdocs" ),
                cancelButtonText: cfg.cancel_text || __( "Cancel", "betterdocs" ),
                customClass: { popup: "betterdocs-bulk-action-popup" },
            } ).then( ( result ) => {
                if ( result?.isConfirmed ) {
                    runRequest();
                }
            } );
            return;
        }
        runRequest();
    };

    return (
        <button
            { ...validProps }
            type="button"
            name={ props.name }
            disabled={ isLoading }
            onClick={ handleClick }
            className={ classNames(
                "wprf-control wprf-button wprf-btn",
                props?.classes
            ) }
        >
            { isObject( props?.text ) && props?.ajax
                ? isLoading
                    ? props?.text?.loading
                    : props.value
                    ? props?.text?.saved
                    : props?.text?.normal
                : props?.text }
        </button>
    );
};

export default withLabel( ReembedConfirmButton );
