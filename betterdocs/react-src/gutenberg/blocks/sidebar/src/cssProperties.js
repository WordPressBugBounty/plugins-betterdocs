import * as SIDEBAR from './constants';
import * as SIDEBAR_TYPO from './typographyPrefixConstants';
import { addProperty } from '../../../helpers/helper';


export default ( { blockId, listIcon, sidebar_layout } ) => {
    const conatinerWrapper = `.${blockId}.betterdocs-sidebar`;
    const conatinerWrapperTwo = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content`;
    const mainWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-category-grid-wrapper`;
    const imgWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-category-icon .betterdocs-category-icon-img`;
    const titleSelector = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(a)`
    const activeTitleSelector = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper.active .betterdocs-single-category-inner .betterdocs-category-header`;
    const nonActiveTitleSelector = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const countWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts span`;
    const countOuterWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts`;
    const titleWrapperLayoutOne = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const listWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li:not(.betterdocs-nested-category-wrapper) a`;
    const topListWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li`;
    const listIconWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li img`;
    const subListTitleWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;
    const subListWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapper = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;

    const titleWrapperLayoutTwo        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const titleSelectorLayoutTwo       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(a)`;
    const titleSelectorOuterTwo        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const mainWrapperLayoutTwo         = `.${blockId}.betterdocs-sidebar.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-4 .betterdocs-category-grid-wrapper`
    const listWrapperLayoutTwo         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li a`;
    const topListWrapperLayoutTwo      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li`;
    const listIconWrapperLayoutTwo     = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li img`;
    const subListWrapperLayoutTwo      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4  .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapperLayoutTwo  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;
    const subListTitleWrapperLayoutTwo = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-4 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;

    const titleWrapperLayoutThree           = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const titleSelectorLayoutThree          = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(a)`;
    const mainWrapperLayoutThree            = `.${blockId}.betterdocs-sidebar.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-5.betterdocs-background .betterdocs-category-grid-wrapper`;
    const activeTitleSelectorThree          = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-sidebar-content .betterdocs-single-category-wrapper.active .betterdocs-single-category-inner .betterdocs-category-header`;
    const titleSelectorTwoLayoutThree       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const listWrapperLayoutThree            = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li a`;
    const topListWrapperLayoutThree         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li`;
    const listIconWrapperLayoutThree        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li img`;
    const subListWrapperLayoutThree         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapperLayoutThree     = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;
    const subListTitleWrapperLayoutThree    = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-5 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;

    const titleWrapperLayoutFour        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content.betterdocs-category-sidebar .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const titleSelectorLayoutFour       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content.betterdocs-category-sidebar .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(a)`;
    const mainWrapperLayoutFour         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content.betterdocs-category-sidebar, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-body, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-category-list-wrapper`;
    const titleSelectorOuterFour        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content.betterdocs-category-sidebar .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const listWrapperLayoutFour         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li a`;
    const topListWrapperLayoutFour      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-single-category-wrapper .betterdocs-articles-list li`;
    const listIconWrapperLayoutFour     = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-articles-list li img`;
    const subListWrapperLayoutFour      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapperLayoutFour  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;
    const subListTitleWrapperLayoutFour = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-sidebar-content .betterdocs-category-list-wrapper .betterdocs-category-list-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;

    const titleWrapperLayoutFive        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-category-header`;
    const titleSelectorOuterFive        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-category-header`;
    const titleSelectorLayoutFive       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-category-header .betterdocs-category-title:not(a)`;
    const titleSelectorTwoLayoutFive    = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-sidebar-content .betterdocs-single-category-wrapper.active .betterdocs-single-category-inner .betterdocs-category-header`;
    const mainWrapperLayoutFive         = `.${blockId}.betterdocs-sidebar.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-3 .betterdocs-category-grid-wrapper, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-sidebar-content .betterdocs-body`;
    const listWrapperLayoutFive         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li a`;
    const topListWrapperLayoutFive      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-articles-list li`;
    const listIconWrapperLayoutFive     = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li img`;
    const subListWrapperLayoutFive      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapperLayoutFive  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;
    const subListTitleWrapperLayoutFive = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-3 .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;

    const titleSelectorLayoutSix       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title:not(a)`;
    const titleSelectorSixLayout       = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list .betterdocs-category-header`;
    const titleWrapperLayoutSix        = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-list-inner .betterdocs-category-header`
    const mainWrapperLayoutSix         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper`;
    const listWrapperLayoutSix         = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list li a`;
    const topListWrapperLayoutSix      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list li`;
    const listIconWrapperLayoutSix     = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list li svg, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list li i, .${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list li img`;
    const subListWrapperLayoutSix      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const subListIconWrapperLayoutSix  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li svg`;
    const subListTitleWrapperLayoutSix = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;
    const countWrapperLayout6          = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6 .betterdocs-sidebar-list-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts`;
    const countWrapperLayout6Typo      = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6 .betterdocs-sidebar-list-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts span`;
    const activeCountBackColorWrapperLayout6 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts`;
    const activeCountWrapperLayout6 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-6 .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts span`;
    const activeTitleLayout6    = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-category-header`;
    const activeListLayout6 = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-body`;
    const stickyTOCWrapper = `.${blockId}.sticky-toc-block-wrapper .sticky-toc-container, .${blockId} .sticky-toc-container`;

    const boxWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper`;
    const boxIconWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-folder-icon`;
    const boxTitleWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-title`;
    const boxTitleOuterWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const countWrapperLayout7   = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts span`;
    const countOuterWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-category-items-counts`;
    const docListWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li a`;
    const docSubListTitleWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`;
    const docSubListTitleWrapper2Layout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a`
    const docSubListWrapperLayout7     =  `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a`;
    const docSubListIconWrapperLayout7  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title .betterdocs-category-icon .betterdocs-folder-icon`;

    const sidebarSeachIconLayout7 = `.${blockId} .betterdocs-search-popup .betterdocs-searchform .betterdocs-searchform-input-wrap svg`;
    const sidebarSearchLayout7Placeholder = `.${blockId} .betterdocs-search-popup .betterdocs-searchform .betterdocs-searchform-input-wrap .betterdocs-search-command`;
    const sidebarSearchBackgroundWrapper = `.${blockId} .betterdocs-search-popup .betterdocs-searchform`;

    const modalSearchFieldWrapper = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header svg g path`;
    const modalSearchFieldWrapperTwo = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header`;
    const modalSearchFieldWrapperThree = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-searchform-input-wrap .betterdocs-search-field`;

    const modalSearchCategoryWrapper = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-header .betterdocs-select-option-wrapper .betterdocs-form-select`;

    const modalSearchContentTabsWrapper = `.${blockId}  .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span`;
    const modalSearchContentTabsWrapperTwo = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items span svg`;
    const modalSearchContentTabsWrapperThree  = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-info-tab .betterdocs-tab-items`;

    const modalSearchContentTabsListWrapper = `${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main h4`;
    const modalSearchContentTabsListWrapperTwo = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list`;
    const modalSearchContentTabsListWrapperThree = `.${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-main svg`;

    const modalSearchContentListCategoryWrapper = `${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub h5`;
    const modalSearchContentListCategoryWrapperTwo = `${blockId} .betterdocs-search-wrapper .betterdocs-search-details .betterdocs-search-content .betterdocs-search-items-wrapper .betterdocs-search-item-content .betterdocs-search-item-list .content-sub svg`;
    const sidebarLayout7ListIconSelector           = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header .betterdocs-category-header-inner .betterdocs-folder-icon img`;

    const listIconWrapperLayout7 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-7 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list li img`;

    // Layout 8 (Slate Layout) Selectors
    const boxWrapperLayout8 = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content`;
    const boxTitleWrapperLayout8 = `.${blockId}.betterdocs-sidebar-layout-8 .betterdocs-category-title`;
    const countWrapperLayout8 = `.${blockId}.betterdocs-sidebar-layout-8 .betterdocs-category-items-counts span`;
    const countOuterWrapperLayout8 = `.${blockId}.betterdocs-sidebar-layout-8 .betterdocs-category-items-counts`;
    const docListWrapperLayout8 = `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:not(:has(>ul)) a`;
    const TitleWrapperLayout8 = `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-category-header`;
    const docSubListTitleWrapperLayout8 = `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:has(>ul) > a`;
    const docSubListWrapperLayout8 = `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li ul li a`;

	const sidebarListBackgroundColor 		 = `.${blockId} .betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper .betterdocs-body`;
	const sideabarListLayout6BackgroundColor = `.${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-category-header, .${blockId}.betterdocs-sidebar .betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list-inner .betterdocs-sidebar-list.betterdocs-sidebar-layout-6.active .betterdocs-sidebar-list-inner .betterdocs-body`;
	const sidebatListLayout4BackgroundColor  = `.${blockId}.betterdocs-sidebar.betterdocs-sidebar-layout-2 .betterdocs-body`;

    return [
        addProperty('dimension', SIDEBAR.CONTAINER_PADDING, {
            args: { styleFor: "padding" },
            cssSelector: sidebar_layout == 'layout-8' ? conatinerWrapper : conatinerWrapperTwo

        }),
        addProperty('dimension', SIDEBAR.CONTAINER_MARGIN, {
            args: { styleFor: "margin" },
            cssSelector: conatinerWrapper
        }),
        addProperty('background', SIDEBAR.CONTAINER_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: sidebar_layout == 'layout-8' ? conatinerWrapper+', '+conatinerWrapperTwo : conatinerWrapperTwo
        }),
        addProperty('responsive',  SIDEBAR.CONTAINER_HEIGHT, {
            args: { property: "height", controlName: SIDEBAR.CONTAINER_HEIGHT },
            cssSelector: conatinerWrapper
        }),
        addProperty('responsive',  SIDEBAR.CONTAINER_WIDTH, {
            args: { property: "width", controlName: SIDEBAR.CONTAINER_WIDTH },
            cssSelector: conatinerWrapper
        }),
        addProperty('responsive',  SIDEBAR.SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7, {
            args: { property: "height", controlName: SIDEBAR.SIDEBAR_SEARCH_IMAGE_SIZE_HEIGHT_LAYOUT_7 },
            cssSelector: sidebarLayout7ListIconSelector
        }),
        addProperty('responsive',  SIDEBAR.SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7, {
            args: { property: "width", controlName: SIDEBAR.SIDEBAR_SEARCH_IMAGE_SIZE_WIDTH_LAYOUT_7 },
            cssSelector: sidebarLayout7ListIconSelector
        }),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_PADDING_LAYOUT_8 : SIDEBAR.BOX_PADDING_LAYOUT_1), {
            args: { styleFor: "padding" },
            cssSelector: sidebar_layout == 'layout-7' ? boxWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxWrapperLayout8 : mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix)
        }),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_MARGIN_LAYOUT_8 : SIDEBAR.BOX_MARGIN_LAYOUT_1), {
            args: { styleFor: "margin" },
            cssSelector: sidebar_layout == 'layout-7' ? boxWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxWrapperLayout8 : mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix)
        }),
        // addProperty('responsive',  SIDEBAR.BOX_HEIGHT_LAYOUT_1, {
        //     args: { property: "height", controlName: SIDEBAR.BOX_HEIGHT_LAYOUT_1 },
        //     cssSelector: mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix
        // }),
        addProperty('responsive', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_WIDTH_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_WIDTH_LAYOUT_8 : SIDEBAR.BOX_WIDTH_LAYOUT_1), {
            args: { property: "width", controlName: sidebar_layout == 'layout-7' ? SIDEBAR.BOX_WIDTH_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_WIDTH_LAYOUT_8 : SIDEBAR.BOX_WIDTH_LAYOUT_1)},
            cssSelector: sidebar_layout == 'layout-7' ? boxWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxWrapperLayout8 : mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix)
        }),
        addProperty('responsive', sidebar_layout != 'layout-7' ? SIDEBAR.BOX_IMG_SIZE_LAYOUT_1 : SIDEBAR.BOX_IMG_SIZE_LAYOUT_7, {
            args: { property: "height", controlName:sidebar_layout != 'layout-7' ? SIDEBAR.BOX_IMG_SIZE_LAYOUT_1 : SIDEBAR.BOX_IMG_SIZE_LAYOUT_7 },
            cssSelector: sidebar_layout != 'layout-7' ? imgWrapper : boxIconWrapperLayout7
        }),
        addProperty('responsive', SIDEBAR.BOX_IMG_SIZE_LAYOUT_7, {
            args: { property: "width", controlName: SIDEBAR.BOX_IMG_SIZE_LAYOUT_7 },
            cssSelector: boxIconWrapperLayout7
        }),
        addProperty('responsive', SIDEBAR.BOX_IMG_SIZE_LAYOUT_7_HEIGHT, {
            args: { property: "height", controlName: SIDEBAR.BOX_IMG_SIZE_LAYOUT_7_HEIGHT },
            cssSelector: boxIconWrapperLayout7
        }),
        addProperty('background', sidebar_layout != 'layout-7' ? SIDEBAR.BOX_TITLE_BACKGROUND_LAYOUT_1 : SIDEBAR.BOX_TITLE_BACKGROUND_LAYOUT_7, {
            args: { noOverlay: true },
            cssSelector: sidebar_layout != 'layout-7' ? mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix : boxWrapperLayout7
        }),
        addProperty('background', sidebar_layout == 'layout-8' ? SIDEBAR.BOX_TITLE_BACKGROUND_LAYOUT_8 : '', {
            args: { noOverlay: true },
            cssSelector: boxWrapperLayout8
        }),
        addProperty('border', sidebar_layout == 'layout-8' ? SIDEBAR.BOX_SHADOW_LAYOUT_8 : '', {
            args: { noShadow: true },
            cssSelector: boxWrapperLayout8
        }),
        addProperty('background',  sidebar_layout == 'layout-8' ? SIDEBAR.TITLE_BACKGROUND_LAYOUT_8 :  '', {
            args: { noOverlay: true },
            cssSelector: TitleWrapperLayout8
        }),
        addProperty('background',  sidebar_layout != 'layout-7' ? SIDEBAR.BOX_TITLE_BACKGROUND :  SIDEBAR.BOX_TITLE_BACKGROUND_7, {
            args: { noOverlay: true },
            cssSelector: sidebar_layout != 'layout-7' ? titleWrapperLayoutOne+', '+titleWrapperLayoutTwo+', '+titleWrapperLayoutThree+', '+titleWrapperLayoutFour+', '+titleWrapperLayoutFive+', '+titleWrapperLayoutSix : boxTitleOuterWrapperLayout7
        }),
        addProperty('border', sidebar_layout != 'layout-7' ? SIDEBAR.BOX_SHADOW_LAYOUT_1 : SIDEBAR.BOX_SHADOW_LAYOUT_7, {
            args: { noShadow: true },
            cssSelector: sidebar_layout != 'layout-7' ? mainWrapper+', '+mainWrapperLayoutTwo+', '+mainWrapperLayoutThree+', '+mainWrapperLayoutFour+', '+mainWrapperLayoutFive+', '+mainWrapperLayoutSix : boxWrapperLayout7
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_title_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_title_color_layout_8' : 'box_title_color_layout_1'), {
            cssSelector: sidebar_layout == 'layout-7' ? boxTitleWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxTitleWrapperLayout8 : titleSelector + ', '+titleSelectorLayoutTwo+', '+titleSelectorLayoutThree+', '+titleSelectorLayoutSix+', '+titleSelectorLayoutFour+', '+titleSelectorLayoutFive)
        }),
        addProperty('background', SIDEBAR.BOX_ACTIVE_TITLE_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: sidebar_layout !== 'layout-8' ? activeTitleSelector +', '+activeTitleSelectorThree+', '+titleSelectorTwoLayoutFive : ''   //only applicable for sidebar layout 1, 3, 5
        }),
		addProperty('background', SIDEBAR.BOX_DOC_LIST_BACKGROUND_COLOR, {
            args: { noOverlay: true },
            cssSelector:sidebarListBackgroundColor+', '+sideabarListLayout6BackgroundColor+', '+sidebatListLayout4BackgroundColor   //only applicable for sidebar all doc list background
        }),
        addProperty('color', 'box_title_active_border_color_layout_1', {
            args: { customProperty:'border-color' },
            cssSelector: activeTitleSelector+', '+titleSelectorTwoLayoutFive
        }),
        addProperty('typography', sidebar_layout == 'layout-7' ? SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_8 : SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_1), {
            args: sidebar_layout == 'layout-7' ? {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_7,
            } : (sidebar_layout == 'layout-8' ? {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_8,
            } : {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.BOX_TITLE_TYPO_LAYOUT_1,
            }),
            cssSelector: sidebar_layout == 'layout-7' ? boxTitleWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxTitleWrapperLayout8 : titleSelector+', '+titleSelectorLayoutTwo + ', '+titleSelectorLayoutThree + ', '+titleSelectorLayoutFour+', '+titleSelectorLayoutFive+', '+titleSelectorLayoutSix)
        }),

        // Arrow Properties for layouts 2, 3, and 8
        ...(sidebar_layout == 'layout-2' ? [
            addProperty('responsive', SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_2, {
                args: { property: "height", controlName: SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_2 },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_color_layout_2', {
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_hover_color_layout_2', {
                args: { hover: 'title_arrow_hover_color_layout_2' },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse:hover`
            }),
        ] : (sidebar_layout == 'layout-3' ? [
            addProperty('responsive', SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_3, {
                args: { property: "height", controlName: SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_3 },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_color_layout_3', {
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_hover_color_layout_3', {
                args: { hover: 'title_arrow_hover_color_layout_3' },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse:hover`
            }),
        ] : (sidebar_layout == 'layout-8' ? [
            addProperty('responsive', SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_8, {
                args: { property: "height", controlName: SIDEBAR.TITLE_ARROW_ICON_SIZE_LAYOUT_8 },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_color_layout_8', {
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse`
            }),
            addProperty('color', 'title_arrow_hover_color_layout_8', {
                args: { hover: 'title_arrow_hover_color_layout_8' },
                cssSelector: `.${blockId}.betterdocs-sidebar .betterdocs-category-header-inner .betterdocs-category-collapse:hover`
            }),
        ] : []))),

        // Doc Sub List Arrow Properties
        addProperty('responsive', SIDEBAR.DOC_SUB_LIST_ARROW_ICON_SIZE, {
            args: { property: "height", controlName: SIDEBAR.DOC_SUB_LIST_ARROW_ICON_SIZE },
            cssSelector: `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title svg`
        }),
        addProperty('color', 'doc_sub_list_arrow_color', {
            cssSelector: `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title svg`
        }),
        addProperty('color', 'doc_sub_list_arrow_hover_color', {
            args: { hover: 'doc_sub_list_arrow_hover_color' },
            cssSelector: `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title:hover svg`
        }),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_TITLE_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_TITLE_PADDING_LAYOUT_8 : SIDEBAR.BOX_TITLE_PADDING_LAYOUT_1), {
            args: { styleFor: "padding" },
            cssSelector: sidebar_layout == 'layout-7' ? boxTitleWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxTitleWrapperLayout8 : titleSelector + ', '+titleSelectorLayoutTwo+', '+titleSelectorTwoLayoutThree +', '+titleSelectorLayoutFour +', '+titleSelectorLayoutFive+', '+titleSelectorLayoutSix)
        }),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_TITLE_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_TITLE_MARGIN_LAYOUT_8 : SIDEBAR.BOX_TITLE_MARGIN_LAYOUT_1), {
            args: { styleFor: "margin" },
            cssSelector: sidebar_layout == 'layout-7' ? boxTitleWrapperLayout7 : (sidebar_layout == 'layout-8' ? boxTitleWrapperLayout8 : titleSelector + ', '+titleSelectorLayoutTwo+', '+titleSelectorTwoLayoutThree +', '+titleSelectorLayoutFour +', '+titleSelectorLayoutFive+', '+titleSelectorLayoutSix)
        }),
        ...(sidebar_layout != 'layout-8' ? [
            addProperty('border', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_TITLE_BORDER_LAYOUT_7 : SIDEBAR.BOX_TITLE_BORDER_LAYOUT_1, {
                args: { noShadow: true, noShdowHover:true },
                cssSelector: sidebar_layout == 'layout-7' ? boxTitleOuterWrapperLayout7 : nonActiveTitleSelector +', '+titleSelectorTwoLayoutThree+', '+titleSelectorSixLayout+', '+titleSelectorOuterTwo+', '+titleSelectorOuterFour+', '+titleSelectorOuterFive
            }),
        ] : []),
        addProperty('typography', sidebar_layout == 'layout-7' ? SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_8 : SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_1), {
            args: sidebar_layout == 'layout-7' ? {
                defaultFontSize: 12,
                prefixConstant: SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_7,
            } : (sidebar_layout == 'layout-8' ? {
                defaultFontSize: 15,
                prefixConstant: SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_8,
            } : {
                defaultFontSize: 15,
                prefixConstant: SIDEBAR_TYPO.BOX_COUNT_TYPO_LAYOUT_1,
            }),
            cssSelector: sidebar_layout == 'layout-7' ? countWrapperLayout7 : (sidebar_layout == 'layout-8' ? countWrapperLayout8 : countWrapper + ', '+countWrapperLayout6Typo)
        }),
        addProperty('background', SIDEBAR.BOX_COUNT_BACKGROUND_LAYOUT_1, {
            args: { noOverlay: true },
            cssSelector: countOuterWrapper
        }),
        addProperty('background', SIDEBAR.BOX_COUNT_ACTIVE_BACKGROUND_COLOR_LAYOUT_6, {
            args: { noOverlay: true },
            cssSelector: activeCountBackColorWrapperLayout6
        }),
        addProperty('background', SIDEBAR.BOX_COUNT_BACKGROUND_LAYOUT_6, {
            args: { noOverlay: true },
            cssSelector: countWrapperLayout6
        }),
        addProperty('background', SIDEBAR.BOX_COUNT_BACKGROUND_LAYOUT_7, {
            args: { noOverlay: true },
            cssSelector: countOuterWrapperLayout7+', '+countWrapperLayout7
        }),
        addProperty('background', SIDEBAR.BOX_COUNT_BACKGROUND_LAYOUT_8, {
            args: { noOverlay: true },
            cssSelector: countOuterWrapperLayout8+', '+countWrapperLayout8
        }),
        addProperty('border', SIDEBAR.BOX_COUNT_BORDER_LAYOUT_6, {
            args: { noShadow: true, noShdowHover:true },
            cssSelector: countWrapperLayout6
        }),
        addProperty('border', SIDEBAR.BOX_COUNT_BORDER_LAYOUT_7, {
            args: { noShadow: true, noShdowHover:true },
            cssSelector: countOuterWrapperLayout7
        }),

        addProperty('border', SIDEBAR.BOX_ACTIVE_TITLE_BORDER_WIDTH_LAYOUT_6, {
            args: { noShadow: true, noShdowHover:true, noBdrHover:true },
            cssSelector: activeTitleLayout6
        }),
        addProperty('border', SIDEBAR.BOX_ACTIVE_LIST_BORDER_WIDTH_LAYOUT_6, {
            args: { noShadow: true, noShdowHover:true, noBdrHover:true },
            cssSelector: activeListLayout6
        }),
        addProperty('color', 'box_layout_1_count_color', {
            cssSelector: countWrapper
        }),
        addProperty('color', 'box_layout_6_count_color', {
            cssSelector: countWrapperLayout6Typo
        }),
        addProperty('color', 'box_layout_7_count_color', {
            cssSelector: countWrapperLayout7
        }),
        addProperty('color', 'box_layout_8_count_color', {
            cssSelector: countWrapperLayout8
        }),
        addProperty('color', 'box_layout_6_count_active_color', {
            cssSelector: activeCountWrapperLayout6
        }),
        ...(sidebar_layout != 'layout-8' ? [
            addProperty('border', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_COUNT_BORDER_LAYOUT_7 : SIDEBAR.BOX_COUNT_BORDER_LAYOUT_1, {
                args: { noShadow: true, noShdowHover:true },
                cssSelector: sidebar_layout == 'layout-7' ? countOuterWrapperLayout7 : countOuterWrapper
            }),
        ] : []),
        addProperty('typography', sidebar_layout == 'layout-7' ? SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_8 : SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_1), {
            args: sidebar_layout == 'layout-7' ? {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_7,
            } : (sidebar_layout == 'layout-8' ? {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_8,
            } : {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_LIST_TYPO_LAYOUT_1,
            }),
            cssSelector: sidebar_layout == 'layout-7' ? docListWrapperLayout7 : (sidebar_layout == 'layout-8' ? docListWrapperLayout8 : listWrapper +', '+listWrapperLayoutTwo+', '+listWrapperLayoutThree+', '+listWrapperLayoutFour+', '+listWrapperLayoutFive+', '+listWrapperLayoutSix)
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_List_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_List_color_layout_8' : 'box_doc_List_color_layout_1'), {
            cssSelector: sidebar_layout == 'layout-7' ? docListWrapperLayout7 : (sidebar_layout == 'layout-8' ? docListWrapperLayout8 : listWrapper+', '+listWrapperLayoutTwo+', '+listWrapperLayoutThree+', '+listWrapperLayoutFour+', '+listWrapperLayoutFive+', '+listWrapperLayoutSix) //correct format
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_List_hover_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_List_hover_color_layout_8' : 'box_doc_List_hover_color_layout_1'), {
            args: { hover: sidebar_layout == 'layout-7' ? 'box_doc_List_hover_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_List_hover_color_layout_8' : 'box_doc_List_hover_color_layout_1') },
            cssSelector: sidebar_layout == 'layout-7' ? docListWrapperLayout7 + ':hover' : (sidebar_layout == 'layout-8' ? `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:not(:has(>ul)) a:hover` : listWrapper+':hover, '+listWrapperLayoutTwo+':hover, '+listWrapperLayoutThree+':hover, '+listWrapperLayoutFour+':hover, '+listWrapperLayoutFive+':hover, '+listWrapperLayoutSix+':hover ')  //correct format
        }),
        ...(sidebar_layout == 'layout-8' ? [
            addProperty('background-color', 'box_doc_List_hover_bg_color_layout_8', {
                args: { hover: 'box_doc_List_hover_bg_color_layout_8' },
                cssSelector: `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:not(:has(>ul)) a:hover`
            }),
        ] : []),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_DOC_LIST_PADDING_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_DOC_LIST_PADDING_LAYOUT_8 : SIDEBAR.BOX_DOC_LIST_PADDING_LAYOUT_1), {
            args: { styleFor: "padding" },
            cssSelector: sidebar_layout == 'layout-7' ? docListWrapperLayout7 : (sidebar_layout == 'layout-8' ? `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:not(:has(>ul)) a` : topListWrapper+', '+topListWrapperLayoutTwo+', '+topListWrapperLayoutThree+', '+topListWrapperLayoutFour+', '+topListWrapperLayoutFive+', '+topListWrapperLayoutSix)
        }),
        addProperty('dimension', sidebar_layout == 'layout-7' ? SIDEBAR.BOX_DOC_LIST_MARGIN_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR.BOX_DOC_LIST_MARGIN_LAYOUT_8 : SIDEBAR.BOX_DOC_LIST_MARGIN_LAYOUT_1), {
            args: { styleFor: "margin" },
            cssSelector: sidebar_layout == 'layout-7' ? docListWrapperLayout7 : (sidebar_layout == 'layout-8' ? `.${blockId}.betterdocs-full-sidebar-left.betterdocs-sidebar-layout-8 .betterdocs-sidebar-content .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-body .betterdocs-articles-list li:not(:has(>ul)) a` : topListWrapper+', '+topListWrapperLayoutTwo+', '+topListWrapperLayoutThree+', '+topListWrapperLayoutFour+', '+topListWrapperLayoutFive+', '+topListWrapperLayoutSix)
        }),
        addProperty(listIcon != '' ? 'color' : 'fill', 'box_doc_List_icon_color_layout_1', {
            args: { hover: 'box_doc_List_icon_color_layout_1' },
            cssSelector: listIconWrapper + ', '+listIconWrapperLayoutTwo+', '+listIconWrapperLayoutThree+', '+listIconWrapperLayoutFour+', '+listIconWrapperLayoutFive+', '+listIconWrapperLayoutSix
        }),
        addProperty('responsive',  SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_1, {
            args: { property: "height", controlName: SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_1 },
            cssSelector: listIconWrapper+', '+listIconWrapperLayoutTwo+', '+listIconWrapperLayoutThree+', '+listIconWrapperLayoutFour+', '+listIconWrapperLayoutFive+', '+listIconWrapperLayoutSix
        }),
        addProperty('responsive',  SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_1, {
            args: { property: "width", controlName: SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_1 },
            cssSelector: listIconWrapper+', '+listIconWrapperLayoutTwo+', '+listIconWrapperLayoutThree+', '+listIconWrapperLayoutFour+', '+listIconWrapperLayoutFive+', '+listIconWrapperLayoutSix
        }),
        addProperty('responsive',  SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_7, {
            args: { property: "width", controlName: SIDEBAR.BOX_DOC_LIST_ICON_SIZE_LAYOUT_7 },
            cssSelector: listIconWrapperLayout7
        }),
        addProperty('dimension', SIDEBAR.BOX_DOC_LIST_ICON_SPACING_LAYOUT_1, {
            args: { styleFor: "margin" },
            cssSelector: listIconWrapper+', '+listIconWrapperLayoutTwo+', '+listIconWrapperLayoutThree+', '+listIconWrapperLayoutFour+', '+listIconWrapperLayoutFive+', '+listIconWrapperLayoutSix
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_sub_List_title_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_sub_List_title_color_layout_8' : 'box_doc_sub_List_title_color_layout_1'), {
            cssSelector: sidebar_layout == 'layout-7' ? docSubListTitleWrapperLayout7 +', '+docSubListTitleWrapper2Layout7 : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a` : subListTitleWrapper+', '+subListTitleWrapperLayoutTwo+', '+subListTitleWrapperLayoutThree+', '+subListTitleWrapperLayoutFour+', '+subListTitleWrapperLayoutFive+', '+subListTitleWrapperLayoutSix) //correct format
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_sub_List_title_hover_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_sub_List_title_hover_color_layout_8' : 'box_doc_sub_List_title_hover_color_layout_1'), {
            args: { hover: sidebar_layout == 'layout-7' ? "box_doc_sub_List_title_hover_color_layout_7" : (sidebar_layout == 'layout-8' ? "box_doc_sub_List_title_hover_color_layout_8" : "box_doc_sub_List_title_hover_color_layout_1") },
            cssSelector: sidebar_layout == 'layout-7' ? docSubListTitleWrapperLayout7 + ':hover, '+docSubListTitleWrapper2Layout7 +':hover ' : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a:hover` : subListTitleWrapper+':hover, '+subListTitleWrapperLayoutTwo+':hover, '+subListTitleWrapperLayoutThree+':hover, '+subListTitleWrapperLayoutFour+':hover, '+subListTitleWrapperLayoutFive+':hover, '+subListTitleWrapperLayoutSix+':hover ') //correct format
        }),
        addProperty('typography', sidebar_layout == 'layout-7' ? SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_8 : SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_1), {
            args: sidebar_layout == 'layout-7' ? {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_7,
            } : (sidebar_layout == 'layout-8' ? {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_8,
            } : {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TITLE_TYPO_LAYOUT_1,
            }),
            cssSelector: sidebar_layout == 'layout-7' ? docSubListTitleWrapperLayout7 +','+docSubListTitleWrapper2Layout7 : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-title a` : subListTitleWrapper+', '+subListTitleWrapperLayoutTwo+', '+subListTitleWrapperLayoutThree+', '+subListTitleWrapperLayoutFour+', '+subListTitleWrapperLayoutFive+', '+subListTitleWrapperLayoutSix)
        }),
        addProperty('typography', sidebar_layout == 'layout-7' ? SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_7 : (sidebar_layout == 'layout-8' ? SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_8 : SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_1), {
            args: sidebar_layout == 'layout-7' ? {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_7,
            } : (sidebar_layout == 'layout-8' ? {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_8,
            } : {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.BOX_DOC_SUB_LIST_TYPO_LAYOUT_1,
            }),
            cssSelector: sidebar_layout == 'layout-7' ? docSubListWrapperLayout7 : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a` : subListWrapper +', '+subListWrapperLayoutTwo+', '+subListWrapperLayoutThree+', '+subListWrapperLayoutFour+', '+ subListWrapperLayoutFive+', '+subListWrapperLayoutSix)
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_sub_List_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_sub_List_color_layout_8' : 'box_doc_sub_List_color_layout_1'), {
            cssSelector: sidebar_layout == 'layout-7' ? docSubListWrapperLayout7 : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a` : subListWrapper+', '+subListWrapperLayoutTwo+', '+subListWrapperLayoutThree+', '+subListWrapperLayoutFour+', '+subListWrapperLayoutFive+', '+subListWrapperLayoutSix) //correct format
        }),
        addProperty('color', sidebar_layout == 'layout-7' ? 'box_doc_sub_List_hover_color_layout_7' : (sidebar_layout == 'layout-8' ? 'box_doc_sub_List_hover_color_layout_8' : 'box_doc_sub_List_hover_color_layout_1'), {
            args: { hover: sidebar_layout == 'layout-7' ? 'box_doc_sub_List_hover_color_layout_7' : (sidebar_layout == 'layout-8' ? "box_doc_sub_List_hover_color_layout_8" : "box_doc_sub_List_hover_color_layout_1") },
            cssSelector: sidebar_layout == 'layout-7' ? docSubListWrapperLayout7 +':hover ' : (sidebar_layout == 'layout-8' ? `.${blockId} .betterdocs-single-category-wrapper .betterdocs-single-category-inner .betterdocs-articles-list .betterdocs-nested-category-wrapper .betterdocs-nested-category-list li a:hover` : subListWrapper+':hover, '+subListWrapperLayoutTwo+':hover, '+subListWrapperLayoutThree+':hover, '+subListWrapperLayoutFour+':hover, '+subListWrapperLayoutFive+':hover, '+subListWrapperLayoutSix+':hover ') //correct format
        }),
        addProperty('responsive',  SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1, {
            args: { property: "height", controlName: SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1 },
            cssSelector: subListIconWrapper+', '+subListIconWrapperLayoutTwo+', '+subListIconWrapperLayoutThree+', '+subListIconWrapperLayoutFour+', '+subListIconWrapperLayoutFive+', '+subListIconWrapperLayoutSix
        }),
        addProperty('responsive',  SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1, {
            args: { property: "width", controlName: SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_1 },
            cssSelector: subListIconWrapper+', '+subListIconWrapperLayoutTwo+', '+subListIconWrapperLayoutThree+', '+subListIconWrapperLayoutFour+', '+subListIconWrapperLayoutFive+', '+subListIconWrapperLayoutSix
        }),
        addProperty('responsive', SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7, {
            args: { property: "height", controlName: SIDEBAR.BOX_DOC_LIST_SUB_ICON_SIZE_LAYOUT_7  },
            cssSelector: docSubListIconWrapperLayout7
        }),
        addProperty('responsive', SIDEBAR.STICKY_TOC_WIDTH, {
            args:{property:"width", controlName:SIDEBAR.STICKY_TOC_WIDTH},
            cssSelector:stickyTOCWrapper
        }),
        addProperty('z-index', 'stickyTOCZIndex', {
            cssSelector:stickyTOCWrapper
        }),
        addProperty('responsive', SIDEBAR.SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT, {
            args:{property:"height", controlName: SIDEBAR.SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_HEIGHT},
            cssSelector:sidebarSeachIconLayout7
        }),
        addProperty('responsive', SIDEBAR.SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH, {
            args:{property:"width", controlName: SIDEBAR.SIDEBAR_SEARCH_MAGNIFIER_SEARCH_LAYOUT_7_WIDTH},
            cssSelector:sidebarSeachIconLayout7
        }),
        addProperty('color', 'sidebar_search_layout_7_placeholder_color', {
            cssSelector:sidebarSearchLayout7Placeholder
        }),
        addProperty('background', SIDEBAR.SIDEBAR_SEARCH_BACKGROUND_LAYOUT_7, {
            args: { noOverlay: true },
            cssSelector: sidebarSearchBackgroundWrapper
        }),
        addProperty('fill',  'sidebarSearchModalMagnifierColor', {
            cssSelector:modalSearchFieldWrapper
        }),
        addProperty('background', SIDEBAR.SEARCH_MODAL_FIELD_BACKGROUND, {
            args: { noOverlay: true },
            cssSelector: modalSearchFieldWrapperTwo
        }),
        addProperty('typography', SIDEBAR_TYPO.SEARCH_MODAL_FIELD_TYPO, {
            args: {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.SEARCH_MODAL_FIELD_TYPO,
            },
            cssSelector: modalSearchFieldWrapperThree
        }),
        addProperty('color',  'sidebarSearchModalFieldColor', {
            cssSelector:modalSearchFieldWrapperThree
        }),
        addProperty('color',  'sidebarSearchModalFieldPlaceholderColor', {
            cssSelector:modalSearchFieldWrapperThree +'::placeholder'
        }),
        addProperty('color',  'sidebarSearchModalCategoryColor', {
            cssSelector:modalSearchCategoryWrapper
        }),
        addProperty('typography', SIDEBAR_TYPO.SEARCH_MODAL_CATEGORY_FIELD_TYPO, {
            args: {
                defaultFontSize: 16,
                prefixConstant: SIDEBAR_TYPO.SEARCH_MODAL_CATEGORY_FIELD_TYPO,
            },
            cssSelector: modalSearchCategoryWrapper
        }),
        addProperty('typography', SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_TYPO, {
            args: {
                defaultFontSize: 14,
                prefixConstant: SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_TYPO,
            },
            cssSelector: modalSearchContentTabsWrapper
        }),
        addProperty('responsive', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT, {
            args: { property: "height", controlName:  SIDEBAR.SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_HEIGHT },
            cssSelector:modalSearchContentTabsWrapperTwo
        }),
        addProperty('responsive', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH, {
            args: { property: "width", controlName:  SIDEBAR.SEARCH_MODAL_CONTENT_TABS_ICON_SIZE_WIDTH },
            cssSelector:modalSearchContentTabsWrapperTwo
        }),
        addProperty('border', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_BORDER, {
            args: { noShadow: true },
            cssSelector: modalSearchContentTabsWrapperThree
        }),
        addProperty('typography', SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_LIST_TYPO, {
            args: {
                defaultFontSize: 16,
                prefixConstant:SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_LIST_TYPO
            },
            cssSelector: modalSearchContentTabsListWrapper
        }),
        addProperty('color',  'sidebarSearchModalContentTabsListColor', {
            cssSelector:modalSearchContentTabsListWrapper
        }),
        addProperty('responsive', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE, {
            args: { property: "height", controlName:  SIDEBAR.SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE },
            cssSelector:modalSearchContentTabsListWrapperThree
        }),
        addProperty('border', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_LIST_BORDER, {
            args: { noShadow: true },
            cssSelector: modalSearchContentTabsListWrapperTwo
        }),
        addProperty('typography', SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO, {
            args: {
                defaultFontSize: 14,
                prefixConstant:SIDEBAR_TYPO.SEARCH_MODAL_CONTENT_TABS_LIST_CATEGORY_TYPO
            },
            cssSelector:modalSearchContentListCategoryWrapper
        }),
        addProperty('color',  'sidebarSearchModalContentTabsListCategoryColor', {
            cssSelector:modalSearchContentListCategoryWrapper
        }),
        addProperty('responsive', SIDEBAR.SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE, {
            args: { property: "height", controlName:  SIDEBAR.SEARCH_MODAL_CONTENT_TABS_LIST_ICON_SIZE },
            cssSelector:modalSearchContentListCategoryWrapperTwo
        }),
    ];
}
