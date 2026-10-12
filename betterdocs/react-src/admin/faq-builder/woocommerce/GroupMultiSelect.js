import React, { useLayoutEffect, useRef, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { __ } from "@wordpress/i18n";

// Multi-select where the control keeps showing the placeholder and the chosen
// items render as removable chips *below* the field (design-system style).
// Pass `options` for a static list, or `loadOptions` for async search.
const GroupMultiSelect = ({
    options,
    loadOptions,
    value,
    onChange,
    isDisabled = false,
    // `loading` + a non-zero `loadingCount` (the saved-selection size) mean the
    // group already has assignments still being resolved — show a single
    // placeholder chip so the row is reserved while they load. The count only
    // gates the skeleton; it no longer maps to the number of placeholder chips.
    loading = false,
    loadingCount = 0,
    placeholder = __("Select FAQ groups…", "betterdocs"),
    noOptionsMessage = () => __("No FAQ groups found", "betterdocs"),
}) => {
    const removeOne = (val) =>
        onChange((value || []).filter((opt) => opt.value !== val));

    // Animate the chip area's height so the row eases between states — empty →
    // skeleton → real chips — and between any number of selected chips (which
    // may wrap to a different number of rows than the skeleton reserved),
    // instead of snapping/jumping. We measure the natural content height of the
    // inner (unconstrained) wrapper and transition the outer wrapper's height to
    // it; the outer is `overflow: hidden`, so clipping it never feeds back into
    // the measured height (no ResizeObserver loop).
    const measureRef = useRef(null);
    const [areaHeight, setAreaHeight] = useState(null);

    useLayoutEffect(() => {
        const el = measureRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        // Seed the height before the first paint so the modal opens at the right
        // size (no initial expand animation), then keep it in sync as chips,
        // skeletons, or wrapping change.
        const sync = () => setAreaHeight(el.scrollHeight);
        sync();
        const ro = new ResizeObserver(sync);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const sharedProps = {
        isMulti: true,
        controlShouldRenderValue: false,
        hideSelectedOptions: false,
        closeMenuOnSelect: false,
        isClearable: false,
        className: "bd-faq-select bd-woo-assign-select",
        classNamePrefix: "bd-faq-select",
        value,
        isDisabled,
        onChange: (selected) => onChange(selected || []),
        menuPortalTarget:
            typeof document !== "undefined" ? document.body : null,
        menuPlacement: "auto",
        styles: { menuPortal: (base) => ({ ...base, zIndex: 9999 }) },
        placeholder,
        noOptionsMessage,
    };

    return (
        <div className="bd-faq-multiselect">
            {loadOptions ? (
                <AsyncSelect
                    {...sharedProps}
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                />
            ) : (
                <Select {...sharedProps} options={options} />
            )}
            <div
                className="bd-faq-chips-anim"
                style={areaHeight == null ? undefined : { height: areaHeight }}
            >
                <div className="bd-faq-chips-measure" ref={measureRef}>
                    {loading && loadingCount > 0 ? (
                        // A single placeholder chip — one row only. The exact
                        // saved count is irrelevant here; the height animation
                        // eases up to however many rows the real chips need.
                        <div className="bd-faq-selected-chips" aria-hidden="true">
                            <span className="bd-faq-chip bd-faq-chip--skeleton" />
                        </div>
                    ) : value && value.length > 0 ? (
                        <div className="bd-faq-selected-chips">
                            {value.map((opt, i) => (
                                <span
                                    className={`bd-faq-chip bd-faq-chip--${(i % 6) + 1}`}
                                    key={opt.value}
                                >
                                    <span className="bd-faq-chip__label">
                                        {opt.label}
                                    </span>
                                    <button
                                        type="button"
                                        className="bd-faq-chip__remove"
                                        aria-label={__("Remove", "betterdocs")}
                                        disabled={isDisabled}
                                        onClick={() => removeOne(opt.value)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default GroupMultiSelect;
