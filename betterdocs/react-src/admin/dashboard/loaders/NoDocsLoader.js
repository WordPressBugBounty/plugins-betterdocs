import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Match the plugin's other skeletons (e.g. GridLoader): a flat var(--text-color-150)
// fill — base === highlight, so no shimmer — instead of react-loading-skeleton's
// default #ebebeb, which looked different from the rest of the dashboard.
const SK = { baseColor: "var(--text-color-150)", highlightColor: "var(--text-color-150)" };

/**
 * Loading skeleton shaped exactly like the "No Category Found" empty card
 * (NoDocsBody). Shown while the All Docs panel loads on a known-empty knowledge
 * base (betterdocs_admin.kb_is_empty), so an empty install transitions
 * skeleton-card -> empty card with no misleading category/docs skeleton in
 * between. Reuses NoDocsBody's wrapper classes so the card frame, padding and
 * centering match 1:1; only the content is replaced with skeleton blocks.
 */
const NoDocsLoader = () => (
    <section className="betterdocs-dashboard-body">
        <SkeletonTheme {...SK}>
        <div className="betterdocs-no-docs-wrapper betterdocs-sd-empty-card">
            <div className="betterdocs-no-docs-img-wrap">
                <Skeleton height={90} width={103} borderRadius={12} />
            </div>

            <div className="betterdocs-no-docs-content">
                <h3 className="betterdocs-no-docs-title">
                    <Skeleton height={26} width={220} borderRadius={6} />
                </h3>
                <p className="betterdocs-no-docs-text">
                    <Skeleton height={15} count={2} borderRadius={4} />
                </p>

                <div className="betterdocs-sd-empty-actions">
                    <Skeleton height={48} borderRadius={8} />
                    <Skeleton height={48} borderRadius={8} />
                </div>

                <div className="betterdocs-sd-empty-badge">
                    <Skeleton height={20} width={130} borderRadius={10} />
                </div>
            </div>
        </div>
        </SkeletonTheme>
    </section>
);

export default NoDocsLoader;
