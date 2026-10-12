import { __ } from '@wordpress/i18n';

// Container
export const CONTAINER_MARGIN = 'containerMargin';
export const CONTAINER_PADDING = 'containerPadding';
export const CONTAINER_BACKGROUND = 'containerBackground';

// Grid
export const GRID_COLUMNS = 'gridColumns';
export const GRID_SPACE = 'gridSpace';
export const GRID_MARGIN = 'gridMargin';
export const GRID_PADDING = 'gridPadding';
export const GRID_BACKGROUND = 'gridBackground';
export const GRID_BORDER = 'gridBorder';

// Category Title
export const TITLE_MARGIN = 'titleMargin';
export const TITLE_PADDING = 'titlePadding';
export const TITLE_BACKGROUND = 'titleBackground';
export const TITLE_BORDER = 'titleBorder';

// Article List
export const LIST_MARGIN = 'listMargin';
export const LIST_PADDING = 'listPadding';
export const LIST_BACKGROUND = 'listBackground';
export const LIST_BORDER = 'listBorder';

// Layout Options
export const LAYOUT_OPTIONS = [
    { label: __('Layout 3 (Slate)', 'betterdocs'), value: 'layout-3' }
];

// Grid Column Options
export const GRID_COLUMN_OPTIONS = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 }
];

// Title Tag Options
export const TITLE_TAG_OPTIONS = [
    { label: 'H1', value: 'h1' },
    { label: 'H2', value: 'h2' },
    { label: 'H3', value: 'h3' },
    { label: 'H4', value: 'h4' },
    { label: 'H5', value: 'h5' },
    { label: 'H6', value: 'h6' }
];

// Order Options
export const ORDER_OPTIONS = [
    { label: __('ASC', 'betterdocs'), value: 'asc' },
    { label: __('DESC', 'betterdocs'), value: 'desc' }
];

// Order By Options
export const ORDER_BY_OPTIONS = [
    { label: __('Name', 'betterdocs'), value: 'name' },
    { label: __('Slug', 'betterdocs'), value: 'slug' },
    { label: __('Term Group', 'betterdocs'), value: 'term_group' },
    { label: __('ID', 'betterdocs'), value: 'id' },
    { label: __('Description', 'betterdocs'), value: 'description' },
    { label: __('Count', 'betterdocs'), value: 'count' },
    { label: __('BetterDocs Order', 'betterdocs'), value: 'doc_category_order' }
];

// Posts Order By Options (for Grid List Docs)
export const POSTS_ORDER_BY_OPTIONS = [
    { label: __('Doc ID', 'betterdocs'), value: 'id' },
    { label: __('Doc Author', 'betterdocs'), value: 'author' },
    { label: __('Title', 'betterdocs'), value: 'title' },
    { label: __('Date', 'betterdocs'), value: 'date' },
    { label: __('Last Modified Date', 'betterdocs'), value: 'modified' },
    { label: __('Parent Id', 'betterdocs'), value: 'parent' },
    { label: __('Random', 'betterdocs'), value: 'rand' },
    { label: __('Comment Count', 'betterdocs'), value: 'comment_count' },
    { label: __('Menu Order', 'betterdocs'), value: 'menu_order' },
    { label: __('BetterDocs Order', 'betterdocs'), value: 'betterdocs_order' }
];
