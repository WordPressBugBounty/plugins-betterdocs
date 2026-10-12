import { __ } from "@wordpress/i18n";
import React from "react";

/**
 * Design-accurate, inert mock of Pro's API Docs screen (react-src/admin/api-docs/
 * components/ApiTable.js over there). It exists only to sit blurred behind the
 * lock panel, so nothing here fetches or reacts — it is a picture of the real
 * table, built from the same `bd-dc-*` table shell Free already ships for Doc
 * Categories, plus the API-specific column classes in api-docs-teaser.scss.
 */

const ViewIcon = () => (
    <svg width="13" height="13" viewBox="0 0 15 14" fill="none" aria-hidden="true">
        <path d="M11.5 7.66667V11.6667C11.5 12.0203 11.3595 12.3594 11.1095 12.6095C10.8594 12.8595 10.5203 13 10.1667 13H2.83333C2.47971 13 2.14057 12.8595 1.89052 12.6095C1.64048 12.3594 1.5 12.0203 1.5 11.6667V4.33333C1.5 3.97971 1.64048 3.64057 1.89052 3.39052C2.14057 3.14048 2.47971 3 2.83333 3H6.83333M9.5 1H13.5M13.5 1V5M13.5 1L6.16667 8.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M8.5 1.5L11.5 4.5L4 12H1V9L8.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M1.5 3H11.5M4.5 3V2A.5.5 0 015 1.5H8A.5.5 0 018.5 2V3M5 5.5V9.5M8 5.5V9.5M2.5 3L3 11A.5.5 0 003.5 11.5H9.5A.5.5 0 0010 11L10.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const REFERENCES = [
    { title: "Payments API", source: __( "URL sync", "betterdocs" ), endpoints: 42, published: true },
    { title: "Petstore (OpenAPI 3.1)", source: __( "Upload", "betterdocs" ), endpoints: 19, published: true },
    { title: "Webhooks Reference", source: __( "URL sync", "betterdocs" ), endpoints: 8, published: true },
    { title: "Internal Admin API", source: __( "Upload", "betterdocs" ), endpoints: 27, published: false, postman: true }
];

const METHODS = [
    { verb: "GET", path: "/v1/customers/{id}" },
    { verb: "POST", path: "/v1/customers" },
    { verb: "PATCH", path: "/v1/customers/{id}" },
    { verb: "DELETE", path: "/v1/customers/{id}" }
];

export default function ApiDocsMock() {
    return (
        <div className="bd-apit-mock">
            <div className="bd-dc-tree-card">
                <div className="bd-dc-table-header bd-apit-thead">
                    <div className="bd-apit-c bd-apit-c-name">{ __( "Name", "betterdocs" ) }</div>
                    <div className="bd-apit-c bd-apit-c-endpoints">{ __( "Endpoints", "betterdocs" ) }</div>
                    <div className="bd-apit-c bd-apit-c-status">{ __( "Status", "betterdocs" ) }</div>
                    <div className="bd-apit-c bd-apit-c-actions">{ __( "Actions", "betterdocs" ) }</div>
                </div>
                <div className="bd-dc-table-body">
                    { REFERENCES.map( ( item, i ) => (
                        <div className="bd-dc-row bd-apit-row" key={ i }>
                            <div className="bd-apit-c bd-apit-c-name">
                                <span className="bd-dc-name bd-apit-name">{ item.title }</span>
                                <div className="bd-dc-meta-row">
                                    <span className="bd-apit-source">{ item.source }</span>
                                    { item.postman && <span className="bd-apit-chip bd-apit-chip--postman">{ __( "Postman", "betterdocs" ) }</span> }
                                </div>
                            </div>
                            <div className="bd-apit-c bd-apit-c-endpoints">
                                <span className="bd-apit-count">{ item.endpoints }</span>
                            </div>
                            <div className="bd-apit-c bd-apit-c-status">
                                <span className={ `bd-apit-status bd-apit-status--${ item.published ? "publish" : "draft" }` }>
                                    { item.published ? __( "Published", "betterdocs" ) : __( "Draft", "betterdocs" ) }
                                </span>
                            </div>
                            <div className="bd-apit-c bd-apit-c-actions">
                                { item.published && <span className="bd-dc-row-action bd-dc-row-action-icon"><ViewIcon /></span> }
                                <span className="bd-dc-row-action bd-dc-row-action-icon"><EditIcon /></span>
                                <span className="bd-dc-row-action bd-dc-row-action-icon bd-dc-row-action-delete"><TrashIcon /></span>
                            </div>
                        </div>
                    ) ) }
                </div>
            </div>

            {/* A slice of the rendered reference, so the lock panel's promise
                ("endpoints become real docs") has a picture attached. */}
            <div className="bd-apit-preview">
                <div className="bd-apit-preview-head">
                    <span className="bd-apit-preview-title">{ __( "Payments API", "betterdocs" ) }</span>
                    <span className="bd-apit-chip">{ __( "OpenAPI 3.1", "betterdocs" ) }</span>
                </div>
                <div className="bd-apit-endpoints">
                    { METHODS.map( ( m, i ) => (
                        <div className="bd-apit-endpoint" key={ i }>
                            <span className={ `bd-apit-verb bd-apit-verb--${ m.verb.toLowerCase() }` }>{ m.verb }</span>
                            <code className="bd-apit-path">{ m.path }</code>
                            <span className="bd-apit-tryit">{ __( "Try it", "betterdocs" ) }</span>
                        </div>
                    ) ) }
                </div>
            </div>
        </div>
    );
}
