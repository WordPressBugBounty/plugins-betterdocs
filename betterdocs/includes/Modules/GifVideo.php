<?php
namespace WPDeveloper\BetterDocs\Modules;

/**
 * Serve animated GIFs in docs as muted, looping video.
 *
 * Docs lean on GIF screencasts, and GIF is a heavy format: on
 * essential-blocks.com, 340 GIFs across 51 docs weighed 756 MB, while the same
 * clips as H.264 MP4 weigh 97 MB. A GIF attachment can be linked to a converted
 * MP4 (and a poster frame) through two attachment meta fields; when it is, the
 * GIF's Image block renders as a <video> at the GIF's own width and height.
 *
 * Content is not modified: editors keep the Image block and the GIF, and
 * removing the meta restores the GIF. Videos load nothing until they are near
 * the screen, then play muted in a loop like the GIF did.
 */
final class GifVideo {
	const VIDEO_META  = '_betterdocs_gif_video';
	const POSTER_META = '_betterdocs_gif_poster';

	private static $printed_script = false;

	public static function init() {
		$self = new self();
		add_action( 'init', [ $self, 'register_meta' ] );
		add_filter( 'render_block_core/image', [ $self, 'render_image' ], 10, 2 );
		add_filter( 'attachment_fields_to_edit', [ $self, 'attachment_fields' ], 10, 2 );
		add_filter( 'attachment_fields_to_save', [ $self, 'save_attachment_fields' ], 10, 2 );
		add_action( 'wp_enqueue_media', [ $self, 'enqueue_picker' ] );
	}

	/**
	 * "Video version" and "Poster image" fields on a GIF's attachment details
	 * (media modal and attachment edit screen), so editors can link them
	 * without the REST API.
	 *
	 * @param array    $fields Attachment form fields.
	 * @param \WP_Post $post   Attachment.
	 * @return array
	 */
	public function attachment_fields( $fields, $post ) {
		if ( 'image/gif' !== get_post_mime_type( $post ) || ! current_user_can( 'upload_files' ) ) {
			return $fields;
		}

		$fields['betterdocs_gif_video']  = [
			'label' => __( 'Video version', 'betterdocs' ),
			'input' => 'html',
			'html'  => $this->picker_html( $post->ID, self::VIDEO_META, 'video' ),
			'helps' => __( 'An MP4 of this GIF. Docs play it in place of the GIF: same look, much smaller download.', 'betterdocs' ),
		];
		$fields['betterdocs_gif_poster'] = [
			'label' => __( 'Poster image', 'betterdocs' ),
			'input' => 'html',
			'html'  => $this->picker_html( $post->ID, self::POSTER_META, 'image' ),
			'helps' => __( 'Optional. Shown until the video starts.', 'betterdocs' ),
		];

		return $fields;
	}

	/**
	 * @param int    $id   GIF attachment ID.
	 * @param string $key  Meta key.
	 * @param string $type Library type to pick from: "video" or "image".
	 * @return string
	 */
	private function picker_html( $id, $key, $type ) {
		$field  = 'betterdocs_gif_' . ( self::VIDEO_META === $key ? 'video' : 'poster' );
		$linked = (int) get_post_meta( $id, $key, true );
		$file   = $linked ? get_attached_file( $linked ) : '';
		$name   = $file ? wp_basename( $file ) : '';

		return sprintf(
			'<span class="betterdocs-gif-field"><input type="hidden" id="attachments-%1$d-%2$s" name="attachments[%1$d][%2$s]" value="%3$d" />'
			. '<span class="betterdocs-gif-name" style="display:block;word-break:break-all;margin-bottom:4px">%4$s</span>'
			. '<button type="button" class="button button-small betterdocs-gif-pick" data-type="%5$s" data-title="%6$s" data-button="%7$s">%8$s</button> '
			. '<button type="button" class="button-link button-link-delete betterdocs-gif-clear"%9$s>%10$s</button></span>',
			(int) $id,
			esc_attr( $field ),
			$name ? $linked : 0,
			esc_html( $name ),
			esc_attr( $type ),
			esc_attr( 'video' === $type ? __( 'Choose the video version', 'betterdocs' ) : __( 'Choose a poster image', 'betterdocs' ) ),
			esc_attr__( 'Use this file', 'betterdocs' ),
			esc_html__( 'Choose', 'betterdocs' ),
			$name ? '' : ' hidden',
			esc_html__( 'Remove', 'betterdocs' )
		);
	}

	/**
	 * Store the picked files; ignore anything that isn't a video (clip) or
	 * an image (poster).
	 *
	 * @param array $post       Attachment post data.
	 * @param array $attachment Submitted attachment fields.
	 * @return array
	 */
	public function save_attachment_fields( $post, $attachment ) {
		if ( empty( $post['ID'] ) || 'image/gif' !== get_post_mime_type( $post['ID'] ) || ! current_user_can( 'upload_files' ) ) {
			return $post;
		}

		foreach ( [ 'betterdocs_gif_video' => [ self::VIDEO_META, 'video/' ], 'betterdocs_gif_poster' => [ self::POSTER_META, 'image/' ] ] as $field => $target ) {
			if ( ! isset( $attachment[ $field ] ) ) {
				continue;
			}
			$value = absint( $attachment[ $field ] );
			if ( ! $value ) {
				delete_post_meta( $post['ID'], $target[0] );
			} elseif ( 0 === strpos( (string) get_post_mime_type( $value ), $target[1] ) ) {
				update_post_meta( $post['ID'], $target[0], $value );
			}
		}

		return $post;
	}

	/**
	 * Open the media library to pick the video or poster. Loaded wherever
	 * the media modal is. The field is looked up again on select: closing
	 * the image picker re-renders the GIF's details (the GIF is in that
	 * library), which replaces the field's markup.
	 */
	public function enqueue_picker() {
		if ( ! current_user_can( 'upload_files' ) ) {
			return;
		}

		$js = <<<'JS'
jQuery(function($){var frames={};
function set(name,id,label){var w=$('input[name="'+name+'"]').last().closest('.betterdocs-gif-field');w.find('.betterdocs-gif-name').text(label);w.find('.betterdocs-gif-clear').prop('hidden',!id);w.find('input').val(id).trigger('change');}
$(document).on('click','.betterdocs-gif-pick',function(e){e.preventDefault();var b=$(this),t=b.data('type'),name=b.closest('.betterdocs-gif-field').find('input').attr('name');
var f=frames[t]||(frames[t]=wp.media({title:b.data('title'),library:{type:t},multiple:false,button:{text:b.data('button')}}));
f.off('select').on('select',function(){var a=f.state().get('selection').first();if(a){set(name,a.id,a.get('filename'));}});
f.open();});
$(document).on('click','.betterdocs-gif-clear',function(e){e.preventDefault();set($(this).closest('.betterdocs-gif-field').find('input').attr('name'),0,'');});
});
JS;
		wp_add_inline_script( 'media-views', $js );
	}

	/**
	 * Attachment IDs of the MP4 and the poster, editable over REST by users
	 * who can upload media.
	 */
	public function register_meta() {
		foreach ( [ self::VIDEO_META => 'video/', self::POSTER_META => 'image/' ] as $key => $type ) {
			register_post_meta(
				'attachment',
				$key,
				[
					'type'              => 'integer',
					'single'            => true,
					'show_in_rest'      => true,
					'default'           => 0,
					'sanitize_callback' => function ( $value ) use ( $type ) {
						$value = absint( $value );
						return self::is_attachment_type( $value, $type ) ? $value : 0;
					},
					'auth_callback'     => function () {
						return current_user_can( 'upload_files' );
					},
				]
			);
		}
	}

	/**
	 * Whether an attachment exists and its mime type starts with $type
	 * ("video/" for the clip, "image/" for the poster).
	 *
	 * @param int    $id   Attachment ID.
	 * @param string $type Mime type prefix.
	 * @return bool
	 */
	private static function is_attachment_type( $id, $type ) {
		return $id && 0 === strpos( (string) get_post_mime_type( $id ), $type );
	}

	/**
	 * @param string $content Rendered Image block.
	 * @param array  $block   Parsed block.
	 * @return string
	 */
	public function render_image( $content, $block ) {
		if ( is_admin() || wp_is_json_request() || 'docs' !== get_post_type() ) {
			return $content;
		}

		// Core adds "Expand on click" after this filter, and only to an <img>.
		// Its render callback has already hooked the lightbox for this block
		// when it applies, so keep the image there.
		if ( false !== has_filter( 'render_block_core/image', 'block_core_image_render_lightbox' ) ) {
			return $content;
		}

		$id = isset( $block['attrs']['id'] ) ? (int) $block['attrs']['id'] : 0;
		if ( ! $id && preg_match( '/\bwp-image-(\d+)\b/', $content, $m ) ) {
			$id = (int) $m[1];
		}
		if ( ! $id || 'image/gif' !== get_post_mime_type( $id ) ) {
			return $content;
		}

		// Only the doc page itself gets the video. The REST API, feeds and
		// the Markdown view render content outside the page template (before
		// or during template_redirect) and keep the GIF for their readers.
		if ( ! did_action( 'template_redirect' ) || doing_action( 'template_redirect' ) || is_feed() ) {
			return $content;
		}

		$video_id = (int) get_post_meta( $id, self::VIDEO_META, true );
		$src      = self::is_attachment_type( $video_id, 'video/' ) ? wp_get_attachment_url( $video_id ) : '';
		if ( ! $src || ! preg_match( '/<img\b[^>]*>/i', $content, $img ) ) {
			return $content;
		}

		$tag = new \WP_HTML_Tag_Processor( $img[0] );
		$tag->next_tag( 'img' );

		// Size the video like the image the block shows (full, Medium, …),
		// and keep the block's own inline styles (width, aspect ratio, crop,
		// border), so the video takes the same space as the GIF did.
		$width  = $tag->get_attribute( 'width' );
		$height = $tag->get_attribute( 'height' );
		if ( ! $width || ! $height ) {
			$meta       = wp_get_attachment_metadata( $id );
			$dimensions = is_array( $meta ) ? wp_image_src_get_dimensions( (string) $tag->get_attribute( 'src' ), $meta, $id ) : false;
			if ( $dimensions ) {
				list( $width, $height ) = $dimensions;
			} elseif ( ! empty( $meta['width'] ) && ! empty( $meta['height'] ) ) {
				$width  = (int) $meta['width'];
				$height = (int) $meta['height'];
			}
		}
		// An image shows at its width attribute, capped by its container; pin
		// that width inline, since themes often stretch `figure > video`.
		$style = $width ? sprintf( 'width: %dpx; ', (int) $width ) : '';
		$style = trim( $style . 'max-width: 100%; height: auto; ' . (string) $tag->get_attribute( 'style' ) );

		$attrs = [
			'class'                => $tag->get_attribute( 'class' ),
			'src'                  => $src,
			'width'                => $width,
			'height'               => $height,
			'aria-label'           => $tag->get_attribute( 'alt' ),
			'style'                => $style,
			'preload'              => 'none',
			'data-betterdocs-gif'  => '1',
			// The clip plays itself while on screen (print_script()). Keep
			// lazy-load/facade optimizers off it: xSpeed's click-to-play
			// facade collapsed it to a 0x0 button in centred image figures.
			'data-skip-lazy'       => '1',
			'data-no-lazy'         => '1',
		];
		$poster_id = (int) get_post_meta( $id, self::POSTER_META, true );
		$poster    = self::is_attachment_type( $poster_id, 'image/' ) ? wp_get_attachment_url( $poster_id ) : '';
		if ( $poster ) {
			$attrs['poster'] = $poster;
		}

		$html = '<video muted loop playsinline';
		foreach ( $attrs as $name => $value ) {
			if ( null === $value || '' === $value || false === $value ) {
				continue;
			}
			$html .= sprintf( ' %s="%s"', $name, 'src' === $name || 'poster' === $name ? esc_url( $value ) : esc_attr( $value ) );
		}
		$html .= '></video>';

		$this->enqueue_style();
		$this->print_script();

		return str_replace( $img[0], $html, $content );
	}

	/**
	 * Core's Image and Gallery styles target `img`; apply the same rules
	 * (rounded style, wide/full alignment, cropped gallery) to the video.
	 */
	private function enqueue_style() {
		if ( wp_style_is( 'betterdocs-gif-video', 'enqueued' ) ) {
			return;
		}

		$v   = 'video[data-betterdocs-gif]';
		$css = ".wp-block-image {$v}{vertical-align:bottom;box-sizing:border-box}"
			. ".wp-block-image[style*=border-radius] {$v}{border-radius:inherit}"
			. ".wp-block-image.alignfull {$v},.wp-block-image.alignwide {$v}{width:100% !important}"
			. ".wp-block-image.is-style-circle-mask {$v}{border-radius:9999px}"
			. ":root :where(.wp-block-image.is-style-rounded {$v},.wp-block-image .is-style-rounded {$v}){border-radius:9999px}"
			. ".wp-block-gallery.has-nested-images figure.wp-block-image {$v}{display:block;max-width:100% !important}"
			. ".wp-block-gallery.has-nested-images.is-cropped figure.wp-block-image:not(#individual-image) {$v}{width:100% !important;flex:1 0 0%;height:100% !important;object-fit:cover}";

		wp_register_style( 'betterdocs-gif-video', false, [], BETTERDOCS_VERSION );
		wp_add_inline_style( 'betterdocs-gif-video', $css );
		wp_enqueue_style( 'betterdocs-gif-video' );
	}

	/**
	 * Play each video while it is on screen, like the GIF animated; pause it
	 * off screen. With reduced motion requested, or when the browser blocks
	 * autoplay (e.g. iOS Low Power Mode), show controls instead.
	 */
	private function print_script() {
		if ( self::$printed_script ) {
			return;
		}
		self::$printed_script = true;

		add_action(
			'wp_footer',
			function () {
				$js = <<<'JS'
(function(){var v=document.querySelectorAll('video[data-betterdocs-gif]');if(!v.length)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.forEach(function(e){e.controls=true;e.preload='metadata';});return;}
function play(e){var p=e.play();if(p&&p.catch)p.catch(function(){e.controls=true;e.preload='metadata';});}
if(!('IntersectionObserver' in window)){v.forEach(play);return;}
var o=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)play(x.target);else x.target.pause();});},{rootMargin:'200px 0px'});
v.forEach(function(e){o.observe(e);});})();
JS;
				wp_print_inline_script_tag( $js, [ 'id' => 'betterdocs-gif-video' ] );
			},
			20
		);
	}
}
