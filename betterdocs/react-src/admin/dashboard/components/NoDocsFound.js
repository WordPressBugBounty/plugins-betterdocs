import { SearchNotFound } from "../../../icons";
import { __ } from "@wordpress/i18n";
const NoDocsFound = () => {
    return (
        <div className="betterdocs-dashboard-category-body betterdocs-dashboard-no-docs-found">
            <div className="empty-cat-img">
                <>
                    <SearchNotFound />
                    <p className="empty-cat-title">
                        {__("No Docs Found", "betterdocs")}
                    </p>
                </>
            </div>
        </div>
    );
};

export default NoDocsFound;
