<?php
namespace WPDeveloper\BetterDocs\Modules;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}



// Doc/category-listing primitives (meta_query/tax_query, post__not_in/exclude)
// are intrinsic to BetterDocs' KB / category / FAQ filters and intentional.
// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_key
// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_meta_query
// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_tax_query
// phpcs:disable WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
// phpcs:disable WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in
use WPDeveloper\BetterDocs\Utils\CSSParser;

final class StyleHandler {
    private static $instance;

    private $prefix = 'betterdocs-style';
    private $style_dir;
    private $style_url;
    /**
     * Holds block styles array
     *
     * @var array
     */
    public static $_block_styles = array(  );

    /**
     * Post IDs of FSE templates / template parts whose CSS was generated
     * during the current request. Used to enqueue the matching per-template
     * CSS files on the frontend.
     *
     * @var int[]
     */
    public static $_fse_template_post_ids = array(  );

    public static function init() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function __construct() {
        $upload_dir = wp_upload_dir();

        $this->style_dir = $upload_dir[ 'basedir' ] . '/' . $this->prefix . DIRECTORY_SEPARATOR;
        $this->style_url = set_url_scheme( $upload_dir[ 'baseurl' ] ) . '/' . $this->prefix . '/';

        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ), 99 );
        add_action( 'save_post', array( $this, 'on_save_post' ), 10, 3 );
        add_action( 'wp', array( $this, 'generate_post_content' ) );

        // Synced patterns in block widgets render on every page; track them
        // once the widget/sidebar changes of the request are all saved.
        add_action( 'rest_after_save_widget', array( $this, 'schedule_widget_patterns_refresh' ) );
        add_action( 'rest_delete_widget', array( $this, 'schedule_widget_patterns_refresh' ) );
        add_action( 'rest_save_sidebar', array( $this, 'schedule_widget_patterns_refresh' ) );
        add_action( 'after_switch_theme', array( $this, 'schedule_widget_patterns_refresh' ) );
        add_action( 'rest_after_save_widget', array( $this, 'after_save_widget' ), 10, 4 );
        add_action( 'rest_delete_widget', array( $this, 'after_save_widget' ) );
        add_action( 'rest_save_sidebar', array( $this, 'after_save_widget' ) );
        add_action( 'after_switch_theme', array( $this, 'after_save_widget' ) );

        // FSE assets generation
        add_action(
            'init',
            function () {
                if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
                    add_filter( '404_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'archive_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'category_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'frontpage_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'home_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'index_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'page_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'search_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'single_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'singular_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'tag_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                    add_filter( 'taxonomy_template', array( $this, 'fse_assets_generation' ), 99, 3 );
                }
            },
            999
        );
    }

    /**
     * Generate FSE Assets
     */
    public function fse_assets_generation( $template, $type, $templates ) {
        $block_template = resolve_block_template( $type, $templates, $template );
        if ( ! empty( $block_template ) ) {
            $parsed_content = parse_blocks( $block_template->content );
            if ( is_array( $parsed_content ) && ! empty( $parsed_content ) ) {
                foreach ( $parsed_content as $content ) {
                    if ( ( 'core/template-part' == $content[ 'blockName' ] ) || ( 'core/template' == $content[ 'blockName' ] ) ) {
                        $post_ids = isset( $content[ 'attrs' ][ 'slug' ] ) ? self::betterdocs_get_post_content_by_post_name( $content[ 'attrs' ][ 'slug' ] ) : array(  );

                        if ( ! empty( $post_ids ) ) {
                            foreach ( $post_ids as $id ) {
                                $post_id                          = (int) $id[ 'ID' ];
                                self::$_fse_template_post_ids[  ] = $post_id;
                                $post                             = get_post( $post_id );
                                $parsed_content                   = parse_blocks( $post->post_content );
                                $this->write_css_from_content( $post, $post_id, $parsed_content );
                            }
                        }
                    } else {
                        $post_ids = self::betterdocs_get_post_content_by_post_name( $block_template->slug );
                        if ( ! empty( $post_ids ) ) {
                            foreach ( $post_ids as $id ) {
                                $post_id                          = (int) $id[ 'ID' ];
                                self::$_fse_template_post_ids[  ] = $post_id;
                                $post                             = get_post( $post_id );
                                $parsed_content                   = parse_blocks( $post->post_content );
                                $this->write_css_from_content( $post, $post_id, $parsed_content );
                            }
                        }
                    }
                }
            }
        }

        return $template;
    }

    /**
     * Write CSS
     */
    public function write_css_from_content( $post, $post_id, $parsed_content ) {
        $betterdocs_blocks  = array(  );
        $recursive_response = CSSParser::betterdocs_block_style_recursive( $parsed_content, $betterdocs_blocks );
        $all_reusable_blocks = ! empty( $recursive_response[ 'reusableBlocks' ] ) ? $recursive_response[ 'reusableBlocks' ] : array(  );
        // remove empty reusable blocks
        $reusable_Blocks = array_filter(
            $all_reusable_blocks,
            function ( $v ) {
                return ! empty( $v );
            }
        );
        unset( $recursive_response[ 'reusableBlocks' ] );
        $style       = CSSParser::blocks_to_style_array( $recursive_response );
        $reusableIds = $reusable_Blocks ? array_keys( $reusable_Blocks ) : array(  );
        // The option is merged into every page's enqueue, so only FSE
        // templates / template parts (rendered around every page) may set
        // it. Ordinary posts keep their ids in post meta below; they used to
        // overwrite the option too, so whatever the last post with synced
        // patterns referenced was loaded site-wide.
        if ( ! empty( $reusableIds ) && $this->is_fse_template( $post ) ) {
            update_option( '_betterdocs_reusable_block_ids', $reusableIds );
        }
        update_post_meta( $post_id, '_betterdocs_reusable_block_ids', $reusableIds );
        $this->write_block_css( $style, $post ); //Write CSS file for this page

        // Every referenced reusable block, including those with no BetterDocs
        // styles, so their stale files (e.g. pre-#174 copies of Essential
        // Blocks' CSS) are removed.
        foreach ( $all_reusable_blocks as $blockId => $block ) {
            $style = CSSParser::blocks_to_style_array( $block );
            $this->write_reusable_block_css( $style, $blockId );
        }
    }

    /**
     * Whether a post is an FSE template or template part.
     *
     * @param \WP_Post|null $post Post.
     * @return bool
     */
    private function is_fse_template( $post ) {
        return isset( $post->post_type ) && ( 'wp_template_part' === $post->post_type || 'wp_template' === $post->post_type );
    }

    /**
     * Rebuild the widget CSS when a widget or sidebar is saved or a widget is
     * deleted — once, at the end of the request: core fires
     * rest_after_save_widget before it assigns the widget to its sidebar.
     * @return void
     * @since 3.5.3
     */
    public function after_save_widget() {
        if ( false === has_action( 'shutdown', array( $this, 'rebuild_widget_css' ) ) ) {
            add_action( 'shutdown', array( $this, 'rebuild_widget_css' ) );
        }
    }

    /**
     * Write the widget CSS file from every active block widget's BetterDocs
     * blocks, or remove it when there are none. It used to hold only the
     * widget saved last, and was never removed (e.g. stale Essential Blocks
     * CSS collected before #174 stayed loaded on every page).
     * @return void
     */
    public function rebuild_widget_css() {
        $styles = array(  );
        foreach ( $this->active_block_widget_contents() as $content ) {
            if ( false === strpos( $content, '<!-- wp:betterdocs/' ) ) {
                continue;
            }
            $betterdocs_blocks  = array(  );
            $recursive_response = CSSParser::betterdocs_block_style_recursive( parse_blocks( $content ), $betterdocs_blocks );
            unset( $recursive_response[ 'reusableBlocks' ] );
            $styles = array_merge( $styles, CSSParser::blocks_to_style_array( $recursive_response ) );
        }

        $file = $this->style_dir . $this->prefix . '-widget.min.css';
        $css  = empty( $styles ) ? '' : CSSParser::build_css( $styles );
        if ( empty( $css ) ) {
            if ( file_exists( $file ) ) {
                wp_delete_file( $file );
            }
            return;
        }

        // Unchanged CSS: leave the file (and its mtime-based version) alone.
        if ( file_exists( $file ) && file_get_contents( $file ) === $css ) {
            return;
        }

        if ( ! file_exists( $this->style_dir ) ) {
            wp_mkdir_p( $this->style_dir );
        }
        file_put_contents( $file, $css );
    }

    /**
     * Content of the block widgets placed in a sidebar (not inactive).
     * @return string[]
     */
    private function active_block_widget_contents() {
        $contents  = array(  );
        $instances = get_option( 'widget_block', array(  ) );
        foreach ( wp_get_sidebars_widgets() as $sidebar_id => $widget_ids ) {
            if ( 'wp_inactive_widgets' === $sidebar_id || ! is_array( $widget_ids ) ) {
                continue;
            }
            foreach ( $widget_ids as $widget_id ) {
                if ( preg_match( '/^block-(\d+)$/', (string) $widget_id, $matches ) && ! empty( $instances[ $matches[1] ]['content'] ) ) {
                    $contents[] = (string) $instances[ $matches[1] ]['content'];
                }
            }
        }
        return $contents;
    }

    /**
     * Load Dependencies
     */
    private function load_style_handler_dependencies() {
        require_once plugin_dir_path( __FILE__ ) . 'includes/class-parse-css.php';
    }

    /**
     * Enqueue frontend css for post if have one
     * @return void
     * @since 1.0.2
     */
    public function enqueue_frontend_assets() {
        global $post;
        $deps = apply_filters( 'betterdocs_generated_css_frontend_deps', array(  ) );

        // generatepress elements
        // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WP core 'active_plugins' filter, applied to detect GeneratePress Premium presence on multisite.
        if ( in_array( 'gp-premium/gp-premium.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
            $gp_elements = get_posts( array( 'post_type' => 'gp_elements' ) );
            if ( is_array( $gp_elements ) && ! empty( $gp_elements ) ) {
                foreach ( $gp_elements as $element ) {
                    if ( file_exists( $this->style_dir . $this->prefix . '-' . $element->ID . '.min.css' ) ) {
                        wp_enqueue_style( 'betterdocs-block-style-' . $element->ID, $this->style_url . $this->prefix . '-' . $element->ID . '.min.css', $deps, $this->file_version( $this->style_dir . $this->prefix . '-' . $element->ID . '.min.css' ) );
                    }
                }
            }
        }

        if ( ! empty( $post ) && ! empty( $post->ID ) ) {
            //Page/Post Style Enqueue — only for posts that hold BetterDocs
            // blocks. Until #174 the parser also collected Essential Blocks'
            // blocks, so files written then for pages without BetterDocs
            // blocks are stale duplicates of Essential Blocks' CSS; they are
            // skipped here and removed on the post's next save (#174).
            $post_css = $this->style_dir . $this->prefix . '-' . $post->ID . '.min.css';
            if ( file_exists( $post_css ) && false !== strpos( (string) $post->post_content, '<!-- wp:betterdocs/' ) ) {
                wp_enqueue_style( 'betterdocs-block-style-' . $post->ID, $this->style_url . $this->prefix . '-' . $post->ID . '.min.css', $deps, $this->file_version( $post_css ) );
            }

            // Reusable block Style Enqueues
            $reusableIds         = get_post_meta( $post->ID, '_betterdocs_reusable_block_ids', true );
            $reusableIds         = ! empty( $reusableIds ) ? $reusableIds : array(  );
            $templateReusableIds = get_option( '_betterdocs_reusable_block_ids', array(  ) );
            $reusableIds         = array_unique( array_merge( $reusableIds, $templateReusableIds ) );
            foreach ( $reusableIds as $reusableId ) {
                $this->enqueue_reusable_block_style( $reusableId, $deps );
            }
        }

        //Widget Style Enqueue — only while an active block widget holds
        // BetterDocs blocks, so a stale file (see rebuild_widget_css()) is
        // not loaded site-wide until the next widget save removes it.
        if ( file_exists( $this->style_dir . $this->prefix . '-widget.min.css' ) && false !== strpos( implode( '', $this->active_block_widget_contents() ), '<!-- wp:betterdocs/' ) ) {
            wp_enqueue_style( 'betterdocs-widget-style', $this->style_url . $this->prefix . '-widget.min.css', $deps, $this->file_version( $this->style_dir . $this->prefix . '-widget.min.css' ) );
        }

        // Synced patterns in block widgets, on every page. Built once on
        // sites whose widgets were saved before this list existed.
        $widgetReusableIds = get_option( '_betterdocs_widget_reusable_block_ids', null );
        if ( null === $widgetReusableIds ) {
            $widgetReusableIds = $this->refresh_widget_patterns();
        }
        foreach ( (array) $widgetReusableIds as $reusableId ) {
            $this->enqueue_reusable_block_style( $reusableId, $deps );
        }

        //FSE Style Enqueue — one file per FSE template/template-part post so
        // styles do not bleed across templates (issue #53).
        if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() && betterdocs()->helper->is_templates() && ! empty( self::$_fse_template_post_ids ) ) {
            foreach ( array_unique( self::$_fse_template_post_ids ) as $template_post_id ) {
                $file_name = $this->prefix . '-edit-site-' . abs( $template_post_id ) . '.min.css';
                if ( file_exists( $this->style_dir . $file_name ) ) {
                    wp_enqueue_style(
                        'betterdocs-fullsite-style-' . abs( $template_post_id ),
                        $this->style_url . $file_name,
                        $deps,
                        $this->file_version( $this->style_dir . $file_name )
                    );
                }
            }
        }

        /**
         * Hooks assets for enqueue in frontend
         *
         * @param $path string
         * @param $url string
         *
         * @since 3.0.0
         */
        do_action( 'betterdocs_frontend_assets', $this->style_dir, $this->style_url );
    }

    /**
     * Get post content when page is saved
     */
    public function on_save_post( $post_id, $post, $update ) {
        $post_type = get_post_type( $post_id );

        //If This page is draft, return
        if ( isset( $post->post_status ) && 'auto-draft' == $post->post_status ) {
            return;
        }

        // Autosave, do nothing
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        // Return if it's a post revision
        if ( false !== wp_is_post_revision( $post_id ) ) {
            return;
        }

        $parsed_content = $this->get_parsed_content( $post_id, $post, $post_type );

        // A synced pattern is styled through its reusable-block file, which
        // pages referencing it enqueue. Refresh (or remove) that file here so
        // edits to the pattern take effect without re-saving those pages.
        if ( 'wp_block' === $post_type ) {
            $betterdocs_blocks  = array(  );
            $recursive_response = is_array( $parsed_content ) ? CSSParser::betterdocs_block_style_recursive( $parsed_content, $betterdocs_blocks ) : array(  );
            $this->write_reusable_block_css( CSSParser::blocks_to_style_array( $recursive_response ), $post_id );
            return;
        }

        if ( is_array( $parsed_content ) && ! empty( $parsed_content ) ) {
            $this->write_css_from_content( $post, $post_id, $parsed_content );
        }
    }

    private function get_parsed_content( $post_id, $post, $post_type ) {
        if ( 'wp_template_part' === $post_type || 'wp_template' === $post_type ) {
            $post = get_post( $post_id );
        }

        if ( ! $post ) {
            return array(  );
        }

        $parsed_content = parse_blocks( $post->post_content );

        if ( empty( $parsed_content ) ) {
            delete_post_meta( $post_id, '_betterdocs_reusable_block_ids' );
        }

        return $parsed_content;
    }

    /**
     * Get post content when page is load in frontend
     */
    /**
     * Cheap pre-check: can this post's content hold BetterDocs blocks,
     * directly or through a reusable block (`core/block` ref)?
     *
     * @param \WP_Post|null $post Post.
     * @return bool
     */
    public static function may_have_betterdocs_blocks( $post ) {
        $content = isset( $post->post_content ) ? (string) $post->post_content : '';
        return false !== strpos( $content, '<!-- wp:betterdocs/' ) || false !== strpos( $content, '<!-- wp:block ' );
    }

    /**
     * Whether a synced pattern (wp_block) holds BetterDocs blocks.
     * get_post() is object-cached, so this is cheap per enqueue.
     *
     * @param int $id wp_block post ID.
     * @return bool
     */
    private function reusable_block_has_betterdocs_blocks( $id ) {
        $block = get_post( (int) $id );
        return isset( $block->post_content ) && false !== strpos( (string) $block->post_content, '<!-- wp:betterdocs/' );
    }

    /**
     * Refresh the widget pattern list at the end of the request: core fires
     * rest_after_save_widget before it assigns the widget to its sidebar.
     * @return void
     */
    public function schedule_widget_patterns_refresh() {
        if ( false === has_action( 'shutdown', array( $this, 'refresh_widget_patterns' ) ) ) {
            add_action( 'shutdown', array( $this, 'refresh_widget_patterns' ) );
        }
    }

    /**
     * Write the CSS of the synced patterns placed in active block widgets and
     * record their ids, which every page enqueues.
     * @return array Pattern ids.
     */
    public function refresh_widget_patterns() {
        $ids       = array(  );
        $instances = get_option( 'widget_block', array(  ) );
        foreach ( wp_get_sidebars_widgets() as $sidebar_id => $widget_ids ) {
            if ( 'wp_inactive_widgets' === $sidebar_id || ! is_array( $widget_ids ) ) {
                continue;
            }
            foreach ( $widget_ids as $widget_id ) {
                if ( ! preg_match( '/^block-(\d+)$/', (string) $widget_id, $matches ) || empty( $instances[ $matches[1] ]['content'] ) ) {
                    continue;
                }
                $betterdocs_blocks  = array(  );
                $recursive_response = CSSParser::betterdocs_block_style_recursive( parse_blocks( $instances[ $matches[1] ]['content'] ), $betterdocs_blocks );
                $reusable_blocks    = ! empty( $recursive_response['reusableBlocks'] ) ? $recursive_response['reusableBlocks'] : array(  );
                foreach ( $reusable_blocks as $block_id => $block ) {
                    $this->write_reusable_block_css( CSSParser::blocks_to_style_array( $block ), $block_id );
                    if ( ! empty( $block ) ) {
                        $ids[] = (int) $block_id;
                    }
                }
            }
        }

        $ids = array_values( array_unique( $ids ) );
        update_option( '_betterdocs_widget_reusable_block_ids', $ids );
        return $ids;
    }

    /**
     * Enqueue a synced pattern's CSS file, if it holds BetterDocs blocks.
     * @return void
     */
    private function enqueue_reusable_block_style( $reusableId, $deps ) {
        // Only for synced patterns that hold BetterDocs blocks: files written
        // before #174 for patterns built with other plugins' blocks are stale
        // duplicates of their CSS (#174).
        $file = $this->style_dir . 'reusable-blocks/betterdocs-reusable-' . $reusableId . '.min.css';
        if ( file_exists( $file ) && $this->reusable_block_has_betterdocs_blocks( $reusableId ) ) {
            wp_enqueue_style( 'betterdocs-reusable-block-style-' . $reusableId, $this->style_url . 'reusable-blocks/betterdocs-reusable-' . $reusableId . '.min.css', $deps, $this->file_version( $file ) );
        }
    }

    public function generate_post_content() {
        $post_id = get_the_ID();
        if ( $post_id ) {
            $post_type = get_post_type( $post_id );
            $post      = get_post( $post_id );
            //If This page is draft, return
            if ( isset( $post->post_status ) && 'auto-draft' == $post->post_status ) {
                return;
            }

            // Return if it's a post revision
            if ( false !== wp_is_post_revision( $post_id ) ) {
                return null;
            }

            // This runs on every uncached front-end request. Skip the parse
            // and the file/meta/option writes for content with nothing for
            // BetterDocs to style — on a large page built with other blocks
            // that was a full parse_blocks() plus a CSS rewrite per view.
            if ( ! self::may_have_betterdocs_blocks( $post ) ) {
                return;
            }

            $parsed_content = $this->get_parsed_content( $post_id, $post, $post_type );

            if ( is_array( $parsed_content ) && ! empty( $parsed_content ) ) {
                $this->write_css_from_content( $post, $post_id, $parsed_content );
            }
        }
    }

    /**
     * Cache-busting version for a generated stylesheet: its modification time.
     * Was a random value per render, which stopped browsers caching the file.
     *
     * @param string $path File path.
     * @return string|false
     */
    private function file_version( $path ) {
        $mtime = @filemtime( $path ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
        return $mtime ? (string) $mtime : false;
    }

    /**
     * Ajax callback to write css in upload directory
     * @retun void
     * @since 1.0.2
     */
    private function write_block_css( $block_styles, $post ) {
        // Write CSS for FSE templates / template parts — one file per post so
        // styles from different templates do not overwrite each other in a
        // shared file (issue #53).
        if ( isset( $post->post_type ) && ( 'wp_template_part' === $post->post_type || 'wp_template' === $post->post_type ) ) {
            $file = $this->style_dir . $this->prefix . '-edit-site-' . abs( $post->ID ) . '.min.css';
        } else { // Page/Posts
            $file = $this->style_dir . $this->prefix . '-' . abs( $post->ID ) . '.min.css';
        }

        $css = empty( $block_styles ) ? '' : CSSParser::build_css( $block_styles );
        if ( empty( $css ) ) {
            // No BetterDocs blocks left: drop the file so a stale one is not
            // enqueued forever (#174).
            if ( file_exists( $file ) ) {
                wp_delete_file( $file );
            }
            return;
        }

        // Unchanged CSS: leave the file (and its mtime-based version) alone,
        // so browsers keep their cached copy.
        if ( file_exists( $file ) && file_get_contents( $file ) === $css ) {
            return;
        }

        if ( ! file_exists( $this->style_dir ) ) {
            wp_mkdir_p( $this->style_dir );
        }
        file_put_contents( $file, $css );
    }

    /**
     * Write css for Reusable block
     * @retun void
     * @since 3.4.0
     */
    private function write_reusable_block_css( $block_styles, $id ) {
        $upload_dir = $this->style_dir . 'reusable-blocks/';
        $file       = $upload_dir . 'betterdocs-reusable-' . abs( $id ) . '.min.css';

        $css = empty( $block_styles ) || ! is_array( $block_styles ) ? '' : CSSParser::build_css( $block_styles );
        if ( empty( $css ) ) {
            // No BetterDocs blocks in this synced pattern: drop the file so a
            // stale one is not enqueued forever (#174).
            if ( file_exists( $file ) ) {
                wp_delete_file( $file );
            }
            return;
        }

        // Unchanged CSS: leave the file (and its mtime-based version) alone.
        if ( file_exists( $file ) && file_get_contents( $file ) === $css ) {
            return;
        }

        if ( ! file_exists( $upload_dir ) ) {
            wp_mkdir_p( $upload_dir );
        }
        file_put_contents( $file, $css );
    }

    /**
     * Get post id by post_name for template
     */
    public static function betterdocs_get_post_content_by_post_name( $post_name ) {
        global $wpdb;
        $sql = $wpdb->prepare( "SELECT ID FROM {$wpdb->prefix}posts WHERE post_name = %s", $post_name );

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- one-off lookup of FSE template posts by post_name during CSS generation; no caching layer applies.
        return $wpdb->get_results( $sql, ARRAY_A );
    }
}
