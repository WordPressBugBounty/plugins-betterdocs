import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { safeHTML } from "@wordpress/dom";
import { DocIcon, ArrowDown } from "../icon/DocIcon";
import DocIconSleek from "../icon/DocIconSleek";
import React from "react";

import Inspector from "./inspector";

import { applyFilters } from "@wordpress/hooks";

import {
    usePreviewDeviceType,
    useDuplicateBlockIdFix,
    useStyleSheets,
} from "../../../hooks";
import cssProperties from "./cssProperties";
import { useEffect } from "react";

const BLOCK_PREFIX = "betterdocs-archive-list";
const edit = ({ attributes, setAttributes, isSelected, clientId }) => {
    let { blockId, nested_subcategory, layout, list_icon, listIconImageUrl, pagination, listEntryHeadingTag } =
        attributes;

    /**
     * resOption: __experimentalPreviewDeviceType()
     * Set Responsive Option
     */
    usePreviewDeviceType(setAttributes);
    useDuplicateBlockIdFix(BLOCK_PREFIX, blockId, clientId, setAttributes);
    const { properties, htmlAttributes, styleTag } = useStyleSheets({
        properties: cssProperties({ blockId, list_icon, layout }),
        setAttributes,
        attributes,
    });

    const blockProps = useBlockProps({
        className: `bd-guten-block-main-parent-wrapper`,
    });

    useEffect(() => {
        if (listIconImageUrl?.length > 0) {
            setAttributes({ list_icon: "" });
        }
    }, [listIconImageUrl]);

    /**
     * To be used only for layout 3
     *
     * @returns string
     */
    function getCurrentDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date();
        return currentDate.toLocaleDateString('en-US', options);
    }

    return (
        <>
            {isSelected && (
                <Inspector
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
            <div {...blockProps}>
                {styleTag()}
                {layout == "layout-1" && (
                    <div
                        className={`betterdocs-content-area block-archive-list ${safeHTML(
                            blockId,
                        )} `}
                    >
                        <div className="betterdocs-content-inner-area">
                            <div
                                className="betterdocs-entry-title editor-mode"
                                style={{ margin: "0px" }}
                            >
                                {React.createElement(
                                    listEntryHeadingTag,
                                    { className: "betterdocs-entry-heading" },
                                    "Archive Title"
                                )}
                                <p style={{ margin: "0px" }}>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Duis at augue a arcu
                                    efficitur interdum.
                                </p>
                            </div>
                            <div className="betterdocs-entry-body betterdocs-taxonomy-doc-category" style={{width:'100%'}}>
                                <ul className="betterdocs-articles-list">
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 1</a>
                                    </li>
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 2</a>
                                    </li>
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 3</a>
                                    </li>
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 4</a>
                                    </li>
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 5</a>
                                    </li>
                                    <li>
                                        {list_icon?.length > 0 &&
                                        listIconImageUrl?.length == 0 ? (
                                            <i className={list_icon}></i>
                                        ) : listIconImageUrl?.length > 0 ? (
                                            <img src={listIconImageUrl} />
                                        ) : listIconImageUrl?.length == 0 &&
                                          list_icon?.length == 0 &&
                                          betterDocsBlocksHelper?.docsIcon
                                              ?.length > 0 ? (
                                            <img
                                                src={
                                                    betterDocsBlocksHelper?.docsIcon
                                                }
                                            />
                                        ) : (
                                            <DocIcon />
                                        )}
                                        <a href="#">Docs Title 6</a>
                                    </li>
                                    {nested_subcategory && (
                                        <li className="betterdocs-nested-category-wrapper">
                                            <span className="betterdocs-nested-category-title">
                                                {<ArrowDown />}
                                                <a href="#">Subcatgory</a>
                                            </span>
                                            <ul
                                                className="betterdocs-nested-category-list"
                                                style={{ display: "block" }}
                                            >
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 1
                                                    </a>
                                                </li>
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 2
                                                    </a>
                                                </li>
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 3
                                                    </a>
                                                </li>
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 4
                                                    </a>
                                                </li>
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 5
                                                    </a>
                                                </li>
                                                <li>
                                                    {list_icon?.length > 0 &&
                                                    listIconImageUrl?.length ==
                                                        0 ? (
                                                        <i
                                                            className={
                                                                list_icon
                                                            }
                                                        ></i>
                                                    ) : listIconImageUrl?.length >
                                                      0 ? (
                                                        <img
                                                            src={
                                                                listIconImageUrl
                                                            }
                                                        />
                                                    ) : listIconImageUrl?.length ==
                                                          0 &&
                                                      list_icon?.length == 0 &&
                                                      betterDocsBlocksHelper
                                                          ?.docsIcon?.length >
                                                          0 ? (
                                                        <img
                                                            src={
                                                                betterDocsBlocksHelper?.docsIcon
                                                            }
                                                        />
                                                    ) : (
                                                        <DocIcon />
                                                    )}
                                                    <a href="#">
                                                        Nested Docs Title 6
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    )}
                                </ul>
                                { pagination &&
                                    <div className="betterdocs-pagination">
                                        <ul>
                                            <li className="prev">
                                                <a href="#">❮</a>
                                            </li>
                                            <li className="active">
                                                <a href="#">1</a>
                                            </li>
                                            <li className="">
                                                <a href="#">2</a>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )}
                {layout == "layout-2" &&
                    applyFilters("archiveLayoutTwo", "", blockId, pagination)}
                {layout == "layout-3" && (
                    <div className={`doc-archive-list-layout-3 ${blockId}`}>
                        <div className="betterdocs-title-excerpt-lists">
                            <div className="betterdocs-title-excerpt-list">
                                {React.createElement(
                                    listEntryHeadingTag,
                                    { className: "betterdocs-entry-title" },
                                    <>
                                        <span>
                                            <DocIconSleek/>
                                        </span>
                                        <a href="#">
                                            Dummy Title 1
                                        </a>
                                    </>
                                )}
                                <span className="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <p>
                                    This is a dummy excerpt...
                                </p>
                            </div>
                            <div className="betterdocs-title-excerpt-list">
                                {React.createElement(
                                    listEntryHeadingTag,
                                    { className: "betterdocs-entry-title" },
                                    <>
                                        <span>
                                            <DocIconSleek/>
                                        </span>
                                        <a href="#">
                                            Dummy Title 2
                                        </a>
                                    </>
                                )}
                                <span className="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <p>
                                    This is a dummy excerpt...
                                </p>
                            </div>
                            <div className="betterdocs-title-excerpt-list">
                                <h2 className="betterdocs-entry-title">
                                    <span>
                                        <DocIconSleek/>
                                    </span>
                                    <a href="#">
                                        Dummy Title 2
                                    </a>
                                </h2>
                                <span class="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <p>
                                    This is a dummy excerpt...
                                </p>
                            </div>
                            <div class="betterdocs-title-excerpt-list">
                                <h2 className="betterdocs-entry-title">
                                    <span>
                                        <DocIconSleek/>
                                    </span>
                                    <a href="#">
                                        Dummy Title 3
                                    </a>
                                </h2>
                                <span class="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <p>
                                    This is a dummy excerpt...
                                </p>
                            </div>
                            <div class="betterdocs-title-excerpt-list">
                                <h2 className="betterdocs-entry-title">
                                    <span>
                                        <DocIconSleek/>
                                    </span>
                                    <a href="#">
                                        Dummy Title 3
                                    </a>
                                </h2>
                                <span class="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <p>This is a dummy excerpt...</p>
                            </div>
                        </div>
                        { pagination &&
                            <div className="betterdocs-pagination">
                                <ul>
                                    <li className="prev">
                                        <a href="#">❮</a>
                                    </li>
                                    <li className="active">
                                        <a href="#">1</a>
                                    </li>
                                    <li className="">
                                        <a href="#">2</a>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                )}
                {layout == "layout-4" && (
                    <div className={`doc-archive-list-layout-4 ${blockId}`}>
                        <div className="betterdocs-title-excerpt-lists betterdocs-title-excerpt-grid">
                            <div className="betterdocs-title-excerpt-list">
                                <span className="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <h2>
                                    <a href="#">
                                        Dummy Title 1
                                    </a>
                                </h2>
                                <p>
                                    This is a dummy excerpt with limited words...
                                </p>
                            </div>
                            <div className="betterdocs-title-excerpt-list">
                                <span className="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <h2>
                                    <a href="#">
                                        Dummy Title 2
                                    </a>
                                </h2>
                                <p>
                                    This is a dummy excerpt with limited words...
                                </p>
                            </div>
                            <div className="betterdocs-title-excerpt-list">
                                <span className="update-date">
                                    {`${'Last Updated: ' + getCurrentDate()}`}
                                </span>
                                <h2>
                                    <a href="#">
                                        Dummy Title 3
                                    </a>
                                </h2>
                                <p>
                                    This is a dummy excerpt with limited words...
                                </p>
                            </div>
                        </div>
                        {pagination &&
                            <div className="betterdocs-pagination">
                                <ul>
                                    <li>
                                        <a href="#">1</a>
                                    </li>
                                    <li>
                                        <a href="#">2</a>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                )}
            </div>
        </>
    );
};

export default edit;
