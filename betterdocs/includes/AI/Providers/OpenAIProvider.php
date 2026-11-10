<?php

namespace WPDeveloper\BetterDocs\AI\Providers;

use WPDeveloper\BetterDocs\Utils\AIHelper;

/**
 * OpenAI Chat Completions provider.
 *
 * Adds the reasoning-model handling on top of the shared OpenAI-compatible base:
 * GPT-5 and GPT-6 models require `max_completion_tokens`, reject a custom
 * temperature, and bill internal reasoning against the output budget — so we
 * send a low `reasoning_effort` to avoid empty completions. Each generation
 * accepts a different lowest effort (see default_reasoning_effort()).
 *
 * @since 4.4.0
 */
class OpenAIProvider extends OpenAICompatibleProvider {

    public function id() {
        return 'openai';
    }

    public function label() {
        return 'OpenAI';
    }

    protected function base_url() {
        return 'https://api.openai.com/v1';
    }

    /**
     * {@inheritDoc}
     */
    protected function build_payload( $model, $messages, $max_tokens, $temperature = null ) {
        if ( AIHelper::is_reasoning_model( $model ) ) {
            return array(
                'model'                 => $model,
                'messages'              => $messages,
                'max_completion_tokens' => (int) $max_tokens,
                'reasoning_effort'      => $this->reasoning_effort( $model, $max_tokens ),
            );
        }

        return parent::build_payload( $model, $messages, $max_tokens, $temperature );
    }

    /**
     * Transcribe audio or video via OpenAI's speech-to-text endpoint.
     *
     * The endpoint accepts video containers (mp4, webm, mpeg) as well as audio
     * and reads the audio track out of them, which is why this feature needs no
     * ffmpeg on the host — something no WordPress host can be assumed to have.
     *
     * `response_format=text` returns the transcript as a bare string rather than
     * JSON; we ask for `json` instead so a provider error still decodes into the
     * usual `{ error: { message } }` shape that post_multipart() can report.
     *
     * @param array $file    `[ 'path', 'filename', 'mime' ]`
     * @param array $options `[ 'model', 'timeout' ]`
     * @return string|\WP_Error
     */
    public function transcribe( $file, $options = array() ) {
        if ( empty( $this->api_key ) ) {
            return new \WP_Error( 'no_api_key', sprintf(
                /* translators: %s: provider label */
                __( '%s API key is not configured.', 'betterdocs' ),
                $this->label()
            ) );
        }

        $model   = ! empty( $options['model'] ) ? (string) $options['model'] : 'gpt-4o-mini-transcribe';
        $timeout = isset( $options['timeout'] ) ? (int) $options['timeout'] : 120;
        $status  = null;

        $data = $this->post_multipart(
            $this->base_url() . '/audio/transcriptions',
            array( 'Authorization' => 'Bearer ' . $this->api_key ),
            array(
                'model'           => $model,
                'response_format' => 'json',
            ),
            array(
                'name'     => 'file',
                'filename' => $file['filename'],
                'type'     => $file['mime'],
                'path'     => $file['path'],
            ),
            $timeout,
            $status
        );

        if ( is_wp_error( $data ) ) {
            return $data;
        }

        if ( isset( $data['error'] ) ) {
            $message = isset( $data['error']['message'] ) ? $data['error']['message'] : __( 'Unknown error.', 'betterdocs' );
            return new \WP_Error( 'provider_error', $this->classify_http_error( $status, $message, $model ) );
        }

        return isset( $data['text'] ) ? (string) $data['text'] : '';
    }

    /**
     * The reasoning_effort to send for a GPT-5 or GPT-6 model.
     *
     * Each generation has its own filter, because they accept different values:
     * a site forcing 'minimal' for GPT-5 must not break GPT-6, which rejects it
     * with a 400. GPT-6 values are also clamped to what the model accepts (see
     * clamp_gpt6_reasoning_effort()), so a filter can never send one that fails.
     *
     * @since 4.9.6
     *
     * @param string $model      OpenAI model identifier.
     * @param int    $max_tokens Output token budget for the request.
     * @return string reasoning_effort value.
     */
    protected function reasoning_effort( $model, $max_tokens ) {
        $default = $this->default_reasoning_effort( $model );

        if ( AIHelper::is_gpt6( $model ) ) {
            /**
             * Filter the reasoning_effort sent to GPT-6 models (gpt-6-luna,
             * gpt-6-astra, gpt-6.1-sol, ...).
             *
             * The value is clamped afterwards: 'minimal' does not exist for
             * GPT-6 and becomes the model's lowest accepted effort, 'none' becomes
             * 'low' on models that cannot turn reasoning off (gpt-6-astra and the
             * gpt-6.x point releases), and anything unrecognised falls back to
             * the default.
             *
             * @since 4.9.6
             *
             * @param string $effort     Default effort: 'none' for gpt-6-luna, 'low' otherwise.
             * @param string $model      OpenAI model identifier.
             * @param int    $max_tokens Output token budget for the request.
             */
            $effort = apply_filters( 'betterdocs_openai_gpt6_reasoning_effort', $default, $model, $max_tokens );

            return self::clamp_gpt6_reasoning_effort( $effort, $model );
        }

        /**
         * Filter the reasoning_effort sent to GPT-5 models (gpt-5, gpt-5-mini,
         * gpt-5-nano and the gpt-5.x point releases). GPT-6 has its own filter,
         * betterdocs_openai_gpt6_reasoning_effort.
         *
         * @param string $effort     Default effort.
         * @param string $model      OpenAI model identifier.
         * @param int    $max_tokens Output token budget for the request.
         */
        return apply_filters( 'betterdocs_openai_gpt5_reasoning_effort', $default, $model, $max_tokens );
    }

    /**
     * Whether a GPT-6 model always reasons, so 'none' is rejected: gpt-6-astra
     * and the gpt-6.x point releases (gpt-6.1-sol, ...).
     *
     * @since 4.9.6
     *
     * @param string $model OpenAI model identifier.
     * @return bool
     */
    protected static function gpt6_always_reasons( $model ) {
        $model = (string) $model;
        return 0 === strpos( $model, 'gpt-6-astra' ) || (bool) preg_match( '/^gpt-6\.\d/', $model );
    }

    /**
     * Clamp a reasoning_effort to a value the given GPT-6 model accepts.
     *
     * - 'minimal' (GPT-5 vocabulary only) → the model's lowest effort: 'none'
     *   on gpt-6-luna, 'low' on models that always reason.
     * - 'none' on a model that always reasons → 'low'.
     * - 'low', 'medium', 'high', 'xhigh' pass through.
     * - Anything else (empty, a typo, a non-string) → the model's default.
     *
     * @since 4.9.6
     *
     * @param mixed  $effort Requested effort, typically a filter's return value.
     * @param string $model  OpenAI GPT-6 model identifier.
     * @return string A reasoning_effort the model accepts.
     */
    public static function clamp_gpt6_reasoning_effort( $effort, $model ) {
        $always_reasons = self::gpt6_always_reasons( $model );
        $lowest         = $always_reasons ? 'low' : 'none';
        $effort         = is_string( $effort ) ? strtolower( trim( $effort ) ) : '';

        if ( 'minimal' === $effort ) {
            return $lowest;
        }

        if ( 'none' === $effort && $always_reasons ) {
            return 'low';
        }

        if ( in_array( $effort, array( 'none', 'low', 'medium', 'high', 'xhigh' ), true ) ) {
            return $effort;
        }

        return $lowest;
    }

    /**
     * Default reasoning_effort for a GPT-5 or GPT-6 model — the lowest value
     * each model accepts, since anything unsupported is a 400 "Unsupported
     * value: 'reasoning_effort'".
     *
     * - gpt-5, gpt-5-mini, gpt-5-nano: 'minimal'.
     * - gpt-5.x point releases and gpt-6-luna: 'none' — no reasoning
     *   tokens, the whole budget left for visible output.
     * - gpt-6-astra and gpt-6.1-sol (and later point releases): reasoning
     *   cannot be turned off and 'minimal' is gone, so 'low'.
     *
     * Override via betterdocs_openai_gpt5_reasoning_effort (GPT-5) or
     * betterdocs_openai_gpt6_reasoning_effort (GPT-6, clamped).
     *
     * @param string $model OpenAI model identifier.
     * @return string reasoning_effort value.
     */
    protected function default_reasoning_effort( $model ) {
        $model = (string) $model;

        if ( self::gpt6_always_reasons( $model ) ) {
            return 'low';
        }

        return ( AIHelper::is_gpt6( $model ) || AIHelper::is_gpt5_point_release( $model ) ) ? 'none' : 'minimal';
    }
}
