import React from "react";
import Select from "react-select";

/**
 * Slide-over dropdown — react-select wearing the shared `betterdocs-dropdown`
 * styling (same look as the FAQ Builder "Order" / bulk-action picker), full
 * width and without the left icon. Used for the Parent Category, Language and
 * "translation of" fields in the Doc Categories / Tags slide-over.
 *
 * The slide-over body scrolls, so the menu is portaled to <body> above the panel
 * (its styles are emitted at the top level — see _slide-over.scss).
 *
 * Values are compared/returned as-is (the parent owns the type — number term id
 * or string language code); onChange receives the raw option value.
 */
const SlideoverSelect = ({
    value,
    options = [],
    onChange,
    placeholder,
    isSearchable = false,
    isDisabled = false,
}) => {
    const selected = options.find((o) => String(o.value) === String(value ?? "")) ?? null;

    return (
        <div className="betterdocs-dropdown-wrapper bd-dc-slideover-dropdown">
            <Select
                className="betterdocs-dropdown-select"
                classNamePrefix="betterdocs-dropdown"
                value={selected}
                options={options}
                onChange={(opt) => onChange(opt ? opt.value : "")}
                isSearchable={isSearchable}
                isClearable={false}
                isDisabled={isDisabled}
                placeholder={placeholder}
                menuPlacement="auto"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 100050 }) }}
            />
        </div>
    );
};

export default SlideoverSelect;
