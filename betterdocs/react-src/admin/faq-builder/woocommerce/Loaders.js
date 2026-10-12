import React from "react";

// Skeleton matching the Category Assignments table (head + rows of
// name / count / FAQ-groups select).
export const AssignmentsLoader = () => (
    <div className="betterdocs-woo-skeleton">
        <div className="betterdocs-woo-skeleton__head">
            <span className="bd-woo-skel bd-woo-skel--title" />
            <span className="bd-woo-skel bd-woo-skel--search" />
        </div>
        <div className="betterdocs-woo-skeleton__table">
            {Array.from({ length: 6 }).map((_, i) => (
                <div className="betterdocs-woo-skeleton__row" key={i}>
                    <span className="bd-woo-skel bd-woo-skel--name" />
                    <span className="bd-woo-skel bd-woo-skel--count" />
                    <span className="bd-woo-skel bd-woo-skel--select" />
                </div>
            ))}
        </div>
    </div>
);

// Skeleton matching the Display Settings form (head + stacked fields).
export const SettingsLoader = () => (
    <div className="betterdocs-woo-skeleton">
        <div className="betterdocs-woo-skeleton__head">
            <span className="bd-woo-skel bd-woo-skel--title" />
        </div>
        <div className="betterdocs-woo-skeleton__form">
            {Array.from({ length: 5 }).map((_, i) => (
                <div className="betterdocs-woo-skeleton__field" key={i}>
                    <span className="bd-woo-skel bd-woo-skel--label" />
                    <span className="bd-woo-skel bd-woo-skel--field" />
                </div>
            ))}
            <span className="bd-woo-skel bd-woo-skel--button" />
        </div>
    </div>
);
