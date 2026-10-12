import React from "react";
import { __ } from "@wordpress/i18n";
import Select from "react-select";

// Bulk-action picker shared by the Doc Categories & Doc Tags tables. Rendered
// with react-select — reusing the FAQ Builder "Order" dropdown styling
// (`betterdocs-dropdown` classNamePrefix) — so its open menu list matches the
// FAQ Builder instead of the browser's native, unstyleable <select> popup.
const BulkActionsSelect = ({ value, onChange }) => {
    const options = [
        { value: "",       label: __("Bulk actions", "betterdocs") },
        { value: "delete", label: __("Delete", "betterdocs") },
    ];

    return (
        <div className="betterdocs-dropdown-wrapper bd-dc-bulk-order">
            <Select
                className="betterdocs-dropdown-select"
                classNamePrefix="betterdocs-dropdown"
                value={options.find((o) => o.value === value) || options[0]}
                options={options}
                onChange={(opt) => onChange(opt?.value || "")}
                isSearchable={false}
                isClearable={false}
                menuPlacement="bottom"
            />
        </div>
    );
};

export default BulkActionsSelect;
