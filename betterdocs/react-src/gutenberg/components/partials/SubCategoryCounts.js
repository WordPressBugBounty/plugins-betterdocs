import { __, _n, sprintf } from "@wordpress/i18n";

const SubCategoryCounts = ({attributes, subcategoriesCount, docsCount}) => {
    return (
        <div data-count={docsCount} className="betterdocs-sub-category-items-counts">
            {subcategoriesCount != 0 && (
                <span>
                    {sprintf(
                        _n('%d Sub Category', '%d Sub Categories', subcategoriesCount, 'betterdocs'),
                        subcategoriesCount
                    )}
                </span>
            )}
            {subcategoriesCount != 0 && <span>|</span>}
            <span>
                {sprintf(
                    _n('%d doc', '%d docs', docsCount, 'betterdocs'),
                    docsCount
                )}
            </span>
        </div>
    );
};

export default SubCategoryCounts;
