<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Utils\AIUsage;

class AIEdit extends BaseAPI {

    const MAX_SELECTION_LENGTH   = 12000;
    const MAX_INSTRUCTION_LENGTH = 1000;

    public function register() {
        $this->post(
            '/ai-edit',
            array( $this, 'generate' ),
            array(
                'post_id' => array(
                    'type' => 'integer',
                    'required' => true
                ),
                'action' => array(
                    'type' => 'string',
                    'required' => true
                ),
                'selection' => array(
                    'type' => 'string',
                    'required' => false,
                    'default' => ''
                ),
                'selection_type' => array(
                    'type' => 'string',
                    'required' => false,
                    'default' => 'block'
                ),
                'instruction' => array(
                    'type' => 'string',
                    'required' => false,
                    'default' => ''
                ),
                'option' => array(
                    'type' => 'string',
                    'required' => false,
                    'default' => ''
                )
            )
        );
    }

    public function permission_check() {
        $post_id = isset( $_REQUEST[ 'post_id' ] ) ? intval( $_REQUEST[ 'post_id' ] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- REST permission_check; read-only id, request auth handled by the route's permission_callback.

        if ( $post_id <= 0 ) {
            return current_user_can( 'edit_posts' );
        }

        return current_user_can( 'edit_post', $post_id );
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

        $api_key = $write_ai->get_api_key();
        if ( empty( $api_key ) ) {
            return $this->error(
                'ai_no_key',
                __( 'OpenAI API key is missing. Add one in BetterDocs settings.', 'betterdocs' ),
                400
            );
        }

        $action         = sanitize_key( (string) $request->get_param( 'action' ) );
        $selection_type = sanitize_key( (string) $request->get_param( 'selection_type' ) );
        $selection      = (string) $request->get_param( 'selection' );
        $instruction    = (string) $request->get_param( 'instruction' );
        $option         = sanitize_text_field( (string) $request->get_param( 'option' ) );

        if ( strlen( $selection ) > self::MAX_SELECTION_LENGTH ) {
            $selection = substr( $selection, 0, self::MAX_SELECTION_LENGTH );
        }
        if ( strlen( $instruction ) > self::MAX_INSTRUCTION_LENGTH ) {
            $instruction = substr( $instruction, 0, self::MAX_INSTRUCTION_LENGTH );
        }

        $instruction = wp_kses_post( $instruction );
        $selection   = wp_kses_post( $selection );

        if ( 'inline' !== $selection_type ) {
            $selection_type = 'block';
        }

        $presets = self::get_presets();

        if ( 'custom' !== $action && ! isset( $presets[ $action ] ) ) {
            return $this->error(
                'ai_bad_action',
                __( 'Unknown AI action.', 'betterdocs' ),
                400
            );
        }

        if ( trim( wp_strip_all_tags( $instruction ) ) === '' ) {
            return $this->error(
                'ai_empty_instruction',
                __( 'Please provide a prompt for the AI.', 'betterdocs' ),
                400
            );
        }

        if ( trim( wp_strip_all_tags( $selection ) ) === '' && 'continue' !== $action ) {
            return $this->error(
                'ai_empty_selection',
                __( 'No content selected for the AI to work on.', 'betterdocs' ),
                400
            );
        }

        $prompt = $this->build_prompt( $action, $presets, $selection, $selection_type, $instruction, $option );

        $result = $write_ai->generate_openai_response_ai_edit( $prompt );

        if ( empty( $result[ 'success' ] ) ) {
            $message = isset( $result[ 'error' ] ) ? (string) $result[ 'error' ] : __( 'Unknown AI error.', 'betterdocs' );
            return $this->error( 'ai_upstream', $message, 502 );
        }

        $content = $this->clean_output( (string) $result[ 'content' ] );

        if ( '' === $content ) {
            return $this->error(
                'ai_empty_response',
                __( 'The AI returned no content. Try again or rephrase your instruction.', 'betterdocs' ),
                502
            );
        }

        AIUsage::record( 'ai_edit', (int) $request->get_param( 'post_id' ), $action );

        return $this->success(
            array(
                'content' => $content,
                'action' => $action,
                'usage' => array(
                    'prompt_tokens' => isset( $result[ 'prompt_tokens' ] ) ? $result[ 'prompt_tokens' ] : null,
                    'completion_tokens' => isset( $result[ 'completion_tokens' ] ) ? $result[ 'completion_tokens' ] : null,
                    'total_tokens' => isset( $result[ 'total_tokens' ] ) ? $result[ 'total_tokens' ] : null
                ),
                'model' => isset( $result[ 'model' ] ) ? $result[ 'model' ] : null
            )
        );
    }

    protected function build_prompt( $action, $presets, $selection, $selection_type, $instruction, $option ) {
        $core = trim( $instruction );

        $preset      = 'custom' !== $action && isset( $presets[ $action ] ) ? $presets[ $action ] : null;
        $format_hint = isset( $preset[ 'format' ] ) && $preset[ 'format' ]
        ? $preset[ 'format' ]
        : ( 'inline' === $selection_type ? __( 'Return only plain text (no block markup, no quotes, no explanations).', 'betterdocs' )
            : __( 'Return only valid Gutenberg-compatible HTML using standard tags such as <p>, <h2>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <code>. Do not include explanations, preambles, code fences, or markdown.', 'betterdocs' ) );

        $prompt = $core . "\n\n";
        $prompt .= __( 'Formatting requirements:', 'betterdocs' ) . ' ' . $format_hint . "\n\n";
        $prompt .= __( 'Content to work on:', 'betterdocs' ) . "\n";
        $prompt .= "---\n" . $selection . "\n---";

        return $prompt;
    }

    protected function clean_output( $content ) {
        $content = trim( $content );

        $content = preg_replace( '/^```(?:html|HTML)?\s*\n?/', '', $content );
        $content = preg_replace( '/\n?```\s*$/', '', $content );

        return trim( $content );
    }

    public static function get_presets() {
        return array(
            'improve' => array(
                'prompt' => 'Improve the writing quality, clarity, grammar, and structure of the content below while preserving its original meaning and intent.'
            ),
            'rewrite' => array(
                'prompt' => 'Rewrite the content below with different wording while keeping the same meaning, tone, and level of detail.'
            ),
            'shorten' => array(
                'prompt' => 'Make the content below more concise. Preserve all essential information; remove redundancy and filler.'
            ),
            'expand' => array(
                'prompt' => 'Expand the content below with more detail, examples, and clear explanations. Keep the original voice.'
            ),
            'simplify' => array(
                'prompt' => 'Rewrite the content below in simpler language so it is easy to understand for a non-technical reader.'
            ),
            'fix_grammar' => array(
                'prompt' => 'Fix only the grammar, spelling, and punctuation in the content below. Do not rewrite or change the meaning or style.'
            ),
            'change_tone' => array(
                'prompt' => 'Rewrite the content below in a {option} tone while preserving its meaning.',
                'needs_option' => true
            ),
            'translate' => array(
                'prompt' => 'Translate the content below into {option}. Preserve meaning, tone, and any HTML structure.',
                'needs_option' => true
            ),
            'summarize' => array(
                'prompt' => 'Summarize the content below into 2 to 3 clear sentences.'
            ),
            'continue' => array(
                'prompt' => 'Continue writing naturally from where the content below ends. Match its tone, style, and level of detail.'
            ),
            'create_table' => array(
                'prompt' => 'Extract the statistics, figures, or comparable data from the content below and represent them as a single HTML table. Infer clear column headers. Include every distinct data point. If no tabular data can be reasonably inferred, return the best possible structured representation.',
                'format' => 'Return only one complete <table> element with <thead> and <tbody>. Use <th scope="col"> for header cells. Do not include <style>, <script>, inline CSS classes, comments, explanations, preambles, code fences, or markdown.'
            )
        );
    }
}
