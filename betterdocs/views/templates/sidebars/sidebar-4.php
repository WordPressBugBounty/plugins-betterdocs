<?php
if ( ( isset( $force ) && $force == null ) || ! isset( $force ) ) {
	if ( ! betterdocs()->settings->get( 'enable_sidebar_cat_list' ) && isset( $layout_type ) && $layout_type == 'template' ) {
		return;
	}
}

	$wrapper_attributes = [
		'class' => [ 'betterdocs-sidebar betterdocs-full-sidebar-left betterdocs-sidebar-layout-4 betterdocs-background' ],
		'id'    => 'betterdocs-sidebar-left'
	];

	/**
	 * @var array $wrapper_attr_array
	 */
	if ( isset( $wrapper_attr_array ) && ! empty( $wrapper_attr_array ) && is_array( $wrapper_attr_array ) ) {
		$wrapper_attributes = betterdocs()->views->merge( $wrapper_attr_array, $wrapper_attributes );
	}

	$wrapper_attributes = betterdocs()->template_helper->get_html_attributes( $wrapper_attributes );
	?>

<aside
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div data-simplebar="init" class="betterdocs-sidebar-content betterdocs-height">
		<?php
			$terms_orderby = betterdocs()->settings->get( 'terms_orderby' );
			$terms_order   = betterdocs()->settings->get( 'terms_order' );
			$multiple_kb   = betterdocs()->settings->get( 'multiple_kb' );

		if ( betterdocs()->settings->get( 'alphabetically_order_term' ) ) {
			$terms_orderby = 'name';
		}

			$title_tag = betterdocs()->customizer->defaults->get( 'betterdocs_sidebar_title_tag' );

			$_shortcode_attr = [
				'terms_order'    => $terms_order,
				'terms_orderby'  => $terms_orderby,
				'sidebar_list'   => true,
				'show_icon'      => false,
				'show_count'     => false,
				'posts_per_page' => -1,
				'title_tag'      => betterdocs()->template_helper->is_valid_tag( $title_tag ),
				'layout_type'    => isset( $layout_type ) ? $layout_type : '',
			];

			if ( isset( $layout_type ) && $layout_type == 'template' ) {
				$_shortcode_attr['list_icon_url'] = ! empty( betterdocs()->customizer->defaults->get( 'betterdocs_sidbebar_item_list_icon' ) ) ? betterdocs()->customizer->defaults->get( 'betterdocs_sidbebar_item_list_icon' ) : ( ! empty( betterdocs()->settings->get( 'docs_list_icon' ) ) ? betterdocs()->settings->get( 'docs_list_icon' )['url'] : '' );
			}

			if ( isset( $layout_type ) && $layout_type == 'block' ) {
				$_shortcode_attr['list_icon_url'] = '';
			}

			if ( $multiple_kb ) {
				$_shortcode_attr['multiple_knowledge_base'] = true;
			}

			/**
			 * @var array $shortcode_attr
			 */
			if ( isset( $shortcode_attr ) ) {
				$_shortcode_attr = array_merge( $_shortcode_attr, $shortcode_attr );
			}

			$attributes = betterdocs()->template_helper->shortcode_atts(
				$_shortcode_attr,
				'betterdocs_category_grid',
				'sidebar-4'
			);
			echo do_shortcode( '[betterdocs_category_grid ' . $attributes . ']' );
			?>
	</div>
</aside>
