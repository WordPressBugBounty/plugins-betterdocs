<?php
namespace WPDeveloper\BetterDocs\Shortcodes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}


use WPDeveloper\BetterDocs\Core\Query;
use WPDeveloper\BetterDocs\Utils\Helper;
use WPDeveloper\BetterDocs\Core\Settings;
use WPDeveloper\BetterDocs\Core\Shortcode;
use WPDeveloper\BetterDocs\Admin\Customizer\Defaults;

class FeedbackForm extends Shortcode {
    /**
     * Seconds a person needs at least to fill in the form; faster is a bot.
     */
    const MIN_FILL_SECONDS = 3;

    /**
     * Messages one IP may send per window, and the window in seconds.
     */
    const RATE_LIMIT  = 3;
    const RATE_WINDOW = 600;

    protected $html_attributes = [];

    public function __construct( Settings $settings, Query $query, Helper $helper, Defaults $defaults ) {
        parent::__construct( $settings, $query, $helper, $defaults );

        add_action( 'wp_ajax_nopriv_betterdocs_feedback_form_submit', [$this, 'submit'] );
        add_action( 'wp_ajax_betterdocs_feedback_form_submit', [$this, 'submit'] );
    }

    public function get_style_depends() {
        return ['betterdocs-feedback-form'];
    }

    public function get_script_depends() {
        return ['betterdocs'];
    }

    public function submit() {
        if ( ! betterdocs()->settings->get( 'email_feedback' ) ) {
            wp_send_json_error( __( 'Email feedback is disabled.', 'betterdocs' ) );
        }

        check_ajax_referer( 'betterdocs_submit_data', 'security' );

        $postID       = isset( $_POST['postID'] ) ? absint( wp_unslash( $_POST['postID'] ) ) : 0;
        $article      = get_the_title( $postID );
        $name         = isset( $_POST['message_name'] ) ? sanitize_text_field( wp_unslash( $_POST['message_name'] ) ) : '';
        $email        = isset( $_POST['message_email'] ) ? sanitize_email( wp_unslash( $_POST['message_email'] ) ) : '';
        $message_text = isset( $_POST['message_text'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message_text'] ) ) : '';

        $_errors = [];

        //validate presence of name
        if ( empty( $name ) ) {
            $_errors['name'] = __( 'Please enter your name.', 'betterdocs' );
        }

        //validate email
        if ( empty( $email ) || ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
            $_errors['email'] = __( 'Enter a valid email address.', 'betterdocs' );
        }

        //validate presence of message
        if ( empty( $message_text ) ) {
            $_errors['message'] = __( 'Please write your message.', 'betterdocs' );
        }

        if ( ! empty( $_errors ) ) {
            $_errors = [
                'success' => false,
                'message' => $_errors
            ];

            wp_send_json_error( $_errors );
        }

        $submission = [
            'post_id' => $postID,
            'name'    => $name,
            'email'   => $email,
            'message' => $message_text
        ];

        // Bots fill the hidden field, or post faster than anyone can type.
        if ( '' !== $this->form_field( 'message_website' ) ) {
            $this->drop_spam( 'honeypot', $submission );
        }

        if ( $this->sent_too_fast( $this->form_field( 'form_token' ) ) ) {
            $this->drop_spam( 'too_fast', $submission );
        }

        // Counted before the spam checks below, so blocked spam uses up the IP's
        // allowance too. Shown under the message box, which keeps what they wrote.
        if ( ! $this->within_rate_limit() ) {
            wp_send_json_error(
                [
                    'success' => false,
                    'message' => [
                        'message' => __( 'You have sent several messages already. Please try again in a few minutes.', 'betterdocs' )
                    ]
                ]
            );
        }

        if ( $this->akismet_says_spam( $submission ) ) {
            $this->drop_spam( 'akismet', $submission );
        }

        /**
         * Filter whether a feedback form submission is spam.
         *
         * Return true to drop it. The visitor still sees the normal "sent"
         * message, so a bot can't tell it was blocked.
         *
         * @since 4.9.6
         *
         * @param bool  $is_spam    Whether the submission is spam. Default false.
         * @param array $submission post_id, name, email and message.
         */
        if ( apply_filters( 'betterdocs_feedback_form_is_spam', false, $submission ) ) {
            $this->drop_spam( 'filter', $submission );
        }

        //php mailer variables
        $to      = $this->settings->get( 'email_address', get_option( 'admin_email' ) );
        $subject = wp_sprintf( '%s %s', __( 'Feedback message from', 'betterdocs' ), get_bloginfo( 'name' ) );

        // Not From: the visitor. Mail from their domain fails SPF/DMARC on the
        // site's server; WordPress (or the SMTP plugin) sets From, and replies
        // still reach the visitor through Reply-To.
        $reply_name = trim( str_replace( ['"', ',', ';', ':', '<', '>', '\\'], '', $name ) );
        $headers    = [
            'Content-Type: text/html; charset=UTF-8',
            "Reply-To: $reply_name <{$email}>"
        ];

        $_response = [
            'success' => true
        ];

        ob_start();
        betterdocs()->views->get(
            'admin/email/feedback-email',
            [
                'name'         => $name,
                'email'        => $email,
                'article'      => $article,
                'message_text' => $message_text
            ]
        );
        $message = ob_get_clean();

        // @todo: check strip tags: wp_mail( $to, $subject, strip_tags( $message ), $headers )

        if ( wp_mail( $to, $subject, $message, $headers ) ) {
            $_response['message'] = __( 'Thanks! Your message has been sent.', 'betterdocs' );
        } else {
            $_response['success'] = false;
            $_response['message'] = __( 'Message was not sent. Try Again.', 'betterdocs' );
        }

        wp_send_json_success( $_response );
    }

    /**
     * A field the form sent along in its serialized `form` list (the script
     * posts the whole form there), or as its own POST key.
     *
     * @param string $name Field name.
     * @return string
     */
    private function form_field( $name ) {
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- read inside submit(), after check_ajax_referer().
        if ( isset( $_POST[ $name ] ) && is_scalar( $_POST[ $name ] ) ) {
            return sanitize_text_field( wp_unslash( $_POST[ $name ] ) );
        }

        if ( isset( $_POST['form'] ) && is_array( $_POST['form'] ) ) {
            foreach ( wp_unslash( $_POST['form'] ) as $field ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- the matching value is sanitized below.
                if ( is_array( $field ) && isset( $field['name'], $field['value'] ) && $name === $field['name'] && is_scalar( $field['value'] ) ) {
                    return sanitize_text_field( $field['value'] );
                }
            }
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing

        return '';
    }

    /**
     * A signed timestamp for the form, so the server can tell how long it
     * took to fill in.
     *
     * @return string
     */
    private function form_token() {
        $time = (string) time();

        return $time . '.' . $this->sign_token( $time );
    }

    private function sign_token( $time ) {
        return substr( hash_hmac( 'sha256', 'betterdocs_feedback_form|' . $time, wp_salt( 'nonce' ) ), 0, 20 );
    }

    /**
     * Whether the form came back sooner than a person could fill it in.
     *
     * A missing or unverifiable token passes: a page cache can serve a form
     * rendered before this check existed, or before the salts changed.
     *
     * @param string $token The form's `form_token` value.
     * @return bool
     */
    private function sent_too_fast( $token ) {
        $parts = explode( '.', (string) $token );
        if ( 2 !== count( $parts ) || ! ctype_digit( $parts[0] ) || ! hash_equals( $this->sign_token( $parts[0] ), $parts[1] ) ) {
            return false;
        }

        $elapsed = time() - (int) $parts[0];

        return $elapsed >= 0 && $elapsed < self::MIN_FILL_SECONDS;
    }

    /**
     * Count this message against the sender's IP and say whether it is still
     * within the limit.
     *
     * @return bool
     */
    private function within_rate_limit() {
        /**
         * Filter how many feedback messages one IP may send, and in how many seconds.
         *
         * @since 4.9.6
         *
         * @param array $limit [ max messages, window in seconds ]. Default [ 3, 600 ].
         */
        $limit  = (array) apply_filters( 'betterdocs_feedback_form_rate_limit', [ self::RATE_LIMIT, self::RATE_WINDOW ] );
        $max    = isset( $limit[0] ) ? (int) $limit[0] : self::RATE_LIMIT;
        $window = isset( $limit[1] ) ? max( 1, (int) $limit[1] ) : self::RATE_WINDOW;

        if ( $max <= 0 ) {
            return true;
        }

        $key   = 'betterdocs_feedback_rl_' . md5( $this->client_ip_bucket() );
        $state = get_transient( $key );
        $now   = time();

        if ( ! is_array( $state ) || ! isset( $state['count'], $state['start'] ) || $now - (int) $state['start'] >= $window ) {
            $state = [ 'count' => 0, 'start' => $now ];
        }

        if ( (int) $state['count'] >= $max ) {
            return false;
        }

        $state['count'] = (int) $state['count'] + 1;
        set_transient( $key, $state, max( 1, $window - ( $now - (int) $state['start'] ) ) );

        return true;
    }

    /**
     * The sender's IP as a rate-limit bucket: IPv6 by its /64, since one
     * subscriber usually holds a whole /64 and could rotate through it.
     *
     * @return string
     */
    private function client_ip_bucket() {
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- used only as an md5'd bucket key, never output or stored raw.
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) wp_unslash( $_SERVER['REMOTE_ADDR'] ) : '';

        /**
         * Filter the IP the feedback form rate limit is keyed on.
         *
         * Behind a reverse proxy REMOTE_ADDR is the proxy, so every visitor
         * shares one allowance. Return the forwarded address only when the
         * proxy is known to overwrite that header.
         *
         * @since 4.9.6
         *
         * @param string $ip REMOTE_ADDR ('' when unavailable).
         */
        $ip = (string) apply_filters( 'betterdocs_feedback_form_client_ip', $ip );

        if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 ) ) {
            $packed = inet_pton( $ip );
            if ( false !== $packed ) {
                return inet_ntop( substr( $packed, 0, 8 ) . str_repeat( "\0", 8 ) ) . '/64';
            }
        }

        return '' !== $ip ? $ip : 'unknown';
    }

    /**
     * Ask Akismet, when it is active and has a key, whether the message is spam.
     * Any error lets the message through.
     *
     * @param array $submission post_id, name, email and message.
     * @return bool
     */
    private function akismet_says_spam( $submission ) {
        if ( ! class_exists( '\Akismet' ) || ! is_callable( [ '\Akismet', 'get_api_key' ] ) || ! is_callable( [ '\Akismet', 'http_post' ] ) || ! \Akismet::get_api_key() ) {
            return false;
        }

        /**
         * Filter whether the feedback form asks Akismet about each message.
         *
         * @since 4.9.6
         *
         * @param bool $use_akismet Default true when Akismet is active with a key.
         */
        if ( ! apply_filters( 'betterdocs_feedback_form_use_akismet', true ) ) {
            return false;
        }

        // phpcs:disable WordPress.Security.ValidatedSanitizedInput -- passed to Akismet only, as it expects them.
        $request = [
            'blog'                 => home_url(),
            'blog_lang'            => get_locale(),
            'blog_charset'         => get_option( 'blog_charset' ),
            'user_ip'              => isset( $_SERVER['REMOTE_ADDR'] ) ? wp_unslash( $_SERVER['REMOTE_ADDR'] ) : '',
            'user_agent'           => isset( $_SERVER['HTTP_USER_AGENT'] ) ? wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) : '',
            'referrer'             => isset( $_SERVER['HTTP_REFERER'] ) ? wp_unslash( $_SERVER['HTTP_REFERER'] ) : '',
            'permalink'            => $submission['post_id'] ? get_permalink( $submission['post_id'] ) : '',
            'comment_type'         => 'contact-form',
            'comment_author'       => $submission['name'],
            'comment_author_email' => $submission['email'],
            'comment_content'      => $submission['message']
        ];
        // phpcs:enable WordPress.Security.ValidatedSanitizedInput

        $response = \Akismet::http_post( http_build_query( $request ), 'comment-check' );

        return is_array( $response ) && isset( $response[1] ) && 'true' === trim( (string) $response[1] );
    }

    /**
     * Drop a spam submission, answering as if it had been sent.
     *
     * @param string $reason     honeypot, too_fast, akismet or filter.
     * @param array  $submission post_id, name, email and message.
     */
    private function drop_spam( $reason, $submission ) {
        /**
         * Fires when the feedback form drops a submission as spam.
         *
         * @since 4.9.6
         *
         * @param string $reason     honeypot, too_fast, akismet or filter.
         * @param array  $submission post_id, name, email and message.
         */
        do_action( 'betterdocs_feedback_form_spam_blocked', $reason, $submission );

        wp_send_json_success(
            [
                'success' => true,
                'message' => __( 'Thanks! Your message has been sent.', 'betterdocs' )
            ]
        );
    }

    public function get_name() {
        return 'betterdocs_feedback_form';
    }

    /**
     * Summary of default_attributes
     * @return array
     */
    public function default_attributes() {
        return [
            'button_text'                      => __( 'Send', 'betterdocs' ),
            'feedback_form_name_label_text'    => __( 'Name:', 'betterdocs' ),
            'feedback_form_email_label_text'   => __( 'Email:', 'betterdocs' ),
            'feedback_form_message_label_text' => __( 'Message:', 'betterdocs' )
        ];
    }

    public function render( $atts, $content = null ) {
        $this->views( 'shortcodes/feedback-form' );
    }

    public function view_params() {
        $params = $this->attributes;
        $name   = '';
        $email  = '';

        if ( is_user_logged_in() ) {
            $userdata = get_userdata( get_current_user_id() );
            $name     = $userdata->first_name . ' ' . $userdata->last_name;
            $email    = $userdata->user_email;
        }

        $params['name']       = $name;
        $params['email']      = $email;
        $params['form_token'] = $this->form_token();

        return $params;
    }
}
