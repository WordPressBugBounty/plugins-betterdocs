import React from "react";
import { Header, Body, Footer, TitleCounts } from ".";
import { DocList, Title } from "./partials";

const HandbookCategory = (props) => {


    const {
        name,
        description,
        handbookthumbnail,
        count,
        link,
        widgetType,
        tagType,
        attributes
    } = props;

    const {
        showHeader = true,
        showThumbnail = true,
        showTitle = true,
        showDescription = true,
        showCount = true,
        showList = false,
        showButton = false,
        layout,
    } = props?.attributes;

    const CustomTag = tagType == "a" ? "a" : "div";

    const { blockId, buttonText } = attributes;

    const tagAttributes = {};

    if (tagType == "a") {
        tagAttributes["href"] = "#";
        tagAttributes[
            "className"
        ] = `betterdocs-single-category-wrapper ${widgetType} default`;
    } else {
        tagAttributes[
            "className"
        ] = `betterdocs-single-category-wrapper ${widgetType} default `;
        tagAttributes["data-id"] = blockId;
    }

    return (

        <article {...tagAttributes} >
            {
                showThumbnail && handbookthumbnail && (
                    <div className="betterdocs-term-img">
                        <img decoding="async" alt="" className="betterdocs-category-thumb-image" src={handbookthumbnail} />
                    </div>
                )

            }
            <div className="betterdocs-single-category-inner ">

                {
                    showHeader && (
                        <div className="betterdocs-category-header">
                            <div className="betterdocs-category-header-inner">
                                <div className="betterdocs-dynamic-wrapper betterdocs-category-title-counts">
                                    {
                                        showTitle && (
                                            <a href={link}>
                                                <Title title={name} titleTag={attributes?.titleTag ?? 'h2'} />
                                            </a>

                                        )
                                    }
                                    {
                                        showCount && count && (
                                            <div data-count={count} className="betterdocs-category-items-counts" >
                                                <span>{count} </span>
                                            </div>
                                        )

                                    }
                                </div>

                                {
                                    showDescription && description && (
                                        <p className="betterdocs-category-description">
                                            {description}
                                        </p>
                                    )

                                }

                            </div>
                        </div>

                    )
                }
                {showList && <Body {...props} />}
                {showButton && <Footer {...props} widgetType={widgetType} />}


            </div>
        </article>


    );
};

export default HandbookCategory;
