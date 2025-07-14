<?php

namespace WPDeveloper\BetterDocs\Core;

use WPDeveloper\BetterDocs\Utils\Base;
use WPDeveloper\BetterDocs\Core\Settings;
use WPDeveloper\BetterDocs\Utils\AIHelper;

class ArticleSummary extends Base {

	public $settings;
	public $ai_helper;

	public function __construct( Settings $settings ) {
		$this->settings = $settings;
		$this->ai_helper = new AIHelper( $settings );

		// Register AJAX handlers
		add_action( 'wp_ajax_betterdocs_generate_article_summary', [ $this, 'generate_article_summary_callback' ] );
		add_action( 'wp_ajax_nopriv_betterdocs_generate_article_summary', [ $this, 'generate_article_summary_callback' ] );

		// Clear summary when post is updated
		add_action( 'post_updated', [ $this, 'clear_article_summary_on_update' ], 10, 3 );
	}

	/**
	 * Check if article summary feature is enabled
	 *
	 * @return bool
	 */
	public function is_enabled() {
		return $this->settings->get( 'enable_article_summary', false );
	}

	/**
	 * Get OpenAI API key from settings
	 *
	 * @return string
	 */
	public function get_api_key() {
		return $this->ai_helper->get_api_key();
	}

	/**
	 * AJAX callback for generating article summary
	 */
	public function generate_article_summary_callback() {
		// Check if Article Summary feature is enabled
		if ( ! $this->is_enabled() ) {
			wp_send_json_error( 'AI Doc Summarizer feature is not enabled.' );
			wp_die();
		}

		// Verify the nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'betterdocs_article_summary_nonce' ) ) { //phpcs:ignore
			wp_send_json_error( 'Invalid nonce' );
			wp_die();
		}

		$post_id      = intval( $_POST['post_id'] ); //phpcs:ignore
		$post_title   = sanitize_text_field( $_POST['post_title'] ); //phpcs:ignore
		$post_content = wp_kses_post( $_POST['post_content'] ); //phpcs:ignore

		// Validate that this is a docs post type
		if ( $post_id > 0 ) {
			$post_type = get_post_type( $post_id );
			if ( $post_type !== 'docs' ) {
				wp_send_json_error( 'Doc Summarizer is only available for documentation posts.' );
				wp_die();
			}

			// Check if post is password protected and user hasn't provided correct password
			if ( post_password_required( $post_id ) ) {
				wp_send_json_error( 'This document is password protected. Please enter the correct password to access the summary.' );
				wp_die();
			}
		}

		if ( empty( $post_content ) ) {
			wp_send_json_error( 'No content provided for summary generation.' );
			wp_die();
		}

		// Check if summary already exists in post meta
		if ( $post_id > 0 ) {
			$existing_summary = get_post_meta( $post_id, '_betterdocs_article_summary', true );
			$content_hash     = md5( $post_content );
			$stored_hash      = get_post_meta( $post_id, '_betterdocs_article_summary_hash', true );

			// Return existing summary if content hasn't changed
			if ( ! empty( $existing_summary ) && $content_hash === $stored_hash ) {
				// Clean existing summary in case it has old formatting
				$cleaned_existing = $this->clean_summary_content( $existing_summary );
				wp_send_json_success( $cleaned_existing );
				wp_die();
			}
		}

		// Generate new summary using OpenAI
		$summary = $this->generate_summary( $post_title, $post_content );

		if ( is_wp_error( $summary ) ) {
			wp_send_json_error( $summary->get_error_message() );
			wp_die();
		}

		// Clean up the summary content
		$cleaned_summary = $this->clean_summary_content( $summary );

		// Store summary in post meta if post ID is provided
		if ( $post_id > 0 && ! empty( $cleaned_summary ) ) {
			update_post_meta( $post_id, '_betterdocs_article_summary', $cleaned_summary );
			update_post_meta( $post_id, '_betterdocs_article_summary_hash', md5( $post_content ) );
		}

		wp_send_json_success( $cleaned_summary );
		wp_die();
	}

	/**
	 * Generate article summary using OpenAI
	 *
	 * @param string $title Article title
	 * @param string $content Article content
	 * @return string|\WP_Error Generated summary or error
	 */
	public function generate_summary( $title, $content ) {
		// Check if Article Summary feature is enabled
		if ( ! $this->is_enabled() ) {
			return new \WP_Error( 'feature_disabled', 'AI Doc Summarizer feature is not enabled.' );
		}

		try {
			if ( ! $this->ai_helper->has_api_key() ) {
				return new \WP_Error( 'no_api_key', 'OpenAI API key is not configured. Please add your API key in BetterDocs settings.' );
			}

			// Prepare content for AI processing
			$prepared_content = $this->ai_helper->prepare_content_for_ai( $content, 4000 );

			// Create messages for summary generation
			$messages = $this->ai_helper->create_summary_messages( $title, $prepared_content );

			// Set options for summary generation
			$options = [
				'max_tokens'  => 500,
				'temperature' => 0.3,
				'timeout'     => 30
			];

			$response = $this->ai_helper->make_openai_request( $messages, $options );

			return $response;

		} catch ( \Exception $error ) {
			return new \WP_Error( 'exception', 'Error generating summary: ' . $error->getMessage() );
		}
	}



	/**
	 * Clear article summary when post is updated
	 *
	 * @param int $post_id Post ID
	 * @param \WP_Post $post_after Post object after update
	 * @param \WP_Post $post_before Post object before update
	 */
	public function clear_article_summary_on_update( $post_id, $post_after, $post_before ) {
		// Only clear summary for docs post type
		if ( get_post_type( $post_id ) !== 'docs' ) {
			return;
		}

		// Only clear if content has actually changed
		if ( $post_after->post_content !== $post_before->post_content ) {
			delete_post_meta( $post_id, '_betterdocs_article_summary' );
			delete_post_meta( $post_id, '_betterdocs_article_summary_hash' );
		}
	}

	/**
	 * Get cached summary for a post
	 *
	 * @param int $post_id Post ID
	 * @return string|false Cached summary or false if not found
	 */
	public function get_cached_summary( $post_id ) {
		return get_post_meta( $post_id, '_betterdocs_article_summary', true );
	}

	/**
	 * Check if summary exists for a post
	 *
	 * @param int $post_id Post ID
	 * @return bool True if summary exists
	 */
	public function has_cached_summary( $post_id ) {
		$summary = $this->get_cached_summary( $post_id );
		return ! empty( $summary );
	}

	/**
	 * Manually clear summary cache for a post
	 *
	 * @param int $post_id Post ID
	 * @return bool True on success
	 */
	public function clear_summary_cache( $post_id ) {
		$deleted_summary = delete_post_meta( $post_id, '_betterdocs_article_summary' );
		$deleted_hash = delete_post_meta( $post_id, '_betterdocs_article_summary_hash' );

		return $deleted_summary || $deleted_hash;
	}

	/**
	 * Clean summary content by removing markdown code blocks and unwanted formatting
	 *
	 * @param string $content Raw summary content from OpenAI
	 * @return string Cleaned summary content
	 */
	public function clean_summary_content( $content ) {
		if ( empty( $content ) ) {
			return $content;
		}

		// Remove markdown code blocks (```html, ```, etc.)
		$content = preg_replace( '/^```[a-zA-Z]*\s*/m', '', $content );
		$content = preg_replace( '/\s*```\s*$/m', '', $content );

		// Remove any remaining triple backticks
		$content = str_replace( '```', '', $content );

		// Clean up extra whitespace
		$content = trim( $content );

		// Remove any leading/trailing newlines
		$content = preg_replace( '/^\s*\n+/', '', $content );
		$content = preg_replace( '/\n+\s*$/', '', $content );

		return $content;
	}
}
