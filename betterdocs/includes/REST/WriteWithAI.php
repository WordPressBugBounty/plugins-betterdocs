<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Utils\AIUsage;
use WPDeveloper\BetterDocs\AI\ProviderFactory;

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

    // "From Attachment" source: server-side text extraction from an uploaded file.
    // 5 MB is generous for text/markdown/DOCX while capping abuse; the extracted
    // text is still clipped to MAX_SOURCE_LENGTH before it reaches the model.
    const MAX_UPLOAD_BYTES = 5242880; // 5 MB

    // Recordings get their own, larger cap: 25 MB is OpenAI's transcription
    // limit — roughly 25 minutes of mono MP3 — and there is no point accepting
    // a file the provider will refuse. Gemini is capped lower still (see
    // media_cap_for_platform): its media rides inline as base64, which inflates
    // the payload by about a third.
    //
    // The cap sits 1 MB under that limit, not on it: the limit applies to the
    // whole request, and a file of exactly 25 MB plus the multipart fields and
    // boundaries would be refused after the full upload.
    const MAX_MEDIA_BYTES = 25165824; // 24 MB
    const MAX_MEDIA_BYTES_INLINE = 15728640; // 15 MB — inline-data platforms

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
                __( 'AI API key is missing. Add one in BetterDocs settings.', 'betterdocs' ),
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
                    'recording'  => __( 'recording transcript', 'betterdocs' ),
                );
                $src_label = isset( $src_labels[ $src_type ] ) ? $src_labels[ $src_type ] : __( 'source material', 'betterdocs' );

                // Light per-type framing: a one-line system hint steering how to treat
                // this kind of material. Auto-detect (empty source_type) sends no hint.
                $src_frames = array(
                    'transcript' => __( 'The source below is a customer-support conversation. Focus on the user\'s problem and its resolution; ignore greetings and small talk.', 'betterdocs' ),
                    'forum'      => __( 'The source below is a forum discussion among multiple people. Treat the accepted or most-supported answer as authoritative and skip off-topic replies.', 'betterdocs' ),
                    'notes'      => __( 'The source below is rough notes. Expand them into clear, complete prose.', 'betterdocs' ),
                    // Speech-to-text output reads nothing like written source: it
                    // has no punctuation discipline, keeps every "um", and may
                    // label speakers. Say so, or the model documents the filler.
                    'recording'  => __( 'The source below is a machine transcript of an audio or video recording. It may contain filler words, false starts, repetition and speaker labels — ignore those and document only the substance. The author has already reviewed it, so keep their spelling of names and product terms exactly as written.', 'betterdocs' ),
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
                // A doc written from a recording's transcript counts as a recording
                // in the insights, once — the transcribe step records nothing.
                $usage_action = 'recording' === $src_type ? 'from-recording' : null;
                return $this->handle_doc( $write_ai, $post_id, $source_prompt, $keywords, $action, $doc_size, $extra_system, null, $usage_action );

            case 'transcribe-attachment':
                // Step one of the recording flow: upload → transcript. No doc is
                // written here. The transcript goes back to the modal so the
                // author can fix mis-heard product names, and generation then
                // runs through the ordinary `from-source` path with that text —
                // which is why there is no media-shaped generation path at all.
                $media = $this->read_uploaded_attachment( $request );
                if ( is_wp_error( $media ) ) {
                    return $this->error( $media->get_error_code() ?: 'ai_attachment_failed', $media->get_error_message(), 400 );
                }

                if ( ! isset( $media['kind'] ) || 'media' !== $media['kind'] ) {
                    return $this->error( 'ai_not_media', __( 'That file is not an audio or video recording.', 'betterdocs' ), 400 );
                }

                $transcript = $write_ai->transcribe( array(
                    'path'     => $media['path'],
                    'filename' => $media['name'],
                    'mime'     => $media['mime'],
                ) );

                if ( is_wp_error( $transcript ) ) {
                    $code = $transcript->get_error_code() ?: 'ai_transcribe_failed';
                    // A platform that cannot transcribe is the user's setting to
                    // change, not an upstream fault — 400, like ai_no_vision.
                    return $this->error( $code, $transcript->get_error_message(), 'ai_no_transcription' === $code ? 400 : 502 );
                }

                // Clip before returning, not after editing: the author should be
                // correcting exactly the text the model will receive, rather than
                // polishing a tail that gets silently cut on the way out.
                //
                // A clipped transcript says so in its own text: the author sees
                // where it stops, and the marker travels with the text to the
                // model, which would otherwise document half a recording as if it
                // were the whole of it.
                $transcript = wp_check_invalid_utf8( (string) $transcript, true );
                $clipped    = strlen( $transcript ) > self::MAX_SOURCE_LENGTH;

                if ( $clipped ) {
                    $marker     = "\n\n" . __( '[Transcript cut off here: the recording is longer than BetterDocs AI can use at once.]', 'betterdocs' );
                    $transcript = rtrim( $this->clip( $transcript, self::MAX_SOURCE_LENGTH - strlen( $marker ) ) ) . $marker;
                }

                if ( '' === trim( $transcript ) ) {
                    return $this->error( 'ai_no_speech', __( 'No speech was found in that recording.', 'betterdocs' ), 400 );
                }

                // No AIUsage::record() here. Nothing has been written yet — the doc
                // is generated by the `from-source` call that follows, which records
                // it (as a recording, via source_type). Counting both made every
                // recording-based doc show up twice in the insights.

                return $this->success( array(
                    'transcript' => $transcript,
                    'clipped'    => $clipped,
                    'name'       => $media['name'],
                    'action'     => $action,
                ) );

            case 'from-attachment':
                // Upload a file; extract its text server-side and treat it exactly
                // like from-source (same "use only what it contains" contract and
                // the same handle_doc → wp_kses_post output path). The file itself
                // is never stored or rendered — only its extracted text is used as
                // grounded prompt context.
                $extracted = $this->read_uploaded_attachment( $request );
                if ( is_wp_error( $extracted ) ) {
                    return $this->error( $extracted->get_error_code() ?: 'ai_attachment_failed', $extracted->get_error_message(), 400 );
                }

                // A recording has no text to extract; it goes through
                // `transcribe-attachment` first. Sent here directly (an older modal,
                // or a hand-made request) it used to fall through to the text path
                // and read an undefined `text` key.
                if ( isset( $extracted['kind'] ) && 'media' === $extracted['kind'] ) {
                    return $this->error( 'ai_needs_transcript', __( 'Recordings are transcribed first. Use "Transcribe recording", then generate from the transcript.', 'betterdocs' ), 400 );
                }

                // Image attachment → send the picture to a vision-capable model
                // instead of extracting text (there is none). Same handle_doc
                // output path (wp_kses_post), just a multimodal request.
                if ( isset( $extracted['kind'] ) && 'image' === $extracted['kind'] ) {
                    $image_prompt = trim( $prompt . "\n\n"
                        . sprintf(
                            /* translators: %s: the uploaded image file name. */
                            __( 'Read the attached image "%s" and turn what it shows — its text, tables, diagrams, UI or screenshots — into structured documentation. Describe only what is actually visible in the image; do not invent details:', 'betterdocs' ),
                            $extracted['name']
                        ) )
                        . $this->build_directives( $tone, $doc_size, $generate_title );

                    return $this->handle_doc( $write_ai, $post_id, $image_prompt, $keywords, $action, $doc_size, $extra_system, $extracted );
                }

                // Extracted file text is prompt-bound source (not rendered as HTML),
                // so preserve angle brackets like from-source/from-git do.
                $file_text = $this->clip( wp_check_invalid_utf8( (string) $extracted['text'], true ), self::MAX_SOURCE_LENGTH );
                if ( '' === trim( $file_text ) ) {
                    return $this->error( 'ai_empty_attachment', __( 'No readable text was found in that file.', 'betterdocs' ), 400 );
                }

                $file_prompt = trim( $prompt . "\n\n"
                    . sprintf(
                        /* translators: %s: the uploaded file name. */
                        __( 'Turn the content of the uploaded file "%s" into structured documentation. Use only the information it contains; do not invent details:', 'betterdocs' ),
                        $extracted['name']
                    )
                    . "\n---\n" . $file_text . "\n---" )
                    . $this->build_directives( $tone, $doc_size, $generate_title );
                return $this->handle_doc( $write_ai, $post_id, $file_prompt, $keywords, $action, $doc_size, $extra_system );

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
    protected function handle_doc( $write_ai, $post_id, $prompt, $keywords, $action, $doc_size = 'any', $extra_system = array(), $image = null, $usage_action = null ) {
        if ( '' === trim( $prompt ) ) {
            return $this->error( 'ai_empty_prompt', __( 'Please provide a prompt for the AI.', 'betterdocs' ), 400 );
        }

        // A "long" doc can outrun the default 2500-token cap; give it headroom.
        $max_tokens = 'long' === $doc_size ? 4000 : null;

        if ( null !== $image ) {
            // Image attachment: send the picture to a vision model. Returns a
            // WP_Error when the configured model can't read images (guard) — surface
            // that as a 400 so the user knows to switch models, not a 502.
            $content = $write_ai->generate_vision_response( $prompt, $image, $max_tokens, $extra_system );
            if ( is_wp_error( $content ) ) {
                $code = $content->get_error_code() ?: 'ai_vision_failed';
                return $this->error( $code, $content->get_error_message(), 'ai_no_vision' === $code ? 400 : 502 );
            }
        } else {
            $content = $write_ai->generate_openai_response( $prompt, $keywords, $max_tokens, $extra_system );
        }

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

        // `$usage_action` lets a caller count the generation under a different
        // mode than the action it answers to (a recording arrives as from-source).
        AIUsage::record( 'write_with_ai', $post_id, null !== $usage_action ? $usage_action : $action );

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

    /**
     * Validate the uploaded "From Attachment" file and return its extracted text.
     *
     * Security: enforces is_uploaded_file (a real HTTP upload, not an arbitrary
     * server path), a byte cap, and a strict extension + MIME allow-list via
     * wp_check_filetype(). The file is read for text only — never moved into the
     * uploads dir, stored, or rendered — so there is no persisted attack surface.
     *
     * @param WP_REST_Request $request
     * @return array{name:string,text:string}|\WP_Error
     */
    protected function read_uploaded_attachment( WP_REST_Request $request ) {
        $files = $request->get_file_params();
        if ( empty( $files['file'] ) || ! is_array( $files['file'] ) ) {
            return new \WP_Error( 'ai_no_file', __( 'No file was received. Choose a file to write from.', 'betterdocs' ) );
        }

        $file = $files['file'];

        if ( ! empty( $file['error'] ) || empty( $file['tmp_name'] ) || ! is_uploaded_file( $file['tmp_name'] ) ) {
            return new \WP_Error( 'ai_upload_failed', __( 'The upload did not complete — please try again.', 'betterdocs' ) );
        }

        // Strict extension + MIME allow-list. wp_check_filetype() validates the
        // name against exactly these types; anything else yields an empty ext.
        $allowed = array_merge(
            array(
                'txt'         => 'text/plain',
                'md|markdown' => 'text/markdown',
                'docx'        => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'pdf'         => 'application/pdf',
                'png'         => 'image/png',
                'jpg|jpeg'    => 'image/jpeg',
                'webp'        => 'image/webp',
            ),
            self::media_mimes()
        );
        $check = wp_check_filetype( (string) $file['name'], $allowed );
        $ext   = strtolower( (string) $check['ext'] );

        $image_exts = array( 'png', 'jpg', 'jpeg', 'webp' );
        $text_exts  = array( 'txt', 'md', 'markdown', 'docx', 'pdf' );
        $media_exts = self::media_exts();

        if ( ! in_array( $ext, array_merge( $text_exts, $image_exts, $media_exts ), true ) ) {
            // .mov and .avi are the two formats people actually try and that no
            // provider accepts, so name the fix rather than listing types again.
            $tried = strtolower( (string) pathinfo( (string) $file['name'], PATHINFO_EXTENSION ) );
            if ( in_array( $tried, array( 'mov', 'avi', 'wmv', 'mkv' ), true ) ) {
                return new \WP_Error(
                    'ai_bad_filetype',
                    sprintf(
                        /* translators: %s: the uploaded file's extension, e.g. "mov". */
                        __( '.%s recordings are not supported. Export or convert it to MP4 and upload that.', 'betterdocs' ),
                        $tried
                    )
                );
            }

            return new \WP_Error( 'ai_bad_filetype', __( 'Unsupported file type. Upload a .pdf, .docx, .txt, .md, an image (.png, .jpg, .webp), or a recording (.mp3, .m4a, .wav, .flac, .ogg, .mp4, .mpeg, .webm).', 'betterdocs' ) );
        }

        // Size is capped per kind: a recording is legitimately much larger than a
        // text file, but the cap can never exceed what the host will actually
        // accept — PHP truncates a POST over post_max_size before we see it.
        $is_media = in_array( $ext, $media_exts, true );
        $cap      = self::upload_cap( $is_media ? 'media' : 'file' );

        if ( (int) $file['size'] > $cap ) {
            return new \WP_Error(
                'ai_file_too_large',
                sprintf(
                    /* translators: %s: maximum allowed size, e.g. "25 MB". */
                    __( 'The file exceeds the %s limit.', 'betterdocs' ),
                    size_format( $cap )
                )
            );
        }

        // Image → send the picture itself to a vision model (there is no text to
        // extract). Verify it is a real image by its bytes, not just its name,
        // then hand back a base64 data URI for the multimodal request.
        if ( in_array( $ext, $image_exts, true ) ) {
            $raw = file_get_contents( (string) $file['tmp_name'] ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- local tmp upload.
            if ( false === $raw || '' === $raw ) {
                return new \WP_Error( 'ai_read_failed', __( 'Could not read the image file.', 'betterdocs' ) );
            }

            $info = @getimagesize( (string) $file['tmp_name'] );
            $mime = ( is_array( $info ) && ! empty( $info['mime'] ) ) ? (string) $info['mime'] : '';

            if ( ! in_array( $mime, array( 'image/png', 'image/jpeg', 'image/webp' ), true ) ) {
                return new \WP_Error( 'ai_bad_image', __( 'That file is not a valid PNG, JPG or WEBP image.', 'betterdocs' ) );
            }

            return array(
                'name'     => sanitize_file_name( (string) $file['name'] ),
                'kind'     => 'image',
                'mime'     => $mime,
                'data_uri' => 'data:' . $mime . ';base64,' . base64_encode( $raw ),
            );
        }

        // Recording → nothing to extract here; it goes to a speech-to-text model
        // whole. Verify the bytes really are audio/video before handing a file to
        // a paid endpoint: wp_check_filetype() above only read the *name*, so a
        // renamed binary would otherwise sail through.
        if ( $is_media ) {
            $real = wp_check_filetype_and_ext( (string) $file['tmp_name'], (string) $file['name'], $allowed );
            $mime = ! empty( $real['type'] ) ? (string) $real['type'] : '';

            if ( '' === $mime && function_exists( 'finfo_open' ) ) {
                // wp_check_filetype_and_ext() only sniffs images and a short list
                // of text formats; for A/V it hands back the name-based guess or
                // nothing at all. finfo is the actual byte check.
                $finfo = finfo_open( FILEINFO_MIME_TYPE );
                if ( $finfo ) {
                    $sniffed = finfo_file( $finfo, (string) $file['tmp_name'] );
                    finfo_close( $finfo );
                    $mime = is_string( $sniffed ) ? $sniffed : '';
                }
            }

            if ( 0 !== strpos( $mime, 'audio/' ) && 0 !== strpos( $mime, 'video/' ) ) {
                return new \WP_Error( 'ai_bad_media', __( 'That file is not a readable audio or video recording.', 'betterdocs' ) );
            }

            return array(
                'name' => sanitize_file_name( (string) $file['name'] ),
                'kind' => 'media',
                'mime' => $mime,
                'path' => (string) $file['tmp_name'],
                'size' => (int) $file['size'],
            );
        }

        $text = $this->extract_attachment_text( (string) $file['tmp_name'], $ext );
        if ( is_wp_error( $text ) ) {
            return $text;
        }

        return array(
            'name' => sanitize_file_name( (string) $file['name'] ),
            'kind' => 'text',
            'text' => $text,
        );
    }

    /**
     * Extension → MIME map for the recording formats OpenAI's transcription
     * endpoint accepts. The video containers are here on purpose: the endpoint
     * reads their audio track, which is what lets this feature work without
     * ffmpeg on the host.
     *
     * @since 4.9.4
     *
     * @return array<string,string>
     */
    public static function media_mimes() {
        return array(
            'mp3|mpga' => 'audio/mpeg',
            'm4a'      => 'audio/mp4',
            'wav'      => 'audio/wav',
            'flac'     => 'audio/flac',
            'ogg|oga'  => 'audio/ogg',
            'mp4'      => 'video/mp4',
            'mpeg|mpg' => 'video/mpeg',
            'webm'     => 'video/webm',
        );
    }

    /**
     * Flat list of accepted recording extensions.
     *
     * @since 4.9.4
     *
     * @return string[]
     */
    public static function media_exts() {
        $exts = array();
        foreach ( array_keys( self::media_mimes() ) as $group ) {
            foreach ( explode( '|', $group ) as $ext ) {
                $exts[] = $ext;
            }
        }
        return $exts;
    }

    /**
     * Effective upload ceiling for a kind of attachment, in bytes.
     *
     * Always clamped to what the host will accept. A site with
     * `upload_max_filesize = 8M` cannot receive 25 MB no matter what we allow —
     * PHP discards the body and the request arrives empty — so advertising the
     * higher number would just produce an unexplained failure.
     *
     * @since 4.9.4
     *
     * @param string $kind `media` | `file`
     * @return int
     */
    public static function upload_cap( $kind = 'file' ) {
        $cap  = ( 'media' === $kind ) ? self::media_cap_for_platform() : self::MAX_UPLOAD_BYTES;
        $host = (int) wp_max_upload_size();

        return ( $host > 0 && $host < $cap ) ? $host : $cap;
    }

    /**
     * The recording cap for the configured platform, before the host clamp.
     *
     * Gemini carries the media inline as base64 inside the JSON request, which
     * inflates it by roughly a third, so its practical ceiling is lower than
     * OpenAI's, where the file is a real multipart part.
     *
     * @since 4.9.4
     *
     * @return int
     */
    public static function media_cap_for_platform() {
        $factory  = new ProviderFactory( betterdocs()->settings );
        $platform = $factory->active_platform();

        return ( 'gemini' === $platform ) ? self::MAX_MEDIA_BYTES_INLINE : self::MAX_MEDIA_BYTES;
    }

    /**
     * Extract plain text from a supported uploaded file. TXT/MD are read as-is;
     * DOCX is unzipped natively (ZipArchive) and its document body flattened;
     * PDF text is pulled natively from FlateDecode content streams — all without
     * a third-party parser dependency. Images/scanned PDFs (no embedded text) are
     * not handled here (that would need OCR / a multimodal model).
     *
     * @param string $path Local tmp upload path (already is_uploaded_file-verified).
     * @param string $ext  Allow-listed extension.
     * @return string|\WP_Error
     */
    protected function extract_attachment_text( $path, $ext ) {
        if ( in_array( $ext, array( 'txt', 'md', 'markdown' ), true ) ) {
            $raw = file_get_contents( $path ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- local tmp upload.
            return false === $raw ? new \WP_Error( 'ai_read_failed', __( 'Could not read the file.', 'betterdocs' ) ) : $raw;
        }

        if ( 'docx' === $ext ) {
            if ( ! class_exists( '\ZipArchive' ) ) {
                return new \WP_Error( 'ai_no_zip', __( 'Reading .docx files needs the PHP Zip extension, which is not available on this server. Upload a .txt or .md instead.', 'betterdocs' ) );
            }
            $zip = new \ZipArchive();
            if ( true !== $zip->open( $path ) ) {
                return new \WP_Error( 'ai_bad_docx', __( 'Could not open that .docx file — it may be corrupt.', 'betterdocs' ) );
            }
            $xml = $zip->getFromName( 'word/document.xml' );
            $zip->close();

            if ( false === $xml || '' === $xml ) {
                return new \WP_Error( 'ai_bad_docx', __( 'That .docx file has no readable document body.', 'betterdocs' ) );
            }

            // Turn Word paragraph/break/tab elements into whitespace, then strip
            // every remaining tag so only the run text (<w:t>) survives, and decode
            // XML entities. Keeps paragraph structure the model can read.
            $xml  = preg_replace( '#</w:p>#', "\n\n", $xml );
            $xml  = preg_replace( '#<w:br\b[^>]*/?>#', "\n", $xml );
            $xml  = preg_replace( '#<w:tab\b[^>]*/?>#', "\t", $xml );
            $text = wp_strip_all_tags( (string) $xml );
            $text = html_entity_decode( $text, ENT_QUOTES | ENT_XML1, 'UTF-8' );

            return trim( preg_replace( "/\n{3,}/", "\n\n", $text ) );
        }

        if ( 'pdf' === $ext ) {
            return $this->extract_pdf_text( $path );
        }

        return new \WP_Error( 'ai_bad_filetype', __( 'Unsupported file type.', 'betterdocs' ) );
    }

    /**
     * Extract text from a PDF natively — no library. PDFs keep their page text in
     * "content streams" (usually zlib/FlateDecode-compressed); we inflate each one
     * and pull the operands of the text-showing operators (Tj / TJ / ' / "). This
     * covers the common case (real, text-based documents). It intentionally does
     * NOT handle:
     *   - encrypted PDFs (no key) — reported so the user knows why,
     *   - scanned/image-only PDFs (there is no embedded text to read) — reported,
     *   - exotic font encodings (CID/Type0 with custom CMaps) — those decode to
     *     garbled text, so we drop a stream whose result looks non-textual.
     * The extracted text is prompt-bound source only; it is never rendered, and
     * the model output still passes wp_kses_post downstream.
     *
     * @param string $path Local tmp upload path.
     * @return string|\WP_Error
     */
    protected function extract_pdf_text( $path ) {
        $data = file_get_contents( $path ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- local tmp upload.
        if ( false === $data || 0 !== strncmp( $data, '%PDF', 4 ) ) {
            return new \WP_Error( 'ai_bad_pdf', __( 'That does not look like a valid PDF file.', 'betterdocs' ) );
        }

        // An encrypted PDF's streams won't inflate to readable text without the
        // key. Detect the Encrypt entry up front and say so, rather than return
        // empty. (An /Encrypt inside a literal string is a rare false positive we
        // accept — worst case the user gets the "no text" message below instead.)
        if ( preg_match( '/\/Encrypt\b/', $data ) ) {
            return new \WP_Error( 'ai_pdf_encrypted', __( 'This PDF is password-protected or encrypted, so its text can\'t be read. Remove the protection, or paste the text instead.', 'betterdocs' ) );
        }

        $out = '';
        $cap = self::MAX_SOURCE_LENGTH + 4000; // stop early; the source is clipped later anyway.

        if ( preg_match_all( '/stream\r?\n(.*?)\r?\nendstream/s', $data, $streams ) ) {
            foreach ( $streams[1] as $chunk ) {
                // Try zlib (FlateDecode) first, then raw-deflate, then treat as
                // already-plain. @-silenced: a binary (image/font) stream simply
                // fails to inflate and is skipped below.
                $decoded = @gzuncompress( $chunk );
                if ( false === $decoded ) {
                    $decoded = @gzinflate( $chunk );
                }
                $content = ( is_string( $decoded ) && '' !== $decoded ) ? $decoded : $chunk;

                // Only content streams carry text-showing operators; skip the rest
                // (images, fonts) so we don't scrape binary noise.
                if ( false === strpos( $content, 'Tj' ) && false === strpos( $content, 'TJ' ) ) {
                    continue;
                }

                $piece = $this->pdf_stream_text( $content );
                // Guard against garbled CID/font-encoded streams: if the decoded
                // "text" is mostly non-printable, drop it rather than inject noise.
                if ( '' !== $piece && $this->mostly_printable( $piece ) ) {
                    $out .= $piece . "\n";
                    if ( strlen( $out ) > $cap ) {
                        break;
                    }
                }
            }
        }

        $out = preg_replace( "/[ \t]+/", ' ', $out );
        $out = trim( preg_replace( "/\n{3,}/", "\n\n", $out ) );

        // Subsetted LaTeX/CID fonts emit control bytes (ligatures) and non-UTF-8
        // sequences among the readable text. Strip them and coerce to valid UTF-8 —
        // otherwise the caller's wp_check_invalid_utf8() discards the ENTIRE string
        // on the first bad byte and an 8-page paper looks empty ("no readable text").
        $out = $this->to_clean_utf8( $out );

        if ( '' === $out ) {
            return new \WP_Error(
                'ai_pdf_no_text',
                __( 'No selectable text was found in that PDF — it may be a scanned image. Try a text-based PDF, or paste the content into the prompt.', 'betterdocs' )
            );
        }

        return $out;
    }

    /**
     * Pull the visible text out of one decoded PDF content stream. Positioning
     * operators (Td/TD/T*) become newlines; the literal `( … )` and hex `< … >`
     * operands of Tj/TJ/'/'' become the text. Kerning numbers inside TJ arrays are
     * ignored (their effect on spacing is cosmetic for our purposes).
     */
    protected function pdf_stream_text( $content ) {
        // Text-positioning operators (new line / new paragraph) become newlines so
        // words on different lines don't run together.
        $content = preg_replace( '/\b(?:T\*|Td|TD)\b/', " \n ", $content );

        // Walk TJ arrays and Tj/'/'" strings in document order. Inside a TJ array
        // pdfTeX (LaTeX) renders an inter-word space as a large negative kerning
        // number, not a literal space in the string — so we synthesise a space when
        // the kerning passes a threshold, otherwise every word runs together
        // ("FormallyVerifiedand…"). Small kerning (letter pairs) is ignored.
        if ( ! preg_match_all(
            '/\[((?:\\\\.|[^\]\\\\])*)\]\s*TJ|(\((?:\\\\.|[^\\\\()])*\)|<[0-9A-Fa-f\s]+>)\s*(?:Tj|\'|")|(\n)/s',
            $content,
            $matches,
            PREG_SET_ORDER
        ) ) {
            return '';
        }

        $text = '';
        foreach ( $matches as $tok ) {
            if ( isset( $tok[3] ) && "\n" === $tok[3] ) {
                $text .= "\n";
                continue;
            }
            if ( isset( $tok[1] ) && '' !== $tok[1] ) {
                // TJ array: alternating string operands and kerning numbers.
                preg_match_all( '/\((?:\\\\.|[^\\\\()])*\)|<[0-9A-Fa-f\s]+>|-?\d+(?:\.\d+)?/s', $tok[1], $parts );
                foreach ( $parts[0] as $part ) {
                    if ( '(' === $part[0] || '<' === $part[0] ) {
                        $text .= $this->pdf_token_text( $part );
                    } elseif ( (float) $part < -100 ) {
                        $text .= ' ';
                    }
                }
                $text .= ' ';
            } elseif ( isset( $tok[2] ) && '' !== $tok[2] ) {
                $text .= $this->pdf_token_text( $tok[2] ) . ' ';
            }
        }

        return preg_replace( '/[^\S\n]+/', ' ', $text );
    }

    /**
     * Decode one PDF string operand — a literal `( … )` (with escapes) or a hex
     * `< … >` string — into its raw bytes.
     */
    protected function pdf_token_text( $token ) {
        if ( '(' === $token[0] ) {
            return $this->pdf_unescape( substr( $token, 1, -1 ) );
        }
        $hex = preg_replace( '/[^0-9A-Fa-f]/', '', $token );
        return ( '' === $hex ) ? '' : (string) @hex2bin( strlen( $hex ) % 2 ? substr( $hex, 0, -1 ) : $hex );
    }

    /**
     * Resolve PDF string escapes: \( \) \\ \n \r \t \b \f and \ddd octal codes.
     */
    protected function pdf_unescape( $string ) {
        return preg_replace_callback(
            '/\\\\(?:([nrtbf()\\\\])|([0-7]{1,3}))/',
            function ( $mm ) {
                if ( isset( $mm[1] ) && '' !== $mm[1] ) {
                    $map = array( 'n' => "\n", 'r' => "\r", 't' => "\t", 'b' => "\x08", 'f' => "\x0C", '(' => '(', ')' => ')', '\\' => '\\' );
                    return isset( $map[ $mm[1] ] ) ? $map[ $mm[1] ] : $mm[1];
                }
                return chr( octdec( $mm[2] ) & 0xFF );
            },
            $string
        );
    }

    /**
     * Is this decoded string mostly readable text? Used to drop font/CID streams
     * that decode to binary-looking garbage. Counts printable + common whitespace.
     */
    protected function mostly_printable( $string ) {
        $len = strlen( $string );
        if ( 0 === $len ) {
            return false;
        }
        $printable = preg_match_all( '/[\P{Cc}\t\n\r]/u', $string );
        // Fallback for non-UTF-8 payloads where \p{} may not match cleanly.
        if ( false === $printable ) {
            $printable = strlen( preg_replace( '/[^\x09\x0A\x0D\x20-\x7E]/', '', $string ) );
        }
        return ( $printable / $len ) >= 0.7;
    }

    protected function clip( $value, $max ) {
        if ( strlen( $value ) <= $max ) {
            return $value;
        }

        // Byte-limited but never mid-character: a split multi-byte sequence is
        // invalid UTF-8, which wp_json_encode() refuses — the whole request
        // body would go out empty.
        if ( function_exists( 'mb_strcut' ) ) {
            return mb_strcut( $value, 0, $max, 'UTF-8' );
        }

        return wp_check_invalid_utf8( substr( $value, 0, $max ), true );
    }

    /**
     * Coerce extracted PDF bytes to clean, valid UTF-8: drop C0/C1 control bytes
     * (except tab/newline) and any byte sequence that isn't valid UTF-8. This keeps
     * the readable text intact for the downstream wp_check_invalid_utf8(), which
     * would otherwise discard the whole string on a single invalid byte.
     */
    protected function to_clean_utf8( $string ) {
        $string = preg_replace( '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', (string) $string );
        if ( '' !== $string && ! preg_match( '//u', $string ) ) {
            $converted = @iconv( 'UTF-8', 'UTF-8//IGNORE', $string );
            $string    = ( false !== $converted ) ? $converted : preg_replace( '/[^\x09\x0A\x20-\x7E]/', '', $string );
        }
        return (string) $string;
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
