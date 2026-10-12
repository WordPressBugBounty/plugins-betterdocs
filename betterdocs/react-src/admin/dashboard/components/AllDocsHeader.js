import React from "react";
import { __ } from "@wordpress/i18n";
import { IconGrid, IconList, IconSun } from "../../../icons/index";

const AllDocsHeader = () => {
    return (
        <section className="betterdocs-dashboard-header">
            <div className="betterdocs-dashboard-container">
                <div className="betterdocs-row">
                    <div className="betterdocs-col betterdocs-col-xs-4">
                        <h2 className="betterdocs-dashboard-header-title">
                            {__("All Docs", "betterdocs")}
                        </h2>
                    </div>
                    <div className="betterdocs-col betterdocs-col-xs-8">
                        <ul className="betterdocs-dashboard-header-action-list betterdocs-text-align-right">
                            <li key={1}>
                                <button className="betterdocs-dashboard-header-action betterdocs-dashboard-header-action-grid">
                                    <IconGrid />
                                </button>
                            </li>
                            <li key={2}>
                                <button className="betterdocs-dashboard-header-action betterdocs-dashboard-header-action-list">
                                    <IconList />
                                </button>
                            </li>
                            <li key={3}>
                                <button className="betterdocs-dashboard-header-action betterdocs-dashboard-header-action-mode">
                                    <IconSun />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllDocsHeader;
