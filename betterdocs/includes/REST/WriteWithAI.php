<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Utils\AIUsage;

/**
 * REST surface for the redesigned "Write with AI" modal.
 *
 * Replaces the legacy admin-ajax `generate_openai_content` handler. Supports the
 * superset modal's flows: full-doc generation, outline generation, expanding an
 * approved outline into a doc, and generating a doc from pasted source content.
 * All generation reuses the WriteWithAI service (same model/key/token settings).
 *
 * @see \WPDeveloper\BetterDocs\REST\AIEdit  Sibling endpoint this mirrors.
 */
class WriteWithAI extends BaseAPI {

    const MAX_SOURCE_LENGTH = 12000;
    const MAX_PROMPT_LENGTH = 4000;

    public function register() {
        $this->post(
            '/write-with-ai',
            array( $this, 'generate' ),
            array(
                'post_id' => array(
                    'type'     => 'integer',
                    'required' => false,
                    'default'  => 0,
                ),
                'action' => array(
                    'type'     => 'string',
                    'required' => true,
                ),
                'title' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'keywords' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'prompt' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'source' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'source_type' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'git_url' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'git_action' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                // "Browse repository" picker params (git-repos / git-items / git-contents).
                'repo' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'kind' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'path' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'ref' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'outline' => array(
                    'type'     => 'array',
                    'required' => false,
                    'default'  => array(),
                ),
                'tone' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => '',
                ),
                'doc_size' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => 'any',
                ),
                'generate_title' => array(
                    'type'     => 'boolean',
                    'required' => false,
                    'default'  => false,
                ),
                'instruction_ids' => array(
                    'type'     => 'array',
                    'required' => false,
                    'default'  => array(),
                ),
            )
        );
    }

    public function permission_check() {
        // Gate on edit_others_posts to match the sibling FAQ/Glossary AI endpoints
        // (AIFaq/AIGlossary) and keep Author-role users from spending the AI budget.
        return current_user_can( 'edit_others_posts' );
    }

    public function generate( WP_REST_Request $request ) {
        $write_ai = betterdocs()->ai_autowrtie;

        if ( empty( $write_ai ) || ! $write_ai->isEnabledWriteWithAI() ) {
            return $this->error(
                'ai_disabled',
                __( 'Write with AI is disabled. Enable it from BetterDocs settings.', 'betterdocs' ),
                400
            );
        }

        if ( empty( $write_ai->get_api_key() ) ) {
            return $this->error(
                'missing_key',
                __( 'OpenAI API key is missing. Add one in BetterDocs settings.', 'betterdocs' ),
                400
            );
        }

        $action   = sanitize_key( (string) $request->get_param( 'action' ) );
        $post_id  = (int) $request->get_param( 'post_id' );
        // NOTE: this text is sent verbatim in the OpenAI request body, not rendered
        // as HTML, so we must NOT strip tags. sanitize_textarea_field() runs
        // wp_strip_all_tags(), which would delete <ProductCard>, Array<T>, JSX/XML/HTML
        // from the prompt before the model ever sees it. wp_check_invalid_utf8() keeps
        // the angle brackets while still guarding against malformed UTF-8.
        $prompt   = $this->clip( wp_check_invalid_utf8( (string) $request->get_param( 'prompt' ) ), self::MAX_PROMPT_LENGTH );
        $keywords = sanitize_text_field( (string) $request->get_param( 'keywords' ) );

        // Generation directives assembled server-side from the simplified modal.
        $tone           = sanitize_text_field( (string) $request->get_param( 'tone' ) );
        $doc_size       = sanitize_key( (string) $request->get_param( 'doc_size' ) );
        $generate_title = (bool) $request->get_param( 'generate_title' );

        // Selected instruction sets → extra system messages layered on the base
        // (Default) system prompt. Unknown/empty ids are dropped by the resolver.
        $instruction_ids = (array) $request->get_param( 'instruction_ids' );
        $extra_system    = $write_ai->get_instruction_messages( $instruction_ids );

        switch ( $action ) {
            case 'generate-outline':
                // Tone steers an outline; size/title only matter for the full doc.
                $outline_prompt = $this->wrap_topic( $prompt )
                    . $this->build_directives( $tone, $doc_size, false, false, false );
                return $this->handle_outline( $write_ai, $post_id, $outline_prompt, $extra_system );

            case 'generate-doc':
                $doc_prompt = $this->wrap_topic( $prompt )
                    . $this->build_directives( $tone, $doc_size, $generate_title );
                return $this->handle_doc( $write_ai, $post_id, $doc_prompt, $keywords, $action, $doc_size, $extra_system );

            case 'expand-outline':
                $outline = $this->sanitize_outline( (array) $request->get_param( 'outline' ) );
                if ( empty( $outline ) ) {
                    return $this->error( 'ai_empty_outline', __( 'No outline provided to expand.', 'betterdocs' ), 400 );
                }
                $expand_prompt = $this->wrap_topic( $prompt ) . "\n\n"
                    . __( 'Write the full documentation following EXACTLY this approved outline. Keep the heading order and levels:', 'betterdocs' )
                    . "\n" . $this->render_outline( $outline )
                    . $this->build_directives( $tone, $doc_size, $generate_title );
                return $this->handle_doc( $write_ai, $post_id, $expand_prompt, $keywords, $action, $doc_size, $extra_system );

            case 'from-source':
                // Prompt-bound source text: preserve tags (see the prompt note above).
                $source = $this->clip( wp_check_invalid_utf8( (string) $request->get_param( 'source' ) ), self::MAX_SOURCE_LENGTH );
                if ( '' === trim( $source ) ) {
                    return $this->error( 'ai_empty_source', __( 'Please paste some source content.', 'betterdocs' ), 400 );
                }
                $src_type = sanitize_text_field( (string) $request->get_param( 'source_type' ) );
                $src_labels = array(
                    'transcript' => __( 'support transcript', 'betterdocs' ),
                    'forum'      => __( 'forum thread', 'betterdocs' ),
                    'notes'      => __( 'raw notes', 'betterdocs' ),
                );
                $src_label = isset( $src_labels[ $src_type ] ) ? $src_labels[ $src_type ] : __( 'source material', 'betterdocs' );

                // Light per-type framing: a one-line system hint steering how to treat
                // this kind of material. Auto-detect (empty source_type) sends no hint.
                $src_frames = array(
                    'transcript' => __( 'The source below is a customer-support conversation. Focus on the user\'s problem and its resolution; ignore greetings and small talk.', 'betterdocs' ),
                    'forum'      => __( 'The source below is a forum discussion among multiple people. Treat the accepted or most-supported answer as authoritative and skip off-topic replies.', 'betterdocs' ),
                    'notes'      => __( 'The source below is rough notes. Expand them into clear, complete prose.', 'betterdocs' ),
                );
                if ( isset( $src_frames[ $src_type ] ) ) {
                    array_unshift( $extra_system, array( 'role' => 'system', 'content' => $src_frames[ $src_type ] ) );
                }

                $source_prompt = trim( $prompt . "\n\n"
                    . sprintf(
                        /* translators: %s: source content type, e.g. "support transcript". */
                        __( 'Turn the following %s into structured documentation. Use only the information it contains; do not invent details:', 'betterdocs' ),
                        $src_label
                    )
                    . "\n---\n" . $source . "\n---" )
                    . $this->build_directives( $tone, $doc_size, $generate_title );
                return $this->handle_doc( $write_ai, $post_id, $source_prompt, $keywords, $action, $doc_size, $extra_system );

            case 'git-repos':
            case 'git-items':
            case 'git-contents':
                // "Browse repository" data for the From Git tab. Read-only listing
                // that delegates to Pro (token + Git API live there). The picker
                // builds a github.com URL client-side and generation still runs via
                // the 'from-git' fetch above.
                if ( ! betterdocs()->is_pro_active() ) {
                    return $this->error( 'pro_required', __( 'Generating from Git is a BetterDocs Pro feature.', 'betterdocs' ), 403 );
                }

                if ( 'git-repos' === $action ) {
                    $list = apply_filters( 'betterdocs_write_with_ai_git_repos', null );
                    $payload_key = 'repos';
                } elseif ( 'git-items' === $action ) {
                    $repo = sanitize_text_field( (string) $request->get_param( 'repo' ) );
                    $kind = sanitize_key( (string) $request->get_param( 'kind' ) );
                    if ( '' === $repo ) {
                        return $this->error( 'git_bad_repo', __( 'Please choose a repository.', 'betterdocs' ), 400 );
                    }
                    if ( ! in_array( $kind, array( 'pull', 'issue' ), true ) ) {
                        $kind = 'pull';
                    }
                    $list = apply_filters( 'betterdocs_write_with_ai_git_items', null, $repo, $kind );
                    $payload_key = 'items';
                } else { // git-contents
                    $repo = sanitize_text_field( (string) $request->get_param( 'repo' ) );
                    // Path segments come from GitHub's contents API verbatim; keep
                    // slashes/spaces (sanitize_text_field trims tags, not slashes).
                    $path = sanitize_text_field( (string) $request->get_param( 'path' ) );
                    $ref  = sanitize_text_field( (string) $request->get_param( 'ref' ) );
                    if ( '' === $repo ) {
                        return $this->error( 'git_bad_repo', __( 'Please choose a repository.', 'betterdocs' ), 400 );
                    }
                    $list = apply_filters( 'betterdocs_write_with_ai_git_contents', null, $repo, $path, $ref );
                    $payload_key = null; // return the { ref, path, items } structure as-is
                }

                if ( is_wp_error( $list ) ) {
                    return $this->error( $list->get_error_code() ?: 'git_list_failed', $list->get_error_message(), 400 );
                }
                if ( null === $list ) {
                    return $this->error( 'git_unavailable', __( 'Could not reach Git. Confirm Git Sync is connected.', 'betterdocs' ), 400 );
                }
                return $this->success( null === $payload_key ? (array) $list : array( $payload_key => $list ) );

            case 'from-git':
                // From Git is a Pro feature — the fetch runs in betterdocs-pro. The
                // modal already blocks this without Pro, but keep the endpoint honest.
                if ( ! betterdocs()->is_pro_active() ) {
                    return $this->error( 'pro_required', __( 'Generating from Git is a BetterDocs Pro feature.', 'betterdocs' ), 403 );
                }

                $git_url = esc_url_raw( trim( (string) $request->get_param( 'git_url' ) ) );
                if ( '' === $git_url ) {
                    return $this->error( 'ai_empty_git', __( 'Please paste a Git URL (a pull request or a repository file).', 'betterdocs' ), 400 );
                }

                // Delegate the actual fetch to Pro (token + API client live there).
                $fetched = apply_filters( 'betterdocs_write_with_ai_git_fetch', null, $git_url, array( 'post_id' => $post_id ) );

                if ( is_wp_error( $fetched ) ) {
                    return $this->error( $fetched->get_error_code() ?: 'git_fetch_failed', $fetched->get_error_message(), 400 );
                }
                if ( empty( $fetched ) || empty( $fetched['content'] ) ) {
                    return $this->error( 'git_unavailable', __( 'Could not read anything from that Git URL. Check the link, or confirm Git Sync is connected.', 'betterdocs' ), 400 );
                }

                // Fetched Git content is code/diffs; preserve tags (see the prompt note above).
                $git_content = $this->clip( wp_check_invalid_utf8( (string) $fetched['content'] ), self::MAX_SOURCE_LENGTH );
                if ( '' === trim( $git_content ) ) {
                    return $this->error( 'git_unavailable', __( 'The fetched Git content was empty.', 'betterdocs' ), 400 );
                }
                $git_label = ! empty( $fetched['source_label'] ) ? sanitize_text_field( (string) $fetched['source_label'] ) : __( 'source material', 'betterdocs' );

                // Optional per-intent framing, mirroring from-source's per-type hints.
                $git_action = sanitize_key( (string) $request->get_param( 'git_action' ) );
                $git_frames = array(
                    'document_feature' => __( 'The source below was fetched from a Git pull request or code change. Explain, in end-user documentation terms, what the feature does and how to use it — not the implementation details or code.', 'betterdocs' ),
                    'adapt_doc'        => __( 'The source below is an existing documentation file from a Git repository. Rewrite it as a fresh doc for this site, keeping the meaning but improving clarity and structure.', 'betterdocs' ),
                    'howto'            => __( 'Turn the source below into a concise, step-by-step how-to guide.', 'betterdocs' ),
                );
                if ( isset( $git_frames[ $git_action ] ) ) {
                    array_unshift( $extra_system, array( 'role' => 'system', 'content' => $git_frames[ $git_action ] ) );
                }

                $git_prompt = trim( $prompt . "\n\n"
                    . sprintf(
                        /* translators: %s: the kind of Git source, e.g. "pull request" or "documentation file". */
                        __( 'Turn the following %s into structured documentation. Use only the information it contains; do not invent details:', 'betterdocs' ),
                        $git_label
                    )
                    . "\n---\n" . $git_content . "\n---" )
                    . $this->build_directives( $tone, $doc_size, $generate_title );
                return $this->handle_doc( $write_ai, $post_id, $git_prompt, $keywords, $action, $doc_size, $extra_system );

            default:
                return $this->error( 'ai_bad_action', __( 'Unknown AI action.', 'betterdocs' ), 400 );
        }
    }

    /**
     * Full-doc generation (generate-doc, expand-outline, from-source all land here).
     */
    protected function handle_doc( $write_ai, $post_id, $prompt, $keywords, $action, $doc_size = 'any', $extra_system = array() ) {
        if ( '' === trim( $prompt ) ) {
            return $this->error( 'ai_empty_prompt', __( 'Please provide a prompt for the AI.', 'betterdocs' ), 400 );
        }

        // A "long" doc can outrun the default 2500-token cap; give it headroom.
        $max_tokens = 'long' === $doc_size ? 4000 : null;

        $content = $write_ai->generate_openai_response( $prompt, $keywords, $max_tokens, $extra_system );

        if ( ! is_string( $content ) || '' === trim( $content ) ) {
            return $this->error( 'empty', __( 'The AI returned no content. Try again or rephrase your prompt.', 'betterdocs' ), 502 );
        }
        if ( 0 === strpos( $content, 'Error:' ) ) {
            return $this->error( 'ai_upstream', $content, 502 );
        }

        // Sanitize the model-generated HTML before it leaves the server: the editor
        // renders it via dangerouslySetInnerHTML in the preview and inserts it as
        // blocks, so strip <script>, event-handler attributes, <iframe> and
        // javascript: URLs while keeping valid documentation markup. The system
        // prompt asks the model to avoid these, but that is a soft constraint — this
        // is the enforcement (a prompt-injected source/Git payload can't inject XSS).
        $content = wp_kses_post( $content );

        AIUsage::record( 'write_with_ai', $post_id, $action );

        return $this->success( array( 'content' => $content, 'action' => $action ) );
    }

    /**
     * Outline-only generation.
     */
    protected function handle_outline( $write_ai, $post_id, $prompt, $extra_system = array() ) {
        if ( '' === trim( $prompt ) ) {
            return $this->error( 'ai_empty_prompt', __( 'Please provide a prompt for the AI.', 'betterdocs' ), 400 );
        }

        $result = $write_ai->generate_outline_response( $prompt, $extra_system );

        if ( empty( $result['success'] ) ) {
            $message = isset( $result['error'] ) ? (string) $result['error'] : __( 'Unknown AI error.', 'betterdocs' );
            return $this->error( 'ai_upstream', $message, 502 );
        }

        AIUsage::record( 'write_with_ai', $post_id, 'generate-outline' );

        return $this->success( array( 'outline' => $result['outline'], 'action' => 'generate-outline' ) );
    }

    /**
     * Normalize an outline payload into a clean list of { level, text } items.
     *
     * @param array $raw
     * @return array<int,array{level:string,text:string}>
     */
    protected function sanitize_outline( $raw ) {
        $outline = array();
        foreach ( $raw as $item ) {
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

    /**
     * Render an outline array into an indented plain-text list for the prompt.
     */
    protected function render_outline( $outline ) {
        $lines = array();
        foreach ( $outline as $sec ) {
            $prefix  = 'h3' === $sec['level'] ? '    - ' : '- ';
            $lines[] = $prefix . $sec['text'];
        }
        return implode( "\n", $lines );
    }

    protected function clip( $value, $max ) {
        return strlen( $value ) > $max ? substr( $value, 0, $max ) : $value;
    }

    /**
     * Frame the user's free-form request as a documentation instruction. Returns
     * an empty string for an empty request (callers compose their own prompt).
     */
    protected function wrap_topic( $prompt ) {
        $prompt = trim( $prompt );
        if ( '' === $prompt ) {
            return '';
        }
        return __( 'Write documentation for the following request:', 'betterdocs' ) . "\n\n" . $prompt;
    }

    /**
     * Build the tone / size / title directive block appended to the prompt. Tone
     * applies to every action; size and the title instruction are doc-only.
     *
     * @param string $tone           Selected tone slug ('' = default, no directive).
     * @param string $doc_size       Selected size slug ('any' = no directive).
     * @param bool   $generate_title Whether the AI should also produce an <h1> title.
     * @param bool   $include_size   Include the size directive (false for outlines).
     * @param bool   $include_title  Include the title directive (false for outlines).
     * @return string Leading "\n\n" + directives, or '' when none apply.
     */
    protected function build_directives( $tone, $doc_size, $generate_title, $include_size = true, $include_title = true ) {
        $lines = array();

        $tone_map = array(
            'friendly'     => __( 'Write in a warm, friendly, approachable tone.', 'betterdocs' ),
            'professional' => __( 'Write in a polished, professional tone.', 'betterdocs' ),
            'technical'    => __( 'Write in a precise, technical tone suited to a technical audience.', 'betterdocs' ),
            'formal'       => __( 'Write in a formal tone.', 'betterdocs' ),
            'casual'       => __( 'Write in a casual, conversational tone.', 'betterdocs' ),
        );
        if ( isset( $tone_map[ $tone ] ) ) {
            $lines[] = $tone_map[ $tone ];
        }

        if ( $include_size ) {
            $size_map = array(
                'short'  => __( 'Keep the documentation concise — roughly 300–500 words, covering only the essential points.', 'betterdocs' ),
                'medium' => __( 'Aim for a moderate length — roughly 600–1000 words.', 'betterdocs' ),
                'long'   => __( 'Be comprehensive and in-depth — roughly 1200 words or more, with thorough coverage and examples.', 'betterdocs' ),
            );
            if ( isset( $size_map[ $doc_size ] ) ) {
                $lines[] = $size_map[ $doc_size ];
            }
        }

        if ( $include_title && $generate_title ) {
            $lines[] = __( 'Begin the output with a single <h1> element containing a concise, descriptive title for this documentation, then continue with the body content.', 'betterdocs' );
        }

        return empty( $lines ) ? '' : "\n\n" . implode( "\n", $lines );
    }
}
