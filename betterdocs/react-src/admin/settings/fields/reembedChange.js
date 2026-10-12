/**
 * Shared "did the active embedding model change?" detection, used by both the
 * inline re-embed notice (ReembedNotice) and the confirm-on-save button
 * (ReembedConfirmButton).
 *
 * The active embedding model is platform-dependent, so a change means either the
 * platform switched, or the embedding-model field for the current platform
 * changed. This mirrors the server's re-embed trigger in
 * REST/Settings.php::embed_aichatbot() ($prev_active_embed !== $new_active_embed).
 */

// Pristine copy of the persisted settings, snapshotted at module load — BEFORE
// the settings app mutates the global `betterdocsAdminSettings.values` in place
// (it reassigns `.values = builder.values` on every change). This is the client
// baseline, equivalent to the server's $prev_active_embed read from the DB. The
// framework localizes only `values`, not a savedValues baseline, so we capture
// one here.
export const ORIGINAL_VALUES =
    typeof window !== "undefined" &&
    window.betterdocsAdminSettings &&
    window.betterdocsAdminSettings.values
        ? { ...window.betterdocsAdminSettings.values }
        : {};

const activeModel = ( cfg, platform, source ) => {
    const field = cfg && cfg.model_field_map && cfg.model_field_map[ platform ];
    return field ? source && source[ field ] : undefined;
};

// True when the AI platform differs from the persisted baseline.
export const platformChanged = ( cfg, values ) => {
    if ( ! cfg || ! cfg.platform_field ) {
        return false;
    }
    const savedPlatform = ORIGINAL_VALUES[ cfg.platform_field ];
    // No persisted baseline (fresh install / nothing embedded yet) → nothing to
    // re-embed, so don't warn.
    if ( savedPlatform === undefined ) {
        return false;
    }
    return savedPlatform !== ( values && values[ cfg.platform_field ] );
};

// True when the active embedding model differs from the persisted baseline. With
// the platform unchanged this compares the same platform's model field; after a
// platform switch the active model field differs, so this is also true.
const embedModelChanged = ( cfg, values ) => {
    if ( ! cfg || ! cfg.platform_field ) {
        return false;
    }
    const savedPlatform = ORIGINAL_VALUES[ cfg.platform_field ];
    if ( savedPlatform === undefined ) {
        return false;
    }
    const nowPlatform = values && values[ cfg.platform_field ];
    return (
        activeModel( cfg, savedPlatform, ORIGINAL_VALUES ) !==
        activeModel( cfg, nowPlatform, values )
    );
};

// Any re-embed-triggering change — used by the Save-time confirm dialog.
export const reembedNeeded = ( cfg, values ) =>
    platformChanged( cfg, values ) || embedModelChanged( cfg, values );

// Embedding model changed while the platform stayed the same — used by the
// embed-model field notice. (When the platform changes, the platform notice
// covers it, so we suppress the embed notice.)
export const embedModelChangedOnly = ( cfg, values ) =>
    ! platformChanged( cfg, values ) && embedModelChanged( cfg, values );
