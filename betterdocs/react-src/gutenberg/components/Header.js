import React from 'react'
import { Counts, Icon, Title, GridCounts } from './partials';
import DownArrow from './partials/DownArrow';
import IconLayoutTwo from './partials/IconLayoutTwo';
import TitleLayoutTwo from './partials/TitleLayoutTwo';


const TitleCounts = ({ count, name, widgetType, attributes, showTitle, showCount, titleLink, showArrow, subcategoriesCount, docsCount, icon, lastUpdatedTime }) => {
    const { layout, sidebar_layout } = attributes;
    if( widgetType == 'category-grid' && layout === 'layout-2' ) {
        return (
            <>
                {showCount && <GridCounts count={count} attributes={attributes} />}
                {showTitle && <Title title={name} titleTag={ attributes?.titleTag && !titleLink ? 'h2' : 'a' } />}
            </>
        )
    }
    if( widgetType == 'category-box' && layout == 'layout-3' ) {
        return (
            <div className="betterdocs-dynamic-wrapper betterdocs-category-title-counts">
                {showTitle && <Title title={name} titleTag={ attributes?.titleTag && !titleLink ? 'h2' : 'a' } />}
                {showCount && <Counts count={count} attributes={attributes} />}
            </div>
        )
    }

    if( widgetType == 'category-box' &&  layout == 'layout-4' ) {
        return  <>
                    {attributes?.showIcon && <IconLayoutTwo icon={icon}/>}
                    <TitleLayoutTwo attributes={attributes} titleName={name} subcategoriesCount={subcategoriesCount} docsCount={docsCount} lastUpdatedTime={lastUpdatedTime}/>
                </>
    }

    // Layout 8 (Slate Layout) - Hide count for sidebar
    if( widgetType == 'category-grid' && sidebar_layout === 'layout-8' ) {
        return (
            <>
                {showTitle && <Title title={name} titleTag={ attributes?.titleTag } />}
                {showArrow && <DownArrow/>}
            </>
        )
    }

    return (
        <>
            {showTitle && <Title title={name} titleTag={ attributes?.titleTag } />}
            {showCount && <Counts count={count} attributes={attributes} />}
            {showArrow && <DownArrow/>}
        </>
    )
}

const Header = ({ attributes, thumbnail, name, count, widgetType, onClick, titleLink = false, subcategories_count = undefined, total_docs_count = undefined, last_updated_time = undefined }) => {
    const {
        showTitle = true,
        showIcon = true,
        showCount = true,
        showArrow = false,
        showLastUpdatedTime,
        layout,
        sidebar_layout
    } = attributes;

    let wrapperProps = {
        className:'betterdocs-category-header'
    };

    if(typeof onClick == 'function' ) {
        wrapperProps.onClick = onClick;
    }

    return (
        <div {...wrapperProps}>
            <div className='betterdocs-category-header-inner'>
                { widgetType == 'category-grid' && layout !== 'layout-2' && layout !== 'layout-6' && layout !== 'layout-7' && sidebar_layout !== 'layout-8' && showIcon && <Icon icon={thumbnail} /> }
                { widgetType == 'category-grid' && layout == 'layout-7' && showIcon && <IconLayoutTwo icon={thumbnail}/>}
                { widgetType == 'category-box' && layout != 'layout-4' && showIcon && <Icon icon={thumbnail} /> }

                <TitleCounts
                    showTitle={showTitle}
                    showCount={showCount}
                    subcategoriesCount={subcategories_count}
                    docsCount={total_docs_count}
                    name={name}
                    count={count}
                    widgetType={widgetType}
                    attributes={attributes}
                    titleLink={titleLink}
                    showArrow={showArrow}
                    icon={thumbnail}
                    lastUpdatedTime={last_updated_time}
                />
            </div>
        </div>
    )
}

export default Header
