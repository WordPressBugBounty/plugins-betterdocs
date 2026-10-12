import { __ } from "@wordpress/i18n";
import React from "react";

import LockedPreview from "../analytics/components/modules/LockedPreview";
import ApiDocsMock from "./ApiDocsMock";
import "../analytics/scss/dashboard.scss";
import "./api-docs-teaser.scss";

/**
 * Free's API Docs screen — a locked teaser for the Pro feature, built on the
 * same `LockedPreview` shell the Analytics modules use so both upsells read as
 * one design. Free only registers this route when Pro does not ship API Docs
 * (see `betterdocs_admin.has_api_docs`); once Pro is active its real screen
 * takes the `betterdocs-api-docs` route instead.
 */
export default function ApiDocsTeaser() {
    return (
        <div className="betterdocs-dashboard-body betterdocs-dashboard-container bd-apit-wrapper">
            <LockedPreview
                title={ __( "API Documentation is a Pro feature", "betterdocs" ) }
                subtitle={ __( "Upload an OpenAPI or Postman file — or point BetterDocs at its URL — and every endpoint becomes a real doc inside your knowledge base, searchable, styled like the rest of your docs, and re-synced whenever the spec changes.", "betterdocs" ) }
                bullets={ [
                    __( "OpenAPI 3.x, Swagger 2.0 & Postman collections", "betterdocs" ),
                    __( "Every endpoint generated as a native, searchable doc", "betterdocs" ),
                    __( "Built-in \"Try it\" console with live request samples", "betterdocs" ),
                    __( "Re-sync from a URL to keep docs matching your API", "betterdocs" )
                ] }
            >
                <ApiDocsMock />
            </LockedPreview>
        </div>
    );
}
