<?php

    namespace WPDeveloper\BetterDocs\Core;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


    use WPDeveloper\BetterDocs\Utils\Base;
    use WPDeveloper\BetterDocs\Core\Settings;
    use WPDeveloper\BetterDocs\Core\PostType;

    use WPDeveloper\BetterDocs\Utils\Helper;
    use WPDeveloper\BetterDocs\Utils\AIHelper;
    use WPDeveloper\BetterDocs\Utils\AIUsage;
    use WPDeveloper\BetterDocs\REST\AIEdit;

    class WriteWithAI extends Base {

    public $settings;

    public function __construct( Settings $settings ) {
        $this->settings = $settings;
        // Get the post ID from the URL
        $post_id = isset( $_GET[ 'post' ] ) ? intval( $_GET[ 'post' ] ) : 0; // phpcs:ignore

        if ( ! empty( $_GET[ 'post_type' ] ) ) { // phpcs:ignore
            $post_type = $_GET[ 'post_type' ]; // phpcs:ignore
        } elseif ( $post_id > 0 ) {
            $post_type = get_post_type( $post_id );
        } else {
            $post_type = '';
        }

        if ( ! empty( $this->isEnabledWriteWithAI() ) && 'docs' == $post_type ) {
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_ai_edit_assets' ) );
        }
        // Legacy AJAX handler kept for back-compat; the redesigned modal uses the REST route.
        add_action( 'wp_ajax_generate_openai_content', array( $this, 'generate_openai_content_callback' ) );
    }

    public function enqueue_ai_edit_assets( $hook ) {
        if ( 'post.php' !== $hook && 'post-new.php' !== $hook ) {
            return;
        }

        global $post_type;
        if ( 'docs' !== $post_type ) {
            return;
        }

        $api_key = $this->get_api_key();
        $has_key = ! empty( $api_key );

        // Write with AI — loads even without a key so the modal can show its
        // "add an API key" banner (matches the legacy inline form behavior).
        betterdocs()->assets->enqueue( 'betterdocs-write-with-ai', 'blocks/write-with-ai.js' );
        betterdocs()->assets->enqueue( 'betterdocs-write-with-ai-style', 'blocks/write-with-ai-style.css' );

        wp_localize_script(
            'betterdocs-write-with-ai',
            'betterdocsWriteWithAI',
            array(
                'rest_url'               => esc_url_raw( rest_url( 'betterdocs/v1/write-with-ai' ) ),
                'rest_nonce'             => wp_create_nonce( 'wp_rest' ),
                'post_id'                => get_the_ID(),
                'has_key'                => $has_key,
                // Term-suggestion (Docs AI Suite) wiring reused by the Write-with-AI
                // preview step. Endpoint + gate mirror REST\DocsAISuite / Core\DocsAISuite.
                'rest_suggest_url'             => esc_url_raw( rest_url( 'betterdocs/v1/ai-suggest-terms' ) ),
                'suggest_terms_enabled'        => (bool) $this->settings->get( 'enable_docs_ai_suite', true ),
                'model'                  => $this->settings->get( 'write_with_ai_model', 'gpt-4o-mini' ),
                'max_token'              => (int) $this->settings->get( 'ai_autowrite_max_token', 2500 ),
                'settings_url'           => esc_url( admin_url( 'admin.php?page=betterdocs-settings#betterdocs-ai' ) ),
                'woo_active'             => class_exists( 'WooCommerce' ),
                'is_multilingual_active' => Helper::is_multilingual_active(),
                'language_options'       => Helper::get_active_languages(),
                'instructions'           => $this->get_instruction_choices(),
                // From Git is a Pro feature. Pro is detected here; Git enabled/auth
                // status is filled in by Pro via the filter below (default: off).
                'is_pro_active'          => betterdocs()->is_pro_active(),
                'git'                    => apply_filters(
                    'betterdocs_write_with_ai_git',
                    array(
                        'enabled'      => false,
                        'connected'    => false,
                        'settings_url' => admin_url( 'admin.php?page=betterdocs-settings#git-sync' ),
                    )
                ),
            )
        );

        // AI Edit — only meaningful with a key configured.
        if ( ! $has_key ) {
            return;
        }

        betterdocs()->assets->enqueue( 'betterdocs-ai-edit', 'blocks/ai-edit.js' );
        betterdocs()->assets->enqueue( 'betterdocs-ai-edit-style', 'blocks/ai-edit-style.css' );

        wp_localize_script(
            'betterdocs-ai-edit',
            'betterdocsAIEdit',
            array(
                'rest_url' => esc_url_raw( rest_url( 'betterdocs/v1/ai-edit' ) ),
                'rest_nonce' => wp_create_nonce( 'wp_rest' ),
                'post_id' => get_the_ID(),
                'instructions' => $this->get_instruction_choices(),
                'actions' => AIEdit::get_localized_actions()
            )
        );
    }

    public function isEnabledWriteWithAI() {
        $isEnableAutoWrite = $this->settings->get( 'enable_write_with_ai', true );
        return $isEnableAutoWrite;
    }

    public function isValidAPIKey( $apiKey ) {
        if ( empty( $apiKey ) ) {
            $api_response[ 'valid' ]   = false;
            $api_response[ 'message' ] = 'Please Insert your <a href="/admin.php?page=betterdocs-settings#betterdocs-ai">OpenAI API Key</a> to use this Write with AI feature.';

            return $api_response;
        }

        $api_response = array();

        $response = wp_safe_remote_get(
            'https://api.openai.com/v1/engines',
            array(
                'headers' => array(
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'Bearer ' . $apiKey,
                ),
                'timeout' => 15,
            )
        );

        if ( is_wp_error( $response ) ) {
            $api_response[ 'valid' ]   = false;
            $api_response[ 'message' ] = $response->get_error_message();
            return $api_response;
        }

        $httpCode = (int) wp_remote_retrieve_response_code( $response );
        $body     = wp_remote_retrieve_body( $response );

        if ( 200 === $httpCode ) {
            $api_response[ 'valid' ]   = true;
            $api_response[ 'message' ] = 'Valid API Key';
        } else {
            $responseData              = json_decode( $body, true );
            $messageData               = ! empty( $responseData[ 'error' ] ) ? $responseData[ 'error' ] : array();
            $api_response[ 'valid' ]   = false;
            $api_response[ 'message' ] = ! empty( $messageData[ 'message' ] ) ? $messageData[ 'message' ] : 'Invalid API Key';
        }

        // print_r($response);

        return $api_response;
    }

    public function get_api_key() {
        $api_key = $this->settings->get( 'ai_autowrite_api_key', '' );
        return $api_key;
    }

    /**
     * The built-in "Default" instruction body.
     *
     * Single source of truth shared by {@see Settings::get_default()} (which seeds
     * the editable "Default" instruction set) and {@see self::get_system_prompt()}
     * (the fallback when no saved Default content exists).
     *
     * @return string
     */
    public static function default_instruction_content() {
        return <<<'PROMPT'
You are a Senior Technical Writer specializing in comprehensive, high-quality documentation. Your goal is to produce documentation that scores 100/100 on clarity, completeness, and structure.

## Output format

Return only HTML body content. Never wrap output in `<!doctype>`, `<html>`, `<head>`, `<body>`, or markdown code fences (no ```html ... ```).

Use semantic, Gutenberg-friendly tags only:
- Headings: `<h2>`, `<h3>`, `<h4>` (do not emit `<h1>` — it is reserved for the document title)
- Paragraphs: `<p>` for prose
- Lists: `<ul>`/`<ol>` with `<li>` for any list of items, steps, or bullet points — never fake a list with paragraphs or `<br>`
- Links: `<a href="https://...">link text</a>` with absolute URLs
- Inline emphasis: `<strong>`, `<em>`, `<code>`
- Code blocks: `<pre><code>...</code></pre>` for multi-line code or commands
- Quotes: `<blockquote>`
- Tables: `<table>` with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- Images: `<img src="..." alt="...">`

Apply `<span class="highlight">key term</span>` to important topic terms inside headings and to the first occurrence of each keyword in body text. Use it sparingly — never wrap whole sentences or wrap text inside `href`, `src`, `alt`, or other attributes.

Do not emit `<style>`, `<script>`, `<iframe>`, `<form>`, or inline `style=""` / `class=""` attributes (other than the `highlight` class above).

If — and only if — the user's prompt explicitly asks for raw/custom HTML, embed code, or a non-standard structure, follow that request instead of these defaults.
PROMPT;
    }

    /**
     * The saved instruction sets, normalized to a list of { id, title, content }.
     *
     * Stored in the `write_with_ai_instructions` setting. Always returns at least
     * the built-in "Default" set so callers never have to special-case an empty
     * option (e.g. a site whose stored value predates this feature).
     *
     * @return array<int,array{id:string,title:string,content:string}>
     */
    public function get_instructions() {
        $stored = $this->settings->get( 'write_with_ai_instructions', array() );

        $instructions = array();
        if ( is_array( $stored ) ) {
            foreach ( $stored as $item ) {
                if ( ! is_array( $item ) || empty( $item['id'] ) ) {
                    continue;
                }
                $instructions[] = array(
                    'id'      => sanitize_key( (string) $item['id'] ),
                    'title'   => isset( $item['title'] ) ? (string) $item['title'] : '',
                    'content' => isset( $item['content'] ) ? (string) $item['content'] : '',
                );
            }
        }

        // Guarantee a Default set is always present.
        $has_default = false;
        foreach ( $instructions as $item ) {
            if ( 'default' === $item['id'] ) {
                $has_default = true;
                break;
            }
        }
        if ( ! $has_default ) {
            array_unshift(
                $instructions,
                array(
                    'id'      => 'default',
                    'title'   => __( 'Default/Core', 'betterdocs' ),
                    'content' => self::default_instruction_content(),
                )
            );
        }

        return $instructions;
    }

    /**
     * The selectable (non-default) instruction sets exposed to the editor UI.
     *
     * Only id + title are sent to the browser; the prompt body stays server-side
     * and is resolved at request time by {@see self::get_instruction_messages()}.
     *
     * @return array<int,array{id:string,title:string}>
     */
    public function get_instruction_choices() {
        $choices = array();
        foreach ( $this->get_instructions() as $item ) {
            if ( 'default' === $item['id'] ) {
                continue;
            }
            if ( '' === trim( $item['content'] ) ) {
                continue; // skip empty sets — they'd inject nothing.
            }
            $choices[] = array(
                'id'    => $item['id'],
                'title' => '' !== trim( $item['title'] ) ? $item['title'] : $item['id'],
            );
        }
        return $choices;
    }

    /**
     * Resolve selected instruction ids into extra `system` messages.
     *
     * The "Default" set is intentionally excluded — it is always sent as the base
     * system prompt by {@see self::get_system_prompt()}. Unknown or empty ids are
     * silently ignored. Output order follows the requested $ids order.
     *
     * @param array $ids
     * @return array<int,array{role:string,content:string}>
     */
    public function get_instruction_messages( $ids ) {
        if ( empty( $ids ) || ! is_array( $ids ) ) {
            return array();
        }

        $by_id = array();
        foreach ( $this->get_instructions() as $item ) {
            $by_id[ $item['id'] ] = $item;
        }

        $messages = array();
        $seen     = array();
        foreach ( $ids as $id ) {
            $id = sanitize_key( (string) $id );
            if ( 'default' === $id || isset( $seen[ $id ] ) || ! isset( $by_id[ $id ] ) ) {
                continue;
            }
            $content = trim( $by_id[ $id ]['content'] );
            if ( '' === $content ) {
                continue;
            }
            $seen[ $id ] = true;
            $messages[]  = array(
                'role'    => 'system',
                'content' => $content,
            );
        }

        return $messages;
    }

    /**
     * Coerce a list of extra messages into well-formed `system` chat messages.
     *
     * Accepts either pre-built [ 'role'=>'system', 'content'=>… ] entries (as
     * returned by {@see self::get_instruction_messages()}) or bare strings, and
     * drops anything empty. Keeps the OpenAI payload builders tolerant of either
     * shape so callers can pass instruction ids or ready-made messages.
     *
     * @param array $extra_system
     * @return array<int,array{role:string,content:string}>
     */
    protected function normalize_extra_system( $extra_system ) {
        if ( empty( $extra_system ) || ! is_array( $extra_system ) ) {
            return array();
        }

        $messages = array();
        foreach ( $extra_system as $entry ) {
            if ( is_string( $entry ) ) {
                $content = trim( $entry );
                $role    = 'system';
            } elseif ( is_array( $entry ) && isset( $entry['content'] ) ) {
                $content = trim( (string) $entry['content'] );
                $role    = isset( $entry['role'] ) ? (string) $entry['role'] : 'system';
            } else {
                continue;
            }

            if ( '' === $content ) {
                continue;
            }

            $messages[] = array(
                'role'    => $role,
                'content' => $content,
            );
        }

        return $messages;
    }

    public function get_system_prompt() {
        // Prefer the saved (editable) "Default" instruction set; fall back to the
        // built-in body when it's missing or has been cleared.
        $prompt = self::default_instruction_content();
        foreach ( $this->get_instructions() as $item ) {
            if ( 'default' === $item['id'] && '' !== trim( $item['content'] ) ) {
                $prompt = $item['content'];
                break;
            }
        }

        return apply_filters( 'betterdocs_write_with_ai_system_prompt', $prompt );
    }

    public function get_outline_system_prompt() {
        $prompt = <<<'PROMPT'
You are a Senior Technical Writer. Produce a documentation OUTLINE only — not the full article.

Return ONLY a JSON array (no prose, no markdown, no code fences). Each element is an object:
  { "level": "h2" | "h3", "text": "Section heading" }

Rules:
- 5 to 9 top-level "h2" sections that comprehensively cover the topic.
- Add "h3" sub-sections only where they genuinely help; keep each one directly after its parent h2.
- Headings are concise, descriptive, and free of numbering.
- Do not include an h1/title and do not include any text outside the JSON array.
PROMPT;

        return apply_filters( 'betterdocs_write_with_ai_outline_system_prompt', $prompt );
    }

    /**
     * Generate a documentation outline as a structured array of sections.
     *
     * @param string $user_prompt The composed prompt (title/keywords/instructions).
     * @return array { success:bool, outline?:array<int,array{level:string,text:string}>, error?:string }
     */
    public function generate_outline_response( $user_prompt, $extra_system = array() ) {
        $result = $this->generate_text( $user_prompt, $this->get_outline_system_prompt(), $extra_system );

        if ( empty( $result['success'] ) ) {
            return array(
                'success' => false,
                'error'   => isset( $result['error'] ) ? $result['error'] : 'OpenAI error',
            );
        }

        $outline = $this->parse_outline( (string) $result['content'] );

        if ( empty( $outline ) ) {
            return array(
                'success' => false,
                'error'   => 'The AI returned an outline we could not read. Please try again.',
            );
        }

        return array(
            'success' => true,
            'outline' => $outline,
        );
    }

    /**
     * Parse a model outline response (ideally a JSON array) into a clean list of
     * { level, text } sections. Tolerates code fences and stray prose.
     *
     * @param string $content
     * @return array<int,array{level:string,text:string}>
     */
    protected function parse_outline( $content ) {
        $content = trim( $content );
        $content = preg_replace( '/^```(?:json)?\s*/i', '', $content );
        $content = preg_replace( '/```\s*$/', '', $content );

        // Grab the first JSON array if the model wrapped it in prose.
        if ( preg_match( '/\[[\s\S]*\]/', $content, $m ) ) {
            $content = $m[0];
        }

        $decoded = json_decode( $content, true );
        if ( ! is_array( $decoded ) ) {
            return array();
        }

        $outline = array();
        foreach ( $decoded as $item ) {
            if ( ! is_array( $item ) || empty( $item['text'] ) ) {
                continue;
            }
            $level = isset( $item['level'] ) && 'h3' === strtolower( (string) $item['level'] ) ? 'h3' : 'h2';
            $text  = sanitize_text_field( (string) $item['text'] );
            if ( '' === $text ) {
                continue;
            }
            $outline[] = array( 'level' => $level, 'text' => $text );
        }

        return $outline;
    }

    public function generate_openai_response( $prompt, $keywords, $max_tokens = null, $extra_system = array() ) {
        try {
            $api_key    = $this->settings->get( 'ai_autowrite_api_key', '' );
            // Caller may raise the cap (e.g. a "large" doc) above the saved default.
            $max_tokens = null !== $max_tokens ? (int) $max_tokens : $this->settings->get( 'ai_autowrite_max_token', 2500 );
            $model      = $this->settings->get( 'write_with_ai_model', 'gpt-4o-mini' );

            $api_endpoint = 'https://api.openai.com/v1/chat/completions'; // Update the endpoint based on OpenAI API version

            $messages = array_merge(
                array(
                    array(
                        'role' => 'system',
                        'content' => $this->get_system_prompt()
                    )
                ),
                $this->normalize_extra_system( $extra_system ),
                array(
                    array(
                        'role' => 'user',
                        'content' => $prompt
                    )
                )
            );

            $request_body = AIHelper::build_openai_payload(
                $model,
                $messages,
                $max_tokens,
                null,
                'write_with_ai'
            );

            $request_options = array(
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $api_key
                ),
                'body' => json_encode( $request_body ),
                'timeout' => 300
            );

            // GPT-5.5 reasoning can run well past the default limits; give PHP and
            // the HTTP call room to finish (still subject to server php-fpm/nginx limits).
            if ( function_exists( 'set_time_limit' ) ) {
                set_time_limit( 300 ); // phpcs:ignore Squiz.PHP.DiscouragedFunctions.Discouraged -- long-running AI generation needs an extended limit; still bounded by server fpm/nginx timeouts.
            }

            $response = wp_remote_post( $api_endpoint, $request_options );

            if ( is_wp_error( $response ) ) {
                return 'Error: ' . $response->get_error_message();
            } else {
                $body = wp_remote_retrieve_body( $response );

                $data = json_decode( $body, true );

                if ( ! empty( $data[ 'error' ] ) ) {
                    return $data[ 'error' ][ 'message' ];
                }

                return $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ]; // Update this line to get the assistant's message
            }
        } catch ( Exception $error ) {
            return 'Error: ' . $error->getMessage();
        }
    }

    public function generate_openai_response_ai_edit( $prompt, $extra_system = array() ) {
        $api_key    = $this->settings->get( 'ai_autowrite_api_key', '' );
        $max_tokens = $this->settings->get( 'ai_autowrite_max_token', 2500 );
        $model      = $this->settings->get( 'write_with_ai_model', 'gpt-4o-mini' );

        $api_endpoint = 'https://api.openai.com/v1/chat/completions';

        $messages = array_merge(
            array(
                array(
                    'role' => 'system',
                    'content' => $this->get_system_prompt()
                )
            ),
            $this->normalize_extra_system( $extra_system ),
            array(
                array(
                    'role' => 'user',
                    'content' => $prompt
                )
            )
        );

        $payload = AIHelper::build_openai_payload(
            $model,
            $messages,
            $max_tokens,
            null,
            'write_with_ai'
        );

        $request_options = array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ),
            'body' => wp_json_encode( $payload ),
            'timeout' => 300
        );

        // GPT-5.5 reasoning can run well past the default limits; give PHP and
        // the HTTP call room to finish (still subject to server php-fpm/nginx limits).
        if ( function_exists( 'set_time_limit' ) ) {
            set_time_limit( 300 ); // phpcs:ignore Squiz.PHP.DiscouragedFunctions.Discouraged -- long-running AI generation needs an extended limit; still bounded by server fpm/nginx timeouts.
        }

        $response = wp_remote_post( $api_endpoint, $request_options );

        if ( is_wp_error( $response ) ) {
            return array(
                'success' => false,
                'error' => $response->get_error_message(),
                'model' => $model
            );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! empty( $data[ 'error' ] ) ) {
            return array(
                'success' => false,
                'error' => isset( $data[ 'error' ][ 'message' ] ) ? $data[ 'error' ][ 'message' ] : 'OpenAI error',
                'model' => $model,
                'raw' => $data
            );
        }

        $content = isset( $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] ) ? $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] : '';
        $usage   = isset( $data[ 'usage' ] ) && is_array( $data[ 'usage' ] ) ? $data[ 'usage' ] : array();

        return array(
            'success' => true,
            'content' => $content,
            'model' => $model,
            'prompt_tokens' => isset( $usage[ 'prompt_tokens' ] ) ? (int) $usage[ 'prompt_tokens' ] : null,
            'completion_tokens' => isset( $usage[ 'completion_tokens' ] ) ? (int) $usage[ 'completion_tokens' ] : null,
            'total_tokens' => isset( $usage[ 'total_tokens' ] ) ? (int) $usage[ 'total_tokens' ] : null,
            'finish_reason' => isset( $data[ 'choices' ][ 0 ][ 'finish_reason' ] ) ? $data[ 'choices' ][ 0 ][ 'finish_reason' ] : null
        );
    }

    /**
     * Generic chat completion using the Write-with-AI model/token/key settings.
     *
     * Shared by lightweight, plain-text generators (glossary definitions, FAQ answers)
     * that need the same dynamic model as Write with AI / AI Edit but a caller-supplied
     * system prompt instead of the doc-authoring HTML prompt. Returns the same structured
     * array shape as {@see self::generate_openai_response_ai_edit()}.
     *
     * @param string $user_prompt   The user message.
     * @param string $system_prompt Optional system message (omitted when empty).
     * @return array { success:bool, content?:string, error?:string, model:string, *_tokens?:int }
     */
    public function generate_text( $user_prompt, $system_prompt = '', $extra_system = array() ) {
        $api_key    = $this->settings->get( 'ai_autowrite_api_key', '' );
        $max_tokens = $this->settings->get( 'ai_autowrite_max_token', 2500 );
        $model      = $this->settings->get( 'write_with_ai_model', 'gpt-4o-mini' );

        $messages = array();
        if ( $system_prompt !== '' ) {
            $messages[] = array(
                'role'    => 'system',
                'content' => $system_prompt
            );
        }
        foreach ( $this->normalize_extra_system( $extra_system ) as $extra ) {
            $messages[] = $extra;
        }
        $messages[] = array(
            'role'    => 'user',
            'content' => $user_prompt
        );

        $api_endpoint = 'https://api.openai.com/v1/chat/completions';

        $payload = AIHelper::build_openai_payload( $model, $messages, $max_tokens, null, 'write_with_ai' );

        $request_options = array(
            'headers' => array(
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ),
            'body'    => wp_json_encode( $payload ),
            'timeout' => 300
        );

        // GPT-5.5 reasoning can run well past the default limits; give PHP and
        // the HTTP call room to finish (still subject to server php-fpm/nginx limits).
        if ( function_exists( 'set_time_limit' ) ) {
            set_time_limit( 300 );
        }

        $response = wp_remote_post( $api_endpoint, $request_options );

        if ( is_wp_error( $response ) ) {
            return array(
                'success' => false,
                'error'   => $response->get_error_message(),
                'model'   => $model
            );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! empty( $data[ 'error' ] ) ) {
            return array(
                'success' => false,
                'error'   => isset( $data[ 'error' ][ 'message' ] ) ? $data[ 'error' ][ 'message' ] : 'OpenAI error',
                'model'   => $model,
                'raw'     => $data
            );
        }

        $content = isset( $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] ) ? $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] : '';
        $usage   = isset( $data[ 'usage' ] ) && is_array( $data[ 'usage' ] ) ? $data[ 'usage' ] : array();

        return array(
            'success'           => true,
            'content'           => $content,
            'model'             => $model,
            'prompt_tokens'     => isset( $usage[ 'prompt_tokens' ] ) ? (int) $usage[ 'prompt_tokens' ] : null,
            'completion_tokens' => isset( $usage[ 'completion_tokens' ] ) ? (int) $usage[ 'completion_tokens' ] : null,
            'total_tokens'      => isset( $usage[ 'total_tokens' ] ) ? (int) $usage[ 'total_tokens' ] : null,
            'finish_reason'     => isset( $data[ 'choices' ][ 0 ][ 'finish_reason' ] ) ? $data[ 'choices' ][ 0 ][ 'finish_reason' ] : null
        );
    }

    /**
     * Generate an OpenAI chat completion with a caller-supplied system + user
     * prompt. Mirrors generate_openai_response_ai_edit() (same key/model/token
     * floor/timeout handling and return shape) but does NOT force the
     * documentation-writer system prompt, so callers such as the Docs AI Suite
     * (taxonomy suggestions, excerpts) can supply task-appropriate instructions.
     *
     * @param string     $system_prompt System instruction for the model.
     * @param string     $user_prompt   User message / content payload.
     * @param float|null $temperature   Optional sampling temperature (ignored for gpt-5*).
     * @return array{success:bool,content?:string,error?:string,model:string,...}
     */
    public function generate_openai_response_raw( $system_prompt, $user_prompt, $temperature = null ) {
        $api_key    = $this->settings->get( 'ai_autowrite_api_key', '' );
        $max_tokens = $this->settings->get( 'ai_autowrite_max_token', 2500 );
        $model      = $this->settings->get( 'write_with_ai_model', 'gpt-4o-mini' );

        $api_endpoint = 'https://api.openai.com/v1/chat/completions';

        $payload = AIHelper::build_openai_payload(
            $model,
            array(
                array(
                    'role' => 'system',
                    'content' => $system_prompt
                ),
                array(
                    'role' => 'user',
                    'content' => $user_prompt
                )
            ),
            $max_tokens,
            $temperature,
            'write_with_ai'
        );

        $request_options = array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ),
            'body' => wp_json_encode( $payload ),
            'timeout' => 300
        );

        if ( function_exists( 'set_time_limit' ) ) {
            set_time_limit( 300 );
        }

        $response = wp_remote_post( $api_endpoint, $request_options );

        if ( is_wp_error( $response ) ) {
            return array(
                'success' => false,
                'error' => $response->get_error_message(),
                'model' => $model
            );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        if ( ! empty( $data[ 'error' ] ) ) {
            return array(
                'success' => false,
                'error' => isset( $data[ 'error' ][ 'message' ] ) ? $data[ 'error' ][ 'message' ] : 'OpenAI error',
                'model' => $model,
                'raw' => $data
            );
        }

        $content = isset( $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] ) ? $data[ 'choices' ][ 0 ][ 'message' ][ 'content' ] : '';
        $usage   = isset( $data[ 'usage' ] ) && is_array( $data[ 'usage' ] ) ? $data[ 'usage' ] : array();

        return array(
            'success' => true,
            'content' => $content,
            'model' => $model,
            'prompt_tokens' => isset( $usage[ 'prompt_tokens' ] ) ? (int) $usage[ 'prompt_tokens' ] : null,
            'completion_tokens' => isset( $usage[ 'completion_tokens' ] ) ? (int) $usage[ 'completion_tokens' ] : null,
            'total_tokens' => isset( $usage[ 'total_tokens' ] ) ? (int) $usage[ 'total_tokens' ] : null,
            'finish_reason' => isset( $data[ 'choices' ][ 0 ][ 'finish_reason' ] ) ? $data[ 'choices' ][ 0 ][ 'finish_reason' ] : null
        );
    }

    public function generate_openai_content_callback() {
        // Verify the nonce
        $ai_nonce = isset( $_POST['ai_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['ai_nonce'] ) ) : '';
        if ( ! wp_verify_nonce( $ai_nonce, 'generate_openai_content_nonce' ) ) {
            wp_send_json_error( 'Invalid nonce' );
            wp_die();
        }

        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_send_json_error( 'Insufficient permissions' );
            wp_die();
        }

        $prompt   = isset( $_POST['prompt'] ) ? sanitize_text_field( wp_unslash( $_POST['prompt'] ) ) : '';
        $keywords = isset( $_POST['keywords'] ) ? sanitize_text_field( wp_unslash( $_POST['keywords'] ) ) : '';

        $ai_instance = new WriteWithAI( $this->settings );

        $generated_content = $ai_instance->generate_openai_response( $prompt, $keywords );

        // Count a successful generation (skip obvious upstream errors).
        if ( is_string( $generated_content ) && $generated_content !== '' && strpos( $generated_content, 'Error:' ) !== 0 ) {
            $post_id = isset( $_POST[ 'post_id' ] ) ? intval( $_POST[ 'post_id' ] ) : 0; //phpcs:ignore
            AIUsage::record( 'write_with_ai', $post_id );
        }

        // Send the generated content as the AJAX response
        wp_send_json_success( $generated_content );
        wp_die();
    }
}
