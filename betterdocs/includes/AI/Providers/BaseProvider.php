<?php

namespace WPDeveloper\BetterDocs\AI\Providers;

use WPDeveloper\BetterDocs\AI\ModelRegistry;
use WPDeveloper\BetterDocs\AI\Contracts\AIProvider;
use WPDeveloper\BetterDocs\Utils\AIHelper;

/**
 * Shared plumbing for concrete providers: construction, model lookup, the
 * min-token floor, HTTP transport, and usage normalization. Concrete providers
 * implement id()/label()/chat()/validate_key() and reuse the helpers here.
 *
 * @since 4.4.0
 */
abstract class BaseProvider implements AIProvider {

    /**
     * @var string Configured API key.
     */
    protected $api_key;

    /**
     * @var string Configured model id.
     */
    protected $model;

    /**
     * @param string $api_key Configured key for this platform.
     * @param string $model   Configured model id; falls back to the platform default.
     */
    public function __construct( $api_key = '', $model = '' ) {
        $this->api_key = (string) $api_key;
        $this->model   = $model !== '' ? (string) $model : $this->default_model();
    }

    /**
     * {@inheritDoc}
     */
    public function models() {
        return ModelRegistry::models( $this->id() );
    }

    /**
     * {@inheritDoc}
     */
    public function default_model() {
        return ModelRegistry::default_model( $this->id() );
    }

    /**
     * Resolve the model to use for a request (option override wins).
     *
     * @param array $options
     * @return string
     */
    protected function resolve_model( $options ) {
        return ! empty( $options['model'] ) ? (string) $options['model'] : $this->model;
    }

    /**
     * Apply the per-feature min-token floor when a context is supplied.
     *
     * Reuses the existing policy in AIHelper so the floor stays consistent with
     * the React notice and server-side save validation.
     *
     * @param int         $max_tokens
     * @param string      $model
     * @param string|null $context
     * @return int
     */
    protected function floor_tokens( $max_tokens, $model, $context = null ) {
        $max_tokens = (int) $max_tokens;
        if ( null === $context ) {
            return $max_tokens;
        }
        $min = AIHelper::get_min_tokens( $context, $model );
        return ( $min > 0 && $max_tokens < $min ) ? $min : $max_tokens;
    }

    /**
     * POST JSON and decode the response into an array (or WP_Error).
     *
     * @param string   $url
     * @param array    $headers
     * @param array    $body
     * @param int      $timeout
     * @param int|null $status_code Out-param: set to the HTTP response code (0 on
     *                              transport failure) so callers can classify errors
     *                              by status without re-reading the response.
     * @return array|\WP_Error Decoded body array, or WP_Error on transport failure.
     */
    protected function post_json( $url, $headers, $body, $timeout = 50, &$status_code = null ) {
        $headers = wp_parse_args( $headers, array( 'Content-Type' => 'application/json' ) );

        $response = wp_remote_post( $url, array(
            'headers' => $headers,
            'body'    => wp_json_encode( $body ),
            'timeout' => (int) $timeout,
        ) );

        if ( is_wp_error( $response ) ) {
            $status_code = 0;
            return new \WP_Error( 'api_error', sprintf(
                /* translators: 1: provider label, 2: error message */
                __( 'Failed to connect to %1$s: %2$s', 'betterdocs' ),
                $this->label(),
                $response->get_error_message()
            ) );
        }

        $status_code = (int) wp_remote_retrieve_response_code( $response );

        $data = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $data ) ) {
            return new \WP_Error( 'no_content', sprintf(
                /* translators: %s: provider label */
                __( 'Empty or invalid response from %s.', 'betterdocs' ),
                $this->label()
            ) );
        }

        return $data;
    }

    /**
     * POST a multipart/form-data body carrying one file, and decode the response.
     *
     * The JSON helper above cannot express a file upload, and WordPress ships no
     * multipart builder — `wp_remote_post()` sends `body` as an array only as
     * urlencoded form fields. So the body is assembled by hand here. The one
     * caller is OpenAI's transcription endpoint, which takes the audio as a real
     * file part; everything else in this layer is JSON.
     *
     * The file is streamed in from its path rather than passed around as a
     * string by callers, so the bytes live in exactly one variable and are
     * released when this method returns.
     *
     * @param string   $url
     * @param array    $headers     Auth headers. Content-Type is set here — a
     *                              caller-supplied one would lack the boundary.
     * @param array    $fields      Scalar form fields, e.g. `model`.
     * @param array    $file        `[ 'name' => field name, 'filename' => …, 'type' => mime, 'path' => … ]`
     * @param int      $timeout
     * @param int|null $status_code Out-param, as in post_json().
     * @return array|\WP_Error
     */
    protected function post_multipart( $url, $headers, $fields, $file, $timeout = 120, &$status_code = null ) {
        if ( ! is_readable( $file['path'] ) ) {
            $status_code = 0;
            return new \WP_Error( 'api_error', __( 'Could not read the uploaded file.', 'betterdocs' ) );
        }

        $response = $this->post_multipart_streamed( $url, $headers, $fields, $file, $timeout );

        if ( null === $response ) {
            $response = $this->post_multipart_buffered( $url, $headers, $fields, $file, $timeout );
        }

        if ( is_wp_error( $response ) ) {
            $status_code = 0;
            return new \WP_Error( 'api_error', sprintf(
                /* translators: 1: provider label, 2: error message */
                __( 'Failed to connect to %1$s: %2$s', 'betterdocs' ),
                $this->label(),
                $response->get_error_message()
            ) );
        }

        $status_code = (int) wp_remote_retrieve_response_code( $response );

        $data = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $data ) ) {
            return new \WP_Error( 'no_content', sprintf(
                /* translators: %s: provider label */
                __( 'Empty or invalid response from %s.', 'betterdocs' ),
                $this->label()
            ) );
        }

        return $data;
    }

    /**
     * Send the multipart body with cURL reading the file straight from disk.
     *
     * Building the body as a PHP string holds the whole recording in memory two
     * or three times over (the bytes, the body, cURL's own copy) — a 24 MB file
     * pushed a 128M host over its limit. Handing cURL a CURLFile instead lets it
     * stream the part from the temp upload, so the file is never in PHP memory.
     *
     * The request still goes through wp_remote_post(), so proxies, SSL settings
     * and every `http_*` filter apply as normal; only the body and the headers
     * are replaced on the handle, right before it is sent.
     *
     * @return array|\WP_Error|null Null when cURL is not the transport, so the
     *                              caller can fall back to the buffered body.
     */
    protected function post_multipart_streamed( $url, $headers, $fields, $file, $timeout ) {
        if ( ! function_exists( 'curl_init' ) || ! class_exists( '\CURLFile' ) ) {
            return null;
        }

        $streamed = false;
        $attach   = static function ( $handle, $r, $request_url ) use ( $url, $headers, $fields, $file, &$streamed ) {
            if ( $request_url !== $url || $streamed ) {
                return;
            }

            $post                  = $fields;
            $post[ $file['name'] ] = new \CURLFile( $file['path'], $file['type'], $file['filename'] );

            // cURL writes its own multipart Content-Type, boundary included, so
            // the header list is set without one. `Expect:` stops a 100-continue
            // round trip on large bodies.
            $lines = array( 'Expect:' );
            foreach ( $headers as $name => $value ) {
                if ( 'content-type' !== strtolower( $name ) ) {
                    $lines[] = $name . ': ' . $value;
                }
            }

            curl_setopt( $handle, CURLOPT_POSTFIELDS, $post ); // phpcs:ignore WordPress.WP.AlternativeFunctions.curl_curl_setopt -- the handle WordPress is about to send.
            curl_setopt( $handle, CURLOPT_HTTPHEADER, $lines ); // phpcs:ignore WordPress.WP.AlternativeFunctions.curl_curl_setopt
            $streamed = true;
        };

        add_action( 'http_api_curl', $attach, PHP_INT_MAX, 3 );

        $response = wp_remote_post( $url, array(
            'headers' => $headers,
            // Replaced on the handle above. Non-empty so the request is sent
            // as a POST with a body on every transport.
            'body'    => ' ',
            'timeout' => (int) $timeout,
        ) );

        remove_action( 'http_api_curl', $attach, PHP_INT_MAX );

        // The hook never ran: something other than cURL sent that request,
        // carrying the one-byte placeholder. Nothing was transcribed (the
        // provider rejects an empty upload), so the buffered path runs it again.
        return $streamed ? $response : null;
    }

    /**
     * The same request with the body built in PHP, for a host without cURL.
     *
     * @return array|\WP_Error
     */
    protected function post_multipart_buffered( $url, $headers, $fields, $file, $timeout ) {
        $boundary = wp_generate_password( 24, false );
        $eol      = "\r\n";
        $body     = '';

        foreach ( $fields as $key => $value ) {
            $body .= '--' . $boundary . $eol;
            $body .= 'Content-Disposition: form-data; name="' . $key . '"' . $eol . $eol;
            $body .= $value . $eol;
        }

        $body .= '--' . $boundary . $eol;
        $body .= 'Content-Disposition: form-data; name="' . $file['name'] . '"; filename="' . $file['filename'] . '"' . $eol;
        $body .= 'Content-Type: ' . $file['type'] . $eol . $eol;
        // Appended straight onto the body, never as `$bytes . $eol`: that
        // expression builds a third full-size copy of the file before the append.
        $body .= (string) @file_get_contents( $file['path'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local temp upload, not a remote fetch.
        $body .= $eol;
        $body .= '--' . $boundary . '--' . $eol;

        $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;

        return wp_remote_post( $url, array(
            'headers' => $headers,
            'body'    => $body,
            'timeout' => (int) $timeout,
        ) );
    }

    /**
     * Transcribe an audio or video file to plain text.
     *
     * Default: not supported. A provider that can do it overrides this; callers
     * are expected to check Core\WriteWithAI::platform_supports( 'transcription' )
     * first and show the switch-platform message, so reaching this is a bug
     * rather than a user-facing path.
     *
     * @param array $file `[ 'path', 'filename', 'mime' ]`
     * @param array $options
     * @return string|\WP_Error Transcript text.
     */
    public function transcribe( $file, $options = array() ) {
        return new \WP_Error( 'no_transcription', sprintf(
            /* translators: %s: provider label */
            __( '%s cannot transcribe audio or video.', 'betterdocs' ),
            $this->label()
        ) );
    }

    /**
     * Turn an HTTP status + the provider's raw error text into a clear, actionable
     * message. Chiefly distinguishes a retired/unknown model (404) from a genuine
     * quota / rate-limit rejection (429) — without this, a dead model id and a real
     * quota error both surface the provider's raw text and look identical (a retired
     * model reads like "quota exceeded"). Falls back to the raw message otherwise.
     *
     * @param int    $status      HTTP status code.
     * @param string $raw_message Provider-supplied error message.
     * @param string $model       Model id in play, for the "unavailable" message.
     * @return string
     */
    protected function classify_http_error( $status, $raw_message, $model = '' ) {
        $status = (int) $status;
        $raw    = strtolower( (string) $raw_message );

        if ( 404 === $status || false !== strpos( $raw, 'not found' ) || false !== strpos( $raw, 'is not supported' ) ) {
            return sprintf(
                /* translators: 1: provider label, 2: model id */
                __( 'The %1$s model "%2$s" is unavailable — it may have been retired. Choose a different model.', 'betterdocs' ),
                $this->label(),
                $model
            );
        }

        if ( 429 === $status || false !== strpos( $raw, 'resource_exhausted' ) || false !== strpos( $raw, 'quota' ) || false !== strpos( $raw, 'rate limit' ) ) {
            return sprintf(
                /* translators: %s: provider label */
                __( 'Your %s request hit a quota or rate limit. Check your plan and limits, then try again.', 'betterdocs' ),
                $this->label()
            );
        }

        return (string) $raw_message;
    }

    /**
     * Normalize a usage block into prompt/completion/total token counts.
     *
     * @param array $usage Provider-specific usage payload.
     * @param array $map   Keys map: array( 'prompt'=>..., 'completion'=>..., 'total'=>... ).
     * @return array
     */
    protected function normalize_usage( $usage, $map ) {
        $get = function ( $key ) use ( $usage ) {
            return ( $key && isset( $usage[ $key ] ) ) ? (int) $usage[ $key ] : null;
        };

        $prompt     = $get( isset( $map['prompt'] ) ? $map['prompt'] : null );
        $completion = $get( isset( $map['completion'] ) ? $map['completion'] : null );
        $total      = $get( isset( $map['total'] ) ? $map['total'] : null );

        if ( null === $total && ( null !== $prompt || null !== $completion ) ) {
            $total = (int) $prompt + (int) $completion;
        }

        return array(
            'prompt_tokens'     => $prompt,
            'completion_tokens' => $completion,
            'total_tokens'      => $total,
        );
    }

    /**
     * Build the normalized success envelope returned by chat().
     *
     * @param string      $content
     * @param string      $model
     * @param array       $usage
     * @param string|null $finish_reason
     * @return array
     */
    protected function success( $content, $model, $usage, $finish_reason = null ) {
        return array(
            'success'       => true,
            'content'       => (string) $content,
            'model'         => (string) $model,
            'usage'         => $usage,
            'finish_reason' => $finish_reason,
        );
    }
}
