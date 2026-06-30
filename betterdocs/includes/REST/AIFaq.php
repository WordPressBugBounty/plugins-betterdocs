<?php

namespace WPDeveloper\BetterDocs\REST;

use WP_REST_Request;
use WPDeveloper\BetterDocs\Core\BaseAPI;
use WPDeveloper\BetterDocs\Utils\AIUsage;

/**
 * Server-side proxy for the "Write FAQ with BetterDocs AI" feature.
 *
 * The FAQ builder used to call OpenAI directly from the browser with the secret API key —
 * this endpoint moves that call server-side so the key never leaves the site. Uses the
 * same dynamic model/token settings as Write with AI (write_with_ai_model).
 */
class AIFaq extends BaseAPI {

    const MAX_QUESTION_LENGTH = 500;
    const MAX_KEYWORDS_LENGTH = 300;

    public function register() {
        $this->post(
            '/ai-faq',
            array( $this, 'generate' ),
            array(
                'question' => array(
                    'type'     => 'string',
                    'required' => true
                ),
                'keywords' => array(
                    'type'     => 'string',
                    'required' => false,
                    'default'  => ''
                )
            )
        );
    }

    public function permission_check() {
        return current_user_can( 'edit_others_posts' );
    }

    public function generate( WP_REST_Request $request ) {
        $settings = betterdocs()->settings;

        if ( ! $settings->get( 'enable_faq_write_with_ai', true ) ) {
            return $this->error(
                'ai_disabled',
                __( 'Write FAQ with AI is disabled. Enable it from BetterDocs settings.', 'betterdocs' ),
                400
            );
        }

        $write_ai = betterdocs()->ai_autowrtie;
        if ( empty( $write_ai ) || empty( $write_ai->get_api_key() ) ) {
            return $this->error(
                'ai_no_key',
                __( 'OpenAI API key is missing. Add one in BetterDocs settings.', 'betterdocs' ),
                400
            );
        }

        $question = trim( wp_strip_all_tags( (string) $request->get_param( 'question' ) ) );
        $keywords = trim( wp_strip_all_tags( (string) $request->get_param( 'keywords' ) ) );

        if ( $question === '' ) {
            return $this->error(
                'ai_empty_question',
                __( 'Please provide a question for the AI.', 'betterdocs' ),
                400
            );
        }

        if ( strlen( $question ) > self::MAX_QUESTION_LENGTH ) {
            $question = substr( $question, 0, self::MAX_QUESTION_LENGTH );
        }
        if ( strlen( $keywords ) > self::MAX_KEYWORDS_LENGTH ) {
            $keywords = substr( $keywords, 0, self::MAX_KEYWORDS_LENGTH );
        }

        $prompt = sprintf(
            'Generate an FAQ answer for the question related to %s. The question: %s',
            $keywords,
            $question
        );
        $system = __( 'You are a helpful assistant that writes clear, concise FAQ answers.', 'betterdocs' );

        $result = $write_ai->generate_text( $prompt, $system );

        if ( empty( $result['success'] ) ) {
            $message = isset( $result['error'] ) ? (string) $result['error'] : __( 'Unknown AI error.', 'betterdocs' );
            return $this->error( 'ai_upstream', $message, 502 );
        }

        $answer = $this->clean_response( (string) $result['content'] );

        if ( $answer === '' ) {
            return $this->error(
                'ai_empty_response',
                __( 'The AI returned no answer. Try again or rephrase your question.', 'betterdocs' ),
                502
            );
        }

        // FAQ answers are generated before the FAQ post exists — no reliable post id.
        AIUsage::record( 'faq_write_with_ai' );

        return $this->success(
            array(
                'answer' => $answer,
                'model'  => isset( $result['model'] ) ? $result['model'] : null
            )
        );
    }

    /**
     * Strip the leading "Answer:" label / stray leading "?" the browser-side code removed.
     */
    protected function clean_response( $text ) {
        $text = trim( $text );
        $text = preg_replace( '/^\s*answer\s*:\s*/i', '', $text );
        $text = preg_replace( '/^\s*\?/', '', $text );

        return trim( $text );
    }
}
