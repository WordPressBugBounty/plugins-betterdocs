import Title from "./Title";
import SubCategoryCounts from "./SubCategoryCounts";
import LastUpdatedTime from "./LastUpdatedTime";


const TitleLayoutTwo = ({attributes, titleName, subcategoriesCount, docsCount, lastUpdatedTime}) => {
    return <div className="betterdocs-dynamic-wrapper betterdocs-category-title-counts">
                    {attributes?.showTitle && <Title title={titleName} titleTag={attributes?.titleTag} />}
                    {attributes?.showCount && <SubCategoryCounts attributes={attributes} subcategoriesCount={subcategoriesCount} docsCount={docsCount}/>}
                    {attributes?.showLastUpdatedTime && <LastUpdatedTime attributes={attributes} lastUpdatedTime={lastUpdatedTime}/>}
            </div>
}

export default TitleLayoutTwo;
