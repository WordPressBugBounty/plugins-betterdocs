<?php

namespace WPDeveloper\BetterDocs\AI;

/**
 * Curated, static catalogue of platforms and their chat models.
 *
 * Single source of truth for:
 *  - the platform selector + model dropdown in Settings (localized to React),
 *  - server-side validation that a (platform, model) pair is allowed,
 *  - the per-platform default model used when none is stored.
 *
 * Model identifiers move fast; update the lists here on new releases, or filter
 * `betterdocs_ai_models` to add/replace entries without touching core.
 *
 * @since 4.4.0
 */
class ModelRegistry {

    /**
     * Ordered list of supported platforms (id => label).
     *
     * @return array<string,string>
     */
    public static function platforms() {
        return apply_filters( 'betterdocs_ai_platforms', array(
            'openai'     => 'OpenAI',
            'gemini'     => 'Google Gemini',
            'claude'     => 'Anthropic Claude',
        ) );
    }

    /**
     * Full model catalogue: platform => array( model_id => label ).
     *
     * NOTE: verify model ids against each provider's current docs at release
     * time. Anthropic/Gemini ids in particular rotate frequently.
     *
     * @return array<string,array<string,string>>
     */
    public static function catalogue() {
        $catalogue = array(
            // Every id here is callable on the API. `gpt-4.1-nano` was removed
            // because OpenAI shuts it down on 2026-10-23. `gpt-5.5` was removed
            // by product decision when OpenAI retired it from ChatGPT; its API
            // replacement is the GPT-6 line below.
            'openai' => array(
                'gpt-4o-mini'  => 'GPT-4o Mini',
                'gpt-4o'       => 'GPT-4o',
                'gpt-4.1-mini' => 'GPT-4.1 Mini',
                'gpt-4.1'      => 'GPT-4.1',
                'gpt-5-nano'   => 'GPT-5 Nano',
                'gpt-5-mini'   => 'GPT-5 Mini',
                'gpt-5'        => 'GPT-5',
                'gpt-6-luna'   => 'GPT-6 Luna',
                'gpt-6.1-sol'  => 'GPT-6.1 Sol',
                'gpt-6-astra'  => 'GPT-6 Astra',
            ),
            // Cheapest first. Every id here is verified callable with a newly issued
            // Google API key. `gemini-2.5-flash` / `-flash-lite` / `-pro` were removed:
            // Google closed them to new users, and they still appear in ListModels while
            // :generateContent answers 404 "no longer available to new users" — so the
            // failure only surfaces at the first real request. The `-latest` aliases
            // lead because Google re-points them and they cannot go stale that way.
            'gemini' => array(
                'gemini-flash-lite-latest' => 'Gemini Flash Lite (latest)',
                'gemini-3.5-flash-lite'    => 'Gemini 3.5 Flash Lite',
                'gemini-flash-latest'      => 'Gemini Flash (latest)',
                'gemini-3.5-flash'         => 'Gemini 3.5 Flash',
                'gemini-3.6-flash'         => 'Gemini 3.6 Flash',
                'gemini-3.8-flash'         => 'Gemini 3.8 Flash',
                'gemini-pro-latest'        => 'Gemini Pro (latest)',
            ),
            // Cheapest/fastest first. `claude-opus-4-1` (retired 2026-08-05) and
            // `claude-sonnet-4-5` (retires 2026-11-30) were removed — offering them
            // hands a site a model that 404s.
            //
            // Opus 4.7+ and every Claude 5.x model reject `temperature` outright (400),
            // and the 5.x models think by default with `max_tokens` covering thinking
            // AND the answer. ClaudeProvider handles both — see rejects_sampling()
            // and thinks_by_default() there before adding a model here.
            'claude' => array(
                'claude-haiku-4-5'  => 'Claude Haiku 4.5',
                'claude-haiku-5-5'  => 'Claude Haiku 5.5',
                'claude-sonnet-5'   => 'Claude Sonnet 5',
                'claude-sonnet-5-5' => 'Claude Sonnet 5.5',
                'claude-opus-4-8'   => 'Claude Opus 4.8',
                'claude-opus-5'     => 'Claude Opus 5',
                'claude-opus-5-5'   => 'Claude Opus 5.5',
            ),
        );

        return apply_filters( 'betterdocs_ai_models', $catalogue );
    }

    /**
     * Default model id per platform.
     *
     * @return array<string,string>
     */
    public static function defaults() {
        return apply_filters( 'betterdocs_ai_default_models', array(
            'openai'     => 'gpt-4o-mini',
            // Auto-rolling alias, not a pinned version: the previous default here was
            // gemini-2.5-flash, which Google has closed to new API keys, so every new
            // Gemini install started on a model that 404s.
            'gemini'     => 'gemini-flash-latest',
            // Sonnet 5 is the best speed/intelligence balance in the Claude line and
            // is safe as a default now that ClaudeProvider drops `temperature` and
            // raises the token floor for thinking models.
            'claude'     => 'claude-sonnet-5',
        ) );
    }

    /**
     * Speech-to-text model per platform, for audio and video attachments.
     *
     * Kept apart from the chat catalogue above because it is not a user choice:
     * the Settings model picker selects the model that *writes the doc*, while
     * transcription is a fixed preprocessing step. A platform absent from this
     * map cannot transcribe, which is what Core\WriteWithAI::platform_supports()
     * reads — so adding a key here is all it takes to light up a new provider.
     *
     * @since 4.9.4
     *
     * @return array<string,string>
     */
    public static function transcription_models() {
        return apply_filters( 'betterdocs_ai_transcription_models', array(
            // Cheaper and faster than whisper-1 at comparable accuracy, and it
            // accepts the same container list — including video, whose audio
            // track the endpoint extracts server-side.
            'openai' => 'gpt-4o-mini-transcribe',
            // Gemini has no speech endpoint; the media rides inline in an
            // ordinary generateContent call, so this is a normal chat model.
            'gemini' => 'gemini-flash-latest',
        ) );
    }

    /**
     * The transcription model for a platform, or '' when it cannot transcribe.
     *
     * @since 4.9.4
     *
     * @param string $platform
     * @return string
     */
    public static function transcription_model( $platform ) {
        $models = self::transcription_models();
        return isset( $models[ $platform ] ) ? (string) $models[ $platform ] : '';
    }

    /**
     * Models for one platform (model_id => label). Empty array if unknown.
     *
     * @param string $platform
     * @return array<string,string>
     */
    public static function models( $platform ) {
        $catalogue = self::catalogue();
        return isset( $catalogue[ $platform ] ) ? $catalogue[ $platform ] : array();
    }

    /**
     * Default model id for a platform, falling back to its first listed model.
     *
     * @param string $platform
     * @return string
     */
    public static function default_model( $platform ) {
        $defaults = self::defaults();
        if ( ! empty( $defaults[ $platform ] ) ) {
            return $defaults[ $platform ];
        }
        $models = self::models( $platform );
        if ( empty( $models ) ) {
            return '';
        }
        reset( $models );
        return (string) key( $models );
    }

    /** When the list prices in meta() were last checked; shown under the pickers. */
    const PRICES_AS_OF = '2026-10-28';

    /**
     * Price and advice for each model (#249): USD per 1M tokens in / out, a tier
     * (recommended | standard | legacy | premium — a badge, never a removal) and
     * a short note. List prices move: verify each against the provider's pricing
     * page at release and update PRICES_AS_OF. Aliases (`-latest`) take the price
     * of what they point to today.
     *
     * @since 4.9.6
     *
     * @return array<string,array{input:float,output:float,tier:string,note:string}>
     */
    public static function meta() {
        $row  = function ( $input, $output, $tier, $note = '' ) {
            return array( 'input' => $input, 'output' => $output, 'tier' => $tier, 'note' => $note );
        };
        $meta = array(
            // OpenAI.
            'gpt-6-luna'               => $row( 0.10, 0.50, 'recommended', __( 'Current small model, cheapest', 'betterdocs' ) ),
            'gpt-6.1-sol'              => $row( 2.00, 10.00, 'recommended', __( 'Best answers for the price', 'betterdocs' ) ),
            'gpt-5-mini'               => $row( 0.25, 2.00, 'standard' ),
            'gpt-5'                    => $row( 1.25, 10.00, 'standard' ),
            'gpt-4o-mini'              => $row( 0.15, 0.60, 'standard' ),
            'gpt-5-nano'               => $row( 0.05, 0.40, 'standard' ),
            'gpt-4.1-mini'             => $row( 0.40, 1.60, 'legacy' ),
            'gpt-4.1'                  => $row( 2.00, 8.00, 'legacy' ),
            'gpt-4o'                   => $row( 2.50, 10.00, 'legacy' ),
            'gpt-6-astra'              => $row( 10.00, 50.00, 'premium', __( 'About 100× GPT-6 Luna', 'betterdocs' ) ),
            // Anthropic.
            'claude-haiku-5-5'         => $row( 0.10, 0.50, 'recommended' ),
            'claude-sonnet-5-5'        => $row( 2.00, 10.00, 'recommended' ),
            'claude-sonnet-5'          => $row( 2.00, 10.00, 'standard' ),
            'claude-haiku-4-5'         => $row( 1.00, 5.00, 'legacy', __( '10× Haiku 5.5', 'betterdocs' ) ),
            'claude-opus-4-8'          => $row( 5.00, 25.00, 'legacy' ),
            'claude-opus-5'            => $row( 5.00, 25.00, 'legacy' ),
            'claude-opus-5-5'          => $row( 4.00, 20.00, 'premium' ),
            // Google. Flash is announced to rise to 1.50 / 7.50 on 2027-01-01, and
            // Pro (latest) to 4 / 20 on 2026-12-01.
            'gemini-flash-lite-latest' => $row( 0.30, 2.50, 'recommended', __( 'Cheapest, kept current by Google', 'betterdocs' ) ),
            'gemini-flash-latest'      => $row( 0.75, 3.75, 'recommended', __( 'Kept current by Google', 'betterdocs' ) ),
            'gemini-3.5-flash-lite'    => $row( 0.30, 2.50, 'standard' ),
            'gemini-3.8-flash'         => $row( 0.75, 3.75, 'standard' ),
            'gemini-3.6-flash'         => $row( 0.75, 3.75, 'legacy' ),
            'gemini-3.5-flash'         => $row( 1.50, 9.00, 'legacy' ),
            'gemini-pro-latest'        => $row( 2.00, 10.00, 'premium' ),
            // Embeddings (input only), for the add-ons' embedding pickers.
            'text-embedding-3-small'   => $row( 0.02, 0.0, 'recommended' ),
            'text-embedding-3-large'   => $row( 0.13, 0.0, 'standard' ),
            'text-embedding-ada-002'   => $row( 0.10, 0.0, 'legacy' ),
            'gemini-embedding-2'       => $row( 0.20, 0.0, 'recommended' ),
        );

        /**
         * Model prices and tiers shown in the model pickers (USD per 1M tokens).
         *
         * @since 4.9.6
         *
         * @param array $meta model_id => {input, output, tier, note}
         */
        return (array) apply_filters( 'betterdocs_ai_model_prices', $meta );
    }

    /**
     * [input, output] USD per 1M tokens for a model, or null when unknown.
     *
     * @since 4.9.6
     *
     * @param string $model
     * @return array{0:float,1:float}|null
     */
    public static function price( $model ) {
        $meta = self::meta();
        if ( ! isset( $meta[ $model ]['input'] ) ) {
            return null;
        }
        return array( (float) $meta[ $model ]['input'], (float) ( $meta[ $model ]['output'] ?? 0 ) );
    }

    /**
     * A model's tier, or '' when unknown.
     *
     * @since 4.9.6
     */
    public static function tier( $model ) {
        $meta = self::meta();
        return (string) ( $meta[ $model ]['tier'] ?? '' );
    }

    /**
     * platform => model_id => {input, output, tier, note} for the models in
     * catalogue(), for the pickers.
     *
     * @since 4.9.6
     *
     * @return array<string,array<string,array>>
     */
    public static function catalogue_meta() {
        $meta = self::meta();
        $out  = array();
        foreach ( self::catalogue() as $platform => $models ) {
            foreach ( array_keys( $models ) as $model ) {
                if ( isset( $meta[ $model ] ) ) {
                    $out[ $platform ][ $model ] = $meta[ $model ];
                }
            }
        }
        return $out;
    }

    /**
     * Removed model => the model a site on it moves to. One map for Free's
     * migration and the add-ons (the AI Chatbot keeps its own only as the
     * fallback for older Free).
     *
     * @since 4.9.6
     *
     * @return array<string,string>
     */
    public static function successors() {
        return apply_filters( 'betterdocs_ai_model_successors', array(
            'gpt-5.5'           => 'gpt-6.1-sol',
            'gpt-4.1-nano'      => 'gpt-6-luna',
            'claude-sonnet-4-5' => 'claude-sonnet-5-5',
            'gemini-2.5-pro'    => 'gemini-pro-latest',
        ) );
    }

    /**
     * Whether a platform id is supported.
     *
     * @param string $platform
     * @return bool
     */
    public static function has_platform( $platform ) {
        $platforms = self::platforms();
        return isset( $platforms[ $platform ] );
    }

    /**
     * Whether a (platform, model) pair exists in the catalogue.
     *
     * @param string $platform
     * @param string $model
     * @return bool
     */
    public static function has_model( $platform, $model ) {
        $models = self::models( $platform );
        return isset( $models[ $model ] );
    }
}
