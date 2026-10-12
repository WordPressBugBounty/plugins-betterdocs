import React from "react";
import { Header, Body, Footer } from ".";
import { DocList } from './partials';
import IconLayoutTwo from "./partials/IconLayoutTwo";
import TitleLayoutTwo from "./partials/TitleLayoutTwo";

const SingleCategory = (props) => {
    const { widgetType } = props;
    let {
        showHeader = true,
        showList = false,
        showButton = false,
        layout,
        sidebar_layout
    } = props?.attributes;

    let wrapperProps = {
        className: `betterdocs-single-category-wrapper ${widgetType} ${layout} ${props?.id == props?.activeId ? ( layout == 'layout-7' ? 'active default show' : 'active' ) : ''}`,
    };

    let secondWrapperProps = {
        className: 'betterdocs-single-category-inner'
    };

    if( layout == 'layout-4' ) {
        wrapperProps['className'] = `category-box ${props?.slug} layout-4`;
        wrapperProps['data-id'] = props?.id;
    }

    if( sidebar_layout == 'layout-6' ) {
        wrapperProps['className']       = `betterdocs-sidebar-list betterdocs-sidebar-layout-6 default ${props?.id == props?.activeId ? 'active' : ''}`;
        secondWrapperProps['className'] = 'betterdocs-sidebar-list-inner';
        props.attributes.showIcon = false;
    }

	if( widgetType == 'category-grid' && props?.attributes?.postsPerPage >= props?.count ){
		showButton = false;
	}

    return (
        <div {...wrapperProps}>
            {layout !== 'layout-3' ? (
                <div {...secondWrapperProps}>
                    {showHeader && (
                        <Header {...props} />
                    )}
					{showList && <Body {...props} />}
                    {showButton && <Footer {...props} />}
                </div>
            ) : (
                <>
                    {showHeader && (
                        <div className="betterdocs-category-header">
							<div className="betterdocs-category-header-inner">
								{props?.attributes?.showIcon && (
									<IconLayoutTwo
										icon={props?.thumbnail}
										categoryIcon={props?.attributes?.categoryIcon || 'folder'}
									/>
								)}
								<TitleLayoutTwo
									attributes={props?.attributes}
									titleName={props?.name}
									subcategoriesCount={props?.subcategories_count}
									docsCount={props?.total_docs_count}
									lastUpdatedTime={props?.last_updated_time}
								/>
							</div>
						</div>
                    )}
					{showList && <DocList {...props} />}
                    {showButton && <Footer {...props} />}
                </>
            )}
        </div>
    );
};

export default SingleCategory;
