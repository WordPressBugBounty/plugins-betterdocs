import React, { useState } from "react";
import "../scss/dashboard.scss";
import { PageHeader, AnalyticsNav } from "./Chrome";
import {
    OverviewTeaser,
    AiTrafficTeaser,
    ArticlesTeaser,
    SearchTeaser,
    EngagementTeaser,
    FeedbackTeaser,
    LinksTeaser,
    AuthorsTeaser,
    SettingsTeaser
} from "./modules/Teasers";

/* Every route is a Pro teaser in Free — none operate on a live date window,
   so the date-range filter is hidden throughout. */
const NO_FILTERS = [ "overview", "ai-traffic", "settings", "articles", "search", "engagement", "feedback", "links", "authors" ];

export default function Dashboard() {
    const [ route, setRoute ] = useState( "overview" );
    const [ days, setDays ] = useState( 30 );

    const nav = ( id ) => {
        setRoute( id );
        window.scrollTo( { top: 0 } );
    };

    return (
        <div className="bda-app">
            <div className="bda-container">
                <PageHeader
                    route={ route }
                    days={ days }
                    onDays={ setDays }
                    showFilters={ ! NO_FILTERS.includes( route ) }
                />
                <div className="bda-shell">
                    <AnalyticsNav active={ route } onNav={ nav } />
                    <main className="bda-main">
                        { route === "overview"   && <OverviewTeaser /> }
                        { route === "ai-traffic" && <AiTrafficTeaser /> }
                        { route === "articles"   && <ArticlesTeaser /> }
                        { route === "search"     && <SearchTeaser /> }
                        { route === "engagement" && <EngagementTeaser /> }
                        { route === "feedback"   && <FeedbackTeaser /> }
                        { route === "links"      && <LinksTeaser /> }
                        { route === "authors"    && <AuthorsTeaser /> }
                        { route === "settings"   && <SettingsTeaser /> }
                    </main>
                </div>
            </div>
        </div>
    );
}
