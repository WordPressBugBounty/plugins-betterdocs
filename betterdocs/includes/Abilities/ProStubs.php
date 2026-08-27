<?php
/**
 * Specifications for the Pro-only tools Free advertises.
 *
 * @package BetterDocs
 * @since   4.9.0
 */

namespace WPDeveloper\BetterDocs\Abilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The five Pro tools, described in full by Free.
 *
 * Free registers a {@see StubAbility} from each of these specs so the tool
 * catalog is the same shape on every BetterDocs site: same names, same labels,
 * same input schemas, same capabilities. Only the behaviour differs — without
 * Pro the tool answers with a typed refusal that says exactly what is missing.
 *
 * Pro's registrar returns real abilities carrying these same ids, and
 * `AbilitiesRegistrar::build_abilities()` replaces the stubs by id. Keeping the
 * specs in one class rather than inline in the registrar is what lets a unit
 * test assert that Pro's ids and Free's stub ids never drift apart.
 *
 * @since 4.9.0
 */
final class ProStubs {

	/**
	 * Every Pro tool spec, in catalog order.
	 *
	 * Input schemas are the **real** ones, so a client can validate a call
	 * before Pro exists. They deliberately do not set `additionalProperties`:
	 * an unknown field should still reach the stub and come back as the
	 * `pro_required` refusal that explains the site, not as a schema error.
	 *
	 * @since 4.9.0
	 *
	 * @return array[] List of specs for {@see StubAbility::__construct()}.
	 */
	public static function specs(): array {
		return [
			[
				'id'            => 'betterdocs-pro/create-knowledge-base',
				'label'         => __( 'Create knowledge base', 'betterdocs' ),
				'description'   => __( 'Create a knowledge base. Groups doc categories under a named knowledge base; pass categories by id or name to file them into it.', 'betterdocs' ),
				'feature'       => __( 'Knowledge bases', 'betterdocs' ),
				'capability'    => 'manage_knowledge_base_terms',
				'kb_feature'    => true,
				'input_schema'  => [
					'type'       => 'object',
					'properties' => [
						'name'        => [
							'type'        => 'string',
							'description' => __( 'Name of the knowledge base.', 'betterdocs' )
						],
						'slug'        => [
							'type'        => 'string',
							'description' => __( 'URL slug. Derived from the name when omitted.', 'betterdocs' )
						],
						'description' => [
							'type'        => 'string',
							'description' => __( 'Short description shown on the knowledge-base listing.', 'betterdocs' )
						],
						'categories'  => self::categories_property()
					],
					'required'   => [ 'name' ]
				],
				'output_schema' => self::knowledge_base_schema(),
				'annotations'   => self::annotations( false, false, false, 2.0 )
			],
			[
				'id'            => 'betterdocs-pro/update-knowledge-base',
				'label'         => __( 'Update knowledge base', 'betterdocs' ),
				'description'   => __( 'Update a knowledge base. Rename it, change its slug or description, or replace the doc categories filed under it.', 'betterdocs' ),
				'feature'       => __( 'Knowledge bases', 'betterdocs' ),
				'capability'    => 'edit_knowledge_base_terms',
				'kb_feature'    => true,
				'input_schema'  => [
					'type'       => 'object',
					'properties' => [
						'id'          => [
							'type'        => 'integer',
							'description' => __( 'Knowledge-base term id.', 'betterdocs' )
						],
						'name'        => [
							'type'        => 'string',
							'description' => __( 'New name.', 'betterdocs' )
						],
						'slug'        => [
							'type'        => 'string',
							'description' => __( 'New URL slug.', 'betterdocs' )
						],
						'description' => [
							'type'        => 'string',
							'description' => __( 'New description.', 'betterdocs' )
						],
						'categories'  => self::categories_property()
					],
					'required'   => [ 'id' ]
				],
				'output_schema' => self::knowledge_base_schema(),
				'annotations'   => self::annotations( false, false, true, 2.0 )
			],
			[
				'id'            => 'betterdocs-pro/delete-knowledge-base',
				'label'         => __( 'Delete knowledge base', 'betterdocs' ),
				'description'   => __( 'Delete a knowledge base. The doc categories filed under it are unfiled, never deleted.', 'betterdocs' ),
				'feature'       => __( 'Knowledge bases', 'betterdocs' ),
				'capability'    => 'delete_knowledge_base_terms',
				'kb_feature'    => true,
				'input_schema'  => [
					'type'       => 'object',
					'properties' => [
						'id' => [
							'type'        => 'integer',
							'description' => __( 'Knowledge-base term id.', 'betterdocs' )
						]
					],
					'required'   => [ 'id' ]
				],
				'output_schema' => [
					'type'       => 'object',
					'properties' => [
						'id'      => [ 'type' => 'integer' ],
						'name'    => [ 'type' => 'string' ],
						'slug'    => [ 'type' => 'string' ],
						'deleted' => [ 'type' => 'boolean' ]
					]
				],
				'annotations'   => self::annotations( false, true, false, 2.0 )
			],
			[
				'id'            => 'betterdocs-pro/list-knowledge-bases',
				'label'         => __( 'List knowledge bases', 'betterdocs' ),
				'description'   => __( 'List the knowledge bases on this site, each with the doc categories filed under it.', 'betterdocs' ),
				'feature'       => __( 'Knowledge bases', 'betterdocs' ),
				'capability'    => 'edit_docs',
				'kb_feature'    => true,
				'input_schema'  => [
					'type'       => 'object',
					'properties' => [
						'search'   => [
							'type'        => 'string',
							'description' => __( 'Match knowledge bases whose name contains this text.', 'betterdocs' )
						],
						'page'     => [
							'type'        => 'integer',
							'minimum'     => 1,
							'description' => __( 'Page of results, 1-based.', 'betterdocs' )
						],
						'per_page' => [
							'type'        => 'integer',
							'minimum'     => 1,
							'maximum'     => 100,
							'description' => __( 'Results per page, up to 100.', 'betterdocs' )
						]
					],
					// See GetStatus::get_input_schema(): without a top-level
					// default an all-optional ability rejects a call that passes
					// no arguments at all.
					'default'    => []
				],
				'output_schema' => [
					'type'       => 'object',
					'properties' => [
						'items'       => [
							'type'  => 'array',
							'items' => self::knowledge_base_schema()
						],
						'total'       => [ 'type' => 'integer' ],
						'total_pages' => [ 'type' => 'integer' ],
						'page'        => [ 'type' => 'integer' ],
						'per_page'    => [ 'type' => 'integer' ]
					]
				],
				'annotations'   => self::annotations( true, false, true, 1.0 )
			],
			[
				'id'            => 'betterdocs-pro/get-analytics',
				'label'         => __( 'Get analytics', 'betterdocs' ),
				'description'   => __( 'Report site-wide BetterDocs analytics: views and reactions, the leading docs, categories and knowledge bases, and what visitors searched for.', 'betterdocs' ),
				'feature'       => __( 'Site-wide analytics', 'betterdocs' ),
				'capability'    => 'read_docs_analytics',
				// Analytics does not depend on Multiple Knowledge Base, so the
				// setting must never appear in its way: its only blocking states
				// are "Pro is not here" and "Pro is not active".
				'kb_feature'    => false,
				'input_schema'  => [
					'type'       => 'object',
					'properties' => [
						'start_date' => self::date_property( __( 'First day to report on, as YYYY-MM-DD.', 'betterdocs' ) ),
						'end_date'   => self::date_property( __( 'Last day to report on, as YYYY-MM-DD.', 'betterdocs' ) ),
						'per_page'   => [
							'type'        => 'integer',
							'minimum'     => 1,
							'maximum'     => 100,
							'description' => __( 'How many rows each leading-items list returns, up to 100.', 'betterdocs' )
						]
					],
					'default'    => []
				],
				'output_schema' => [
					'type'       => 'object',
					'properties' => [
						'overview'                => [ 'type' => 'object' ],
						'leading_docs'            => [ 'type' => 'array' ],
						'leading_categories'      => [ 'type' => 'array' ],
						'leading_knowledge_bases' => [ 'type' => 'array' ],
						'search'                  => [ 'type' => 'object' ]
					]
				],
				'annotations'   => self::annotations( true, false, true, 1.0 )
			]
		];
	}

	/**
	 * The ids Free advertises, in catalog order. Pro's registrar must return
	 * these exact ids for the by-id replacement to work.
	 *
	 * @since 4.9.0
	 *
	 * @return string[]
	 */
	public static function ids(): array {
		return array_column( self::specs(), 'id' );
	}

	/**
	 * The `categories` input property, shared by create and update: doc
	 * categories addressed by id or by name.
	 *
	 * @since 4.9.0
	 *
	 * @return array
	 */
	private static function categories_property(): array {
		return [
			'type'        => 'array',
			'items'       => [ 'type' => [ 'integer', 'string' ] ],
			'description' => __( 'Doc categories to file under this knowledge base, by term id or by name.', 'betterdocs' )
		];
	}

	/**
	 * A YYYY-MM-DD date input property.
	 *
	 * `pattern` rather than `format`: the REST schema validator WordPress uses
	 * for abilities knows `date-time`, not `date`, and silently ignores formats
	 * it does not know.
	 *
	 * @since 4.9.0
	 *
	 * @param string $description Field description.
	 * @return array
	 */
	private static function date_property( string $description ): array {
		return [
			'type'        => 'string',
			'pattern'     => '^\\d{4}-\\d{2}-\\d{2}$',
			'description' => $description
		];
	}

	/**
	 * The shape one knowledge base comes back as.
	 *
	 * Permissive on purpose: the Abilities API validates an ability's output
	 * against this schema, so nothing is `required` and no
	 * `additionalProperties: false` is set — a Pro build that returns one extra
	 * field must not turn a successful call into a validation error.
	 *
	 * @since 4.9.0
	 *
	 * @return array
	 */
	private static function knowledge_base_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'id'          => [ 'type' => 'integer' ],
				'name'        => [ 'type' => 'string' ],
				'slug'        => [ 'type' => 'string' ],
				'description' => [ 'type' => 'string' ],
				'categories'  => [ 'type' => 'array' ]
			]
		];
	}

	/**
	 * Annotation block in the Abilities API's spelling.
	 *
	 * @since 4.9.0
	 *
	 * @param bool  $read_only   Whether the tool only reads.
	 * @param bool  $destructive Whether the tool destroys data.
	 * @param bool  $idempotent  Whether repeating the call is harmless.
	 * @param float $priority    Ordering hint; 1.0 for reads, 2.0 for writes.
	 * @return array
	 */
	private static function annotations( bool $read_only, bool $destructive, bool $idempotent, float $priority ): array {
		return [
			'readonly'      => $read_only,
			'destructive'   => $destructive,
			'idempotent'    => $idempotent,
			'priority'      => $priority,
			'openWorldHint' => false
		];
	}
}
