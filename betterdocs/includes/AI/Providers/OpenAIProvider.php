<?php

namespace WPDeveloper\BetterDocs\AI\Providers;

use WPDeveloper\BetterDocs\Utils\AIHelper;

/**
 * OpenAI Chat Completions provider.
 *
 * Adds the GPT-5 family handling on top of the shared OpenAI-compatible base:
 * GPT-5 models require `max_completion_tokens`, reject a custom temperature, and
 * bill internal reasoning against the output budget — so we send a low
 * `reasoning_effort` to avoid empty completions. The original GPT-5 generation
 * accepts `minimal`; the gpt-5.x point releases (e.g. gpt-5.5) dropped it and
 * need `none` instead (see default_reasoning_effort()).
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
        if ( 0 === strpos( (string) $model, 'gpt-5' ) ) {
            return array(
                'model'                 => $model,
                'messages'              => $messages,
                'max_completion_tokens' => (int) $max_tokens,
                'reasoning_effort'      => apply_filters( 'betterdocs_openai_gpt5_reasoning_effort', $this->default_reasoning_effort( $model ), $model, $max_tokens ),
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
     * Default reasoning_effort for a gpt-5* model.
     *
     * The original GPT-5 generation (gpt-5, gpt-5-mini, gpt-5-nano) accepts
     * 'minimal'. The gpt-5.x point releases (e.g. gpt-5.5) dropped 'minimal'
     * from the API and only accept none|low|medium|high; sending 'minimal'
     * returns a 400 "Unsupported value: 'reasoning_effort'". For those we
     * default to 'none' — no reasoning tokens, the fastest option, leaving the
     * whole token budget for visible output (closest to gpt-5 'minimal'
     * behaviour). Override per model via the
     * betterdocs_openai_gpt5_reasoning_effort filter.
     *
     * @param string $model OpenAI model identifier.
     * @return string reasoning_effort value.
     */
    protected function default_reasoning_effort( $model ) {
        return AIHelper::is_gpt5_point_release( $model ) ? 'none' : 'minimal';
    }
}
