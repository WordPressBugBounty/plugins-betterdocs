<?php

namespace WPDeveloper\BetterDocs\AI\Providers;

/**
 * Google Gemini provider (Generative Language API).
 *
 * Wire format differs from OpenAI: the system prompt goes in
 * `system_instruction`, the conversation in `contents[].parts[].text` with
 * roles user/model, and limits live under `generationConfig`. Auth is the
 * `x-goog-api-key` header.
 *
 * @since 4.4.0
 */
class GeminiProvider extends BaseProvider {

    public function id() {
        return 'gemini';
    }

    public function label() {
        return 'Google Gemini';
    }

    /**
     * @return string API base, no trailing slash.
     */
    protected function base_url() {
        return 'https://generativelanguage.googleapis.com/v1beta';
    }

    /**
     * Split normalized messages into a Gemini system_instruction string and a
     * contents array with user/model roles.
     *
     * @param array $messages
     * @return array array( string $system, array $contents )
     */
    protected function map_messages( $messages ) {
        $system   = array();
        $contents = array();

        foreach ( $messages as $message ) {
            $role    = isset( $message['role'] ) ? $message['role'] : 'user';
            $content = isset( $message['content'] ) ? (string) $message['content'] : '';

            if ( 'system' === $role ) {
                $system[] = $content;
                continue;
            }

            $contents[] = array(
                'role'  => ( 'assistant' === $role ) ? 'model' : 'user',
                'parts' => array( array( 'text' => $content ) ),
            );
        }

        return array( implode( "\n\n", $system ), $contents );
    }

    /**
     * {@inheritDoc}
     */
    public function chat( $messages, $options = array() ) {
        if ( empty( $this->api_key ) ) {
            return new \WP_Error( 'no_api_key', sprintf( __( '%s API key is not configured.', 'betterdocs' ), $this->label() ) );
        }

        $model      = $this->resolve_model( $options );
        $context    = isset( $options['context'] ) ? $options['context'] : null;
        $max_tokens = $this->floor_tokens( isset( $options['max_tokens'] ) ? $options['max_tokens'] : 2500, $model, $context );

        list( $system, $contents ) = $this->map_messages( $messages );

        $payload = array(
            'contents'         => $contents,
            'generationConfig' => array( 'maxOutputTokens' => (int) $max_tokens ),
        );
        if ( '' !== $system ) {
            $payload['system_instruction'] = array( 'parts' => array( array( 'text' => $system ) ) );
        }
        if ( isset( $options['temperature'] ) && null !== $options['temperature'] ) {
            $payload['generationConfig']['temperature'] = (float) $options['temperature'];
        }

        $url     = $this->base_url() . '/models/' . rawurlencode( $model ) . ':generateContent';
        $headers = array( 'Content-Type' => 'application/json', 'x-goog-api-key' => $this->api_key );
        $timeout = isset( $options['timeout'] ) ? $options['timeout'] : 50;

        $status = null;
        $data   = $this->post_json( $url, $headers, $payload, $timeout, $status );
        if ( is_wp_error( $data ) ) {
            return $data;
        }

        if ( ! empty( $data['error'] ) ) {
            $raw = isset( $data['error']['message'] ) ? $data['error']['message'] : __( 'Unknown API error.', 'betterdocs' );
            // Classify by HTTP status so a retired model (404) is not reported as a
            // quota error (429) — the Gemini API returns the raw text either way.
            return new \WP_Error( 'provider_error', $this->classify_http_error( $status, $raw, $model ) );
        }

        $content = $this->extract_text( $data );
        if ( '' === $content ) {
            return new \WP_Error( 'no_content', sprintf( __( 'No content received from %s.', 'betterdocs' ), $this->label() ) );
        }

        $usage = $this->normalize_usage(
            isset( $data['usageMetadata'] ) && is_array( $data['usageMetadata'] ) ? $data['usageMetadata'] : array(),
            array( 'prompt' => 'promptTokenCount', 'completion' => 'candidatesTokenCount', 'total' => 'totalTokenCount' )
        );

        return $this->success(
            $content,
            $model,
            $usage,
            isset( $data['candidates'][0]['finishReason'] ) ? $data['candidates'][0]['finishReason'] : null
        );
    }

    /**
     * Transcribe audio or video.
     *
     * Gemini has no dedicated speech endpoint — the media rides in the ordinary
     * `generateContent` call as an `inline_data` part beside a text instruction,
     * and the model returns the transcript as its answer. Inline data is base64,
     * which inflates the payload by roughly a third; the caller caps media at
     * 15 MB for this platform so the request stays inside Gemini's inline
     * ceiling. (Files API upload would lift that, and is the obvious next step
     * if longer recordings are ever needed.)
     *
     * @param array $file    `[ 'path', 'filename', 'mime' ]`
     * @param array $options `[ 'model', 'timeout', 'max_tokens' ]`
     * @return string|\WP_Error
     */
    public function transcribe( $file, $options = array() ) {
        if ( empty( $this->api_key ) ) {
            return new \WP_Error( 'no_api_key', sprintf( __( '%s API key is not configured.', 'betterdocs' ), $this->label() ) );
        }

        $bytes = @file_get_contents( $file['path'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local temp upload, not a remote fetch.
        if ( false === $bytes ) {
            return new \WP_Error( 'api_error', __( 'Could not read the uploaded file.', 'betterdocs' ) );
        }

        $model   = ! empty( $options['model'] ) ? (string) $options['model'] : 'gemini-flash-latest';
        $timeout = isset( $options['timeout'] ) ? (int) $options['timeout'] : 120;

        $payload = array(
            'contents'         => array(
                array(
                    'role'  => 'user',
                    'parts' => array(
                        array( 'text' => __( 'Transcribe the speech in this recording verbatim as plain text. Do not summarise, translate or add commentary. If there is no speech, reply with nothing at all.', 'betterdocs' ) ),
                        array( 'inline_data' => array(
                            'mime_type' => $file['mime'],
                            'data'      => base64_encode( $bytes ),
                        ) ),
                    ),
                ),
            ),
            'generationConfig' => array(
                'maxOutputTokens' => isset( $options['max_tokens'] ) ? (int) $options['max_tokens'] : 8192,
            ),
        );

        unset( $bytes );

        $url    = $this->base_url() . '/models/' . rawurlencode( $model ) . ':generateContent';
        $status = null;
        $data   = $this->post_json(
            $url,
            array( 'Content-Type' => 'application/json', 'x-goog-api-key' => $this->api_key ),
            $payload,
            $timeout,
            $status
        );

        if ( is_wp_error( $data ) ) {
            return $data;
        }

        if ( ! empty( $data['error'] ) ) {
            $raw = isset( $data['error']['message'] ) ? $data['error']['message'] : __( 'Unknown API error.', 'betterdocs' );
            return new \WP_Error( 'provider_error', $this->classify_http_error( $status, $raw, $model ) );
        }

        return $this->extract_text( $data );
    }

    /**
     * Concatenate all text parts of the first candidate.
     *
     * @param array $data
     * @return string
     */
    protected function extract_text( $data ) {
        if ( empty( $data['candidates'][0]['content']['parts'] ) || ! is_array( $data['candidates'][0]['content']['parts'] ) ) {
            return '';
        }
        $text = '';
        foreach ( $data['candidates'][0]['content']['parts'] as $part ) {
            if ( isset( $part['text'] ) ) {
                $text .= $part['text'];
            }
        }
        return $text;
    }

    /**
     * {@inheritDoc}
     */
    public function validate_key( $api_key = '' ) {
        $api_key = $api_key !== '' ? $api_key : $this->api_key;

        if ( empty( $api_key ) ) {
            return array( 'valid' => false, 'message' => __( 'Please insert your API key to use AI features.', 'betterdocs' ) );
        }

        $response = wp_remote_get( $this->base_url() . '/models', array(
            'headers' => array( 'x-goog-api-key' => $api_key ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array( 'valid' => false, 'message' => $response->get_error_message() );
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        if ( 200 === $code ) {
            return array( 'valid' => true, 'message' => __( 'Valid API Key', 'betterdocs' ) );
        }

        $body    = json_decode( wp_remote_retrieve_body( $response ), true );
        $message = isset( $body['error']['message'] ) ? $body['error']['message'] : __( 'Invalid API Key', 'betterdocs' );
        return array( 'valid' => false, 'message' => $message );
    }
}
