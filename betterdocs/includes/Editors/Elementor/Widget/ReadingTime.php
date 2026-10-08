<?php

namespace WPDeveloper\BetterDocs\Editors\Elementor\Widget;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use WPDeveloper\BetterDocs\Editors\Elementor\BaseWidget;
use WPDeveloper\BetterDocs\Core\AIActions as CoreAIActions;
use Elementor\Group_Control_Border;

/**
 * The single-doc meta row: estimated reading time, Listen and the AI Actions
 * button.
 *
 * Three independent parts, each with its own switch, in one widget. `get_name()`
 * stays `betterdocs-reading-time` because Elementor persists the widget type in
 * `_elementor_data` and drops any element whose type it cannot resolve — renaming
 * it would silently delete the widget, and its settings, from every template that
 * already uses it. Only the title changed.
 *
 * Every control defaults to the matching Settings-panel value, so a widget nobody
 * has touched renders what the site-wide configuration says.
 */
class ReadingTime extends BaseWidget {

	/**
	 * Action id => the control that overrides its Settings key.
	 *
	 * Ids come from Core\AIActions::registry(). Control names deliberately match
	 * the Settings keys, so the panel and the widget read the same at a glance.
	 *
	 * @var array<string, string>
	 */
	const AI_ACTION_CONTROLS = [
		'copy-page'       => 'ai_actions_copy_page',
		'view-markdown'   => 'ai_actions_view_markdown',
		'open-chatgpt'    => 'ai_actions_chatgpt',
		'open-claude'     => 'ai_actions_claude',
		'open-aistudio'   => 'ai_actions_gemini',
		'open-perplexity' => 'ai_actions_perplexity',
		'open-grok'       => 'ai_actions_grok'
	];

	public function get_name() {
		return 'betterdocs-reading-time';
	}

	public function get_style_depends() {
		// `betterdocs-ai-actions` and `betterdocs-listen` each carry the meta row
		// itself, not just their own control, so both are needed whichever parts are
		// switched off. They are separate handles precisely so either can lay the row
		// out alone — see scss/template-parts/_doc-meta.scss.
		return [ 'reading-time', 'betterdocs-ai-actions', 'betterdocs-listen' ];
	}

	public function get_script_depends() {
		return [ 'betterdocs' ];
	}

	public function get_title() {
		return __( 'Reading Time, Listen and AI Action', 'betterdocs' );
	}

	public function get_icon() {
		return 'betterdocs-icon-Reading-Time';
	}

	public function get_categories() {
		return [ 'betterdocs-elements', 'betterdocs-elements-single' ];
	}

	public function get_keywords() {
		return [ 'betterdocs-elements', 'betterdocs', 'docs', 'single-doc', 'reading time', 'ai', 'markdown', 'copy', 'listen', 'audio', 'text to speech', 'accessibility' ];
	}

	public function get_custom_help_url() {
		return 'https://betterdocs.co/docs/docs-archive-in-elementor/';
	}

	/**
	 * A boolean setting as a SWITCHER default.
	 *
	 * @param string $key
	 * @return string `yes` or ''
	 */
	protected function switcher_default( $key ) {
		return betterdocs()->settings->get( $key ) ? 'yes' : '';
	}

	protected function register_controls() {
		$settings = betterdocs()->settings;

		$this->start_controls_section(
			'section_content',
			[
				'label' => __( 'Reading Time', 'betterdocs' ),
				'tab'   => Controls_Manager::TAB_CONTENT
			]
		);

		$this->add_control(
			'enable_reading_time',
			[
				'label'        => __( 'Enable Reading Time', 'betterdocs' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'betterdocs' ),
				'label_off'    => __( 'No', 'betterdocs' ),
				'return_value' => 'yes',
				'default'      => $this->switcher_default( 'enable_estimated_reading_time' )
			]
		);

		$this->add_control(
			'ert_reading_title',
			[
				'label'       => __( 'Reading Time Title', 'betterdocs' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => (string) $settings->get( 'estimated_reading_time_title' ),
				'placeholder' => __( 'Type Here', 'betterdocs' ),
				'condition'   => [ 'enable_reading_time' => 'yes' ]
			]
		);

		$this->add_control(
			'ert_reading_text',
			[
				'label'       => __( 'Reading Time Text', 'betterdocs' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => (string) $settings->get( 'estimated_reading_time_text' ),
				'placeholder' => __( 'Type Here', 'betterdocs' ),
				'condition'   => [ 'enable_reading_time' => 'yes' ]
			]
		);

		$this->add_control(
			'singular_ert_reading_text',
			[
				'label'       => __( 'Singular Reading Time Text', 'betterdocs' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => (string) $settings->get( 'singular_estimated_reading_time_text' ),
				'placeholder' => __( 'Type Here', 'betterdocs' ),
				'condition'   => [ 'enable_reading_time' => 'yes' ]
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_listen',
			[
				'label' => __( 'Listen', 'betterdocs' ),
				'tab'   => Controls_Manager::TAB_CONTENT
			]
		);

		$this->add_control(
			'enable_listen',
			[
				'label'        => __( 'Enable Listen', 'betterdocs' ),
				'description'  => __( 'Adds a button that turns into a small player and reads the doc aloud using the visitor\'s own browser — no audio files and no third-party service.', 'betterdocs' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'betterdocs' ),
				'label_off'    => __( 'No', 'betterdocs' ),
				'return_value' => 'yes',
				'default'      => $this->switcher_default( 'enable_listen' )
			]
		);

		$this->add_control(
			'listen_button_label',
			[
				'label'       => __( 'Button Label', 'betterdocs' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => (string) $settings->get( 'listen_button_label' ),
				'placeholder' => __( 'Listen', 'betterdocs' ),
				'condition'   => [ 'enable_listen' => 'yes' ]
			]
		);

		$this->add_control(
			'listen_show_speed',
			[
				'label'        => __( 'Speed Control', 'betterdocs' ),
				'description'  => __( 'Let readers cycle the playback speed between 0.75× and 2×.', 'betterdocs' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'betterdocs' ),
				'label_off'    => __( 'No', 'betterdocs' ),
				'return_value' => 'yes',
				'default'      => $this->switcher_default( 'listen_show_speed' ),
				'condition'    => [ 'enable_listen' => 'yes' ]
			]
		);

		$this->add_control(
			'listen_words_per_minute',
			[
				'label'       => __( 'Words Per Minute', 'betterdocs' ),
				'description' => __( 'Used to estimate the total playing time the player shows. Browser voices read at roughly 180 words a minute at normal speed.', 'betterdocs' ),
				'type'        => Controls_Manager::NUMBER,
				'min'         => 60,
				'max'         => 400,
				'step'        => 10,
				'default'     => (int) $settings->get( 'listen_words_per_minute' ),
				'condition'   => [ 'enable_listen' => 'yes' ]
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_ai_actions',
			[
				'label' => __( 'AI Actions', 'betterdocs' ),
				'tab'   => Controls_Manager::TAB_CONTENT
			]
		);

		$this->add_control(
			'enable_ai_actions',
			[
				'label'        => __( 'Enable AI Actions', 'betterdocs' ),
				'description'  => __( 'Adds a "Copy page" button that copies the doc as Markdown, or hands it to ChatGPT, Claude or another assistant as context.', 'betterdocs' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'betterdocs' ),
				'label_off'    => __( 'No', 'betterdocs' ),
				'return_value' => 'yes',
				'default'      => $this->switcher_default( 'enable_ai_actions' )
			]
		);

		$this->add_control(
			'ai_actions_button_label',
			[
				'label'       => __( 'Button Label', 'betterdocs' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => (string) $settings->get( 'ai_actions_button_label' ),
				'placeholder' => __( 'Copy page', 'betterdocs' ),
				'condition'   => [ 'enable_ai_actions' => 'yes' ]
			]
		);

		$this->add_control(
			'ai_actions_prompt_template',
			[
				'label'       => __( 'AI Prompt Template', 'betterdocs' ),
				'description' => __( 'Sent to the AI assistant when a reader opens this doc there. Use {URL} for the doc address.', 'betterdocs' ),
				'type'        => Controls_Manager::TEXTAREA,
				'rows'        => 3,
				'default'     => (string) $settings->get( 'ai_actions_prompt_template' ),
				'condition'   => [ 'enable_ai_actions' => 'yes' ]
			]
		);

		$action_labels = [
			'ai_actions_copy_page'     => __( 'Copy Page', 'betterdocs' ),
			'ai_actions_view_markdown' => __( 'View as Markdown', 'betterdocs' ),
			'ai_actions_chatgpt'       => __( 'Open in ChatGPT', 'betterdocs' ),
			'ai_actions_claude'        => __( 'Open in Claude', 'betterdocs' ),
			'ai_actions_gemini'        => __( 'Open in Google AI Studio', 'betterdocs' ),
			'ai_actions_perplexity'    => __( 'Open in Perplexity', 'betterdocs' ),
			'ai_actions_grok'          => __( 'Open in Grok', 'betterdocs' )
		];

		// Registered in registry() priority order, which is the order they appear in
		// the dropdown, so the panel reads the same way the button does.
		foreach ( self::AI_ACTION_CONTROLS as $control ) {
			$this->add_control(
				$control,
				[
					'label'        => $action_labels[ $control ],
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => __( 'Yes', 'betterdocs' ),
					'label_off'    => __( 'No', 'betterdocs' ),
					'return_value' => 'yes',
					'default'      => $this->switcher_default( $control ),
					'condition'    => [ 'enable_ai_actions' => 'yes' ]
				]
			);
		}

		$this->end_controls_section();

		$this->start_controls_section(
			'section_reading_style',
			[
				'label'     => __( 'Reading Time', 'betterdocs' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => [ 'enable_reading_time' => 'yes' ]
			]
		);

		$this->add_responsive_control(
			'reading_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .reading-time' => 'background-color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'reading_text_color',
			[
				'label'     => __( 'Text Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .reading-time p' => 'color: {{VALUE}}'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'     => 'reading_text_typo',
				'selector' => '{{WRAPPER}} .reading-time p'
			]
		);

		$this->add_control(
			'reading_box_width',
			[
				'label'      => __( 'Width', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'max'  => 500,
						'step' => 1
					],
					'%'  => [
						'max'  => 100,
						'step' => 1
					]
				],
				'selectors'  => [
					'{{WRAPPER}} .reading-time' => 'width: {{SIZE}}px;'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name'     => 'reading_box_border',
				'label'    => esc_html__( 'Border', 'betterdocs' ),
				'selector' => '{{WRAPPER}} .reading-time'
			]
		);

		$this->add_control(
			'reading_box_border_radius',
			[
				'label'      => __( 'Border Radius', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'max'  => 500,
						'step' => 1
					],
					'%'  => [
						'max'  => 100,
						'step' => 1
					]
				],
				'selectors'  => [
					'{{WRAPPER}} .reading-time' => 'border-radius: {{SIZE}}px;'
				]
			]
		);

		$this->add_responsive_control(
			'reading_padding',
			[
				'label'      => __( 'Padding', 'betterdocs' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .reading-time' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};'
				]
			]
		);

		$this->add_responsive_control(
			'reading_margin',
			[
				'label'       => __( 'Margin', 'betterdocs' ),
				// The meta row zeroes its children's block margins with !important —
				// it has to, or a pill with a bottom margin inflates the flex line and
				// knocks the button off centre — so this control reaches the row.
				'description' => __( 'Applied to the meta row, so both halves move together.', 'betterdocs' ),
				'type'        => Controls_Manager::DIMENSIONS,
				'size_units'  => [ 'px', 'em', '%' ],
				'selectors'   => [
					'{{WRAPPER}} .betterdocs-doc-meta' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};'
				]
			]
		);

		$this->add_control(
			'clock_icon_width',
			[
				'label'      => __( 'Clock Icon Width', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'max'  => 500,
						'step' => 1
					],
					'%'  => [
						'max'  => 100,
						'step' => 1
					]
				],
				'selectors'  => [
					'{{WRAPPER}} .reading-time p svg' => 'width: {{SIZE}}px;'
				]
			]
		);

		$this->add_responsive_control(
			'clock_icon_color',
			[
				'label'     => esc_html__( 'Clock Icon Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .reading-time p svg path' => 'fill: {{VALUE}};'
				]
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_listen_style',
			[
				'label'     => __( 'Listen', 'betterdocs' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => [ 'enable_listen' => 'yes' ]
			]
		);

		$this->add_responsive_control(
			'listen_icon_size',
			[
				'label'      => __( 'Icon Size', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min'  => 10,
						'max'  => 40,
						'step' => 1
					]
				],
				// Every default in this section restates what the stylesheet already
				// draws, so the controls open on the real pill rather than on blanks
				// — and match the two sections above, which is the point of the trio.
				'default'    => [
					'unit' => 'px',
					'size' => 14
				],
				'selectors'  => [
					// The headset glyph on the collapsed pill only. The player's own
					// glyphs are 9px and 11px by design and stay that way — they have
					// to fit inside 20px circles.
					'{{WRAPPER}} .betterdocs-listen-trigger svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};'
				]
			]
		);

		$this->add_control(
			'listen_icon_color',
			[
				'label'     => esc_html__( 'Icon Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#667085',
				'selectors' => [
					// Stroked with `currentColor`, so a `color` on the svg is the
					// whole job.
					'{{WRAPPER}} .betterdocs-listen-trigger svg' => 'color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'listen_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#F9FAFB',
				'selectors' => [
					// On the pill itself, so the surface is one colour whichever state
					// it is in — the player is transparent and sits on top of it.
					'{{WRAPPER}} .betterdocs-listen' => 'background-color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'listen_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#667085',
				'selectors' => [
					'{{WRAPPER}} .betterdocs-listen-label' => 'color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'listen_accent_color',
			[
				'label'       => esc_html__( 'Player Accent Color', 'betterdocs' ),
				'description' => esc_html__( 'Used for the play button, the progress bar and its handle.', 'betterdocs' ),
				'type'        => Controls_Manager::COLOR,
				'default'     => '#1D2939',
				'selectors'   => [
					// One custom property for all three, which is how listen.scss
					// publishes them. Three separate controls would be three chances
					// for a play button that does not match its own progress bar.
					'{{WRAPPER}} .betterdocs-listen-player' => '--bd-listen-accent: {{VALUE}};'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'           => 'listen_typo',
				// On the pill, not the label: the player's readout is sized in `em`,
				// so this scales the two together. A font-size on the label alone
				// would leave the clock behind at 12.6px.
				'selector'       => '{{WRAPPER}} .betterdocs-listen',
				'fields_options' => [
					'typography'  => [ 'default' => 'custom' ],
					'font_size'   => [
						'default' => [
							'unit' => 'px',
							'size' => 14
						]
					],
					'font_weight' => [ 'default' => '400' ]
				]
			]
		);

		$this->add_responsive_control(
			'listen_padding',
			[
				'label'      => __( 'Padding', 'betterdocs' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				// Strings, not ints: Elementor's dimensions control compares the
				// incoming value against the field's string state, and an int default
				// lands in the panel as an empty box.
				'default'    => [
					'unit'     => 'px',
					'top'      => '5',
					'right'    => '10',
					'bottom'   => '5',
					'left'     => '10',
					'isLinked' => false
				],
				'selectors'  => [
					// On the trigger, which is the only element in flow and therefore
					// the one that gives the pill its size. The player is absolutely
					// positioned with `inset-block: 0` and inherits that height, which
					// is what keeps the promise that nothing below the pill moves when
					// it opens.
					'{{WRAPPER}} .betterdocs-listen-trigger' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name'     => 'listen_border',
				'label'    => esc_html__( 'Border', 'betterdocs' ),
				'selector' => '{{WRAPPER}} .betterdocs-listen'
			]
		);

		$this->add_control(
			'listen_border_radius',
			[
				'label'      => __( 'Border Radius', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'max'  => 100,
						'step' => 1
					]
				],
				'default'    => [
					'unit' => 'px',
					'size' => 16
				],
				'selectors'  => [
					// Both: the pill clips its contents, so the wrapper's corner is
					// what shows — but the trigger states its own corner so a theme's
					// `button { border-radius }` cannot square it off, and a radius
					// that stopped at the wrapper would let that square edge through.
					'{{WRAPPER}} .betterdocs-listen'         => 'border-radius: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .betterdocs-listen-trigger' => 'border-radius: {{SIZE}}{{UNIT}};'
				]
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_ai_actions_style',
			[
				'label'     => __( 'AI Actions', 'betterdocs' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => [ 'enable_ai_actions' => 'yes' ]
			]
		);

		$this->add_responsive_control(
			'ai_actions_icon_size',
			[
				'label'      => __( 'Icon Size', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min'  => 10,
						'max'  => 40,
						'step' => 1
					]
				],
				// Every default in this section restates what the stylesheet already
				// draws, so the controls open on the real button rather than on
				// blanks — and match the reading-time half above, which is the point
				// of the pair.
				'default'    => [
					'unit' => 'px',
					'size' => 14
				],
				'selectors'  => [
					'{{WRAPPER}} .betterdocs-ai-actions-primary svg, {{WRAPPER}} .betterdocs-ai-actions-toggle svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};'
				]
			]
		);

		$this->add_control(
			'ai_actions_icon_color',
			[
				'label'     => esc_html__( 'Icon Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#667085',
				'selectors' => [
					// Every icon AIActions::icon() draws is stroked with
					// `currentColor`, so this one declaration covers the copy glyph,
					// the copied tick, the failure mark and the caret.
					'{{WRAPPER}} .betterdocs-ai-actions-primary svg, {{WRAPPER}} .betterdocs-ai-actions-toggle svg' => 'color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'ai_actions_background_color',
			[
				'label'     => esc_html__( 'Background Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#F9FAFB',
				'selectors' => [
					'{{WRAPPER}} .betterdocs-ai-actions-primary, {{WRAPPER}} .betterdocs-ai-actions-toggle' => 'background-color: {{VALUE}};'
				]
			]
		);

		$this->add_control(
			'ai_actions_text_color',
			[
				'label'     => esc_html__( 'Text Color', 'betterdocs' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '#667085',
				'selectors' => [
					'{{WRAPPER}} .betterdocs-ai-actions-label' => 'color: {{VALUE}};'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'           => 'ai_actions_typo',
				'selector'       => '{{WRAPPER}} .betterdocs-ai-actions-label',
				'fields_options' => [
					'typography'  => [ 'default' => 'custom' ],
					'font_size'   => [
						'default' => [
							'unit' => 'px',
							'size' => 14
						]
					],
					'font_weight' => [ 'default' => '400' ]
				]
			]
		);

		$this->add_responsive_control(
			'ai_actions_padding',
			[
				'label'      => __( 'Padding', 'betterdocs' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				// Strings, not ints: Elementor's dimensions control compares the
				// incoming value against the field's string state, and an int
				// default lands in the panel as an empty box.
				'default'    => [
					'unit'     => 'px',
					'top'      => '5',
					'right'    => '10',
					'bottom'   => '5',
					'left'     => '10',
					'isLinked' => false
				],
				'selectors'  => [
					'{{WRAPPER}} .betterdocs-ai-actions-primary, {{WRAPPER}} .betterdocs-ai-actions-toggle' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};'
				]
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name'     => 'ai_actions_border',
				'label'    => esc_html__( 'Border', 'betterdocs' ),
				'selector' => '{{WRAPPER}} .betterdocs-ai-actions'
			]
		);

		$this->add_control(
			'ai_actions_border_radius',
			[
				'label'      => __( 'Border Radius', 'betterdocs' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', '%' ],
				'range'      => [
					'px' => [
						'max'  => 100,
						'step' => 1
					]
				],
				'default'    => [
					'unit' => 'px',
					'size' => 16
				],
				'selectors'  => [
					// All three, for the same reason the Customizer writes all three:
					// the wrapper cannot clip its halves — the dropdown is absolutely
					// positioned — so each half owns its own outer corners and a
					// radius set only on the wrapper leaves the pill's ends behind.
					'{{WRAPPER}} .betterdocs-ai-actions'         => 'border-radius: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .betterdocs-ai-actions-primary' => 'border-start-start-radius: {{SIZE}}{{UNIT}}; border-end-start-radius: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .betterdocs-ai-actions-toggle'  => 'border-start-end-radius: {{SIZE}}{{UNIT}}; border-end-end-radius: {{SIZE}}{{UNIT}};'
				]
			]
		);

		$this->end_controls_section();
	}

	public function view_params() {
		$attributes = $this->attributes;

		return [
			'attributes'          => $attributes,
			'enable_reading_time' => 'yes' === ( isset( $attributes['enable_reading_time'] ) ? $attributes['enable_reading_time'] : '' ),
			'enable_listen'       => 'yes' === ( isset( $attributes['enable_listen'] ) ? $attributes['enable_listen'] : '' ),
			'listen_args'         => $this->listen_args( $attributes ),
			'enable_ai_actions'   => 'yes' === ( isset( $attributes['enable_ai_actions'] ) ? $attributes['enable_ai_actions'] : '' ),
			'ai_actions_args'     => $this->ai_actions_args( $attributes ),
			'is_editing'          => self::is_editing()
		];
	}

	/**
	 * Per-instance overrides for Core\Listen::render().
	 *
	 * A blank label means "inherit", so it is omitted rather than passed as an empty
	 * string. `show_speed` is different: Elementor stores a switcher's off state as
	 * '', which is indistinguishable from "never set" — so it is only forwarded when
	 * the key exists, and an explicit '' then means off rather than inherit. That is
	 * the right reading here, because Elementor writes every registered control into
	 * `_elementor_data` on save.
	 *
	 * @param array $attributes
	 * @return array
	 */
	protected function listen_args( $attributes ) {
		$args = [ 'widget_type' => 'elementor' ];

		if ( ! empty( $attributes['listen_button_label'] ) ) {
			$args['button_label'] = (string) $attributes['listen_button_label'];
		}

		if ( isset( $attributes['listen_show_speed'] ) ) {
			$args['show_speed'] = 'yes' === $attributes['listen_show_speed'];
		}

		if ( ! empty( $attributes['listen_words_per_minute'] ) ) {
			$args['words_per_minute'] = (int) $attributes['listen_words_per_minute'];
		}

		return $args;
	}

	/**
	 * Per-instance overrides for Core\AIActions::render().
	 *
	 * A blank text control means "inherit", so it is omitted rather than passed as
	 * an empty string.
	 *
	 * @param array $attributes
	 * @return array
	 */
	protected function ai_actions_args( $attributes ) {
		$enabled = [];
		foreach ( self::AI_ACTION_CONTROLS as $id => $control ) {
			if ( isset( $attributes[ $control ] ) ) {
				$enabled[ $id ] = 'yes' === $attributes[ $control ];
			}
		}

		$args = [
			'widget_type'     => 'elementor',
			'enabled_actions' => $enabled
		];

		if ( ! empty( $attributes['ai_actions_button_label'] ) ) {
			$args['button_label'] = (string) $attributes['ai_actions_button_label'];
		}

		if ( ! empty( $attributes['ai_actions_prompt_template'] ) ) {
			$args['prompt_template'] = (string) $attributes['ai_actions_prompt_template'];
		}

		return $args;
	}

	/**
	 * Is Elementor drawing its own canvas rather than a real page?
	 *
	 * @return bool
	 */
	public static function is_editing() {
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return false;
		}

		$elementor = \Elementor\Plugin::$instance;

		return ( ! empty( $elementor->editor ) && $elementor->editor->is_edit_mode() )
			|| ( ! empty( $elementor->preview ) && $elementor->preview->is_preview_mode() );
	}

	protected function render_callback() {
		$this->views( 'widgets/reading-time' );
	}
}
