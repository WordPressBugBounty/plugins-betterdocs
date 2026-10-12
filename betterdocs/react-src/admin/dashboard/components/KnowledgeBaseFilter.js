import React, { useEffect, useState } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import useFetch from "../hooks/useFetch";
import AsyncSelect from "react-select/async";
import { __ } from "@wordpress/i18n";

const KnowledgeBaseFilter = ({ heading, selectedValue, setValue }) => {
  const { data, isLoading } = useFetch({
    path: "wp/v2/knowledge_base?per_page=100",
    parse: false,
  });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!isLoading && data?.length > 0) {
      const formattedOptions = data.map((option) => ({
        label: decodeEntities(option.name.charAt(0).toUpperCase() + option.name.slice(1)),
        value: option.slug,
      }));
      setOptions([
        { label: __("All Knowledge Base", "betterdocs"), value: "" },
        ...formattedOptions,
      ]);
    }
  }, [isLoading, data]);

  const loadOptions = (inputValue, callback) => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filteredOptions);
  };

  const handleChange = (selectedOption) => {
    if (selectedOption?.value === "select_all") {
      const allValues = data.map((option) => option.slug);
      setValue(allValues.join(","));
    } else {
      setValue(selectedOption?.value || "");
    }
  };

  if (isLoading || !(data?.length > 0)) {
    return null;
  }

  // Reuses the shared FAQ-order select styling (.betterdocs-dropdown-wrapper /
  // .betterdocs-dropdown* prefix) so the Knowledge Base filter follows the
  // design system — same control, focus shadow, menu, and option states as the
  // FAQ Builder order picker. See docs/design-system.md → Component design rules.
  return (
    <div className="betterdocs-dropdown-wrapper betterdocs-kb-filter">
      <span className="betterdocs-dropdown-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </span>
      <AsyncSelect
        className="betterdocs-dropdown-select"
        classNamePrefix="betterdocs-dropdown"
        cacheOptions
        defaultOptions={options}
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder={__("All Knowledge Base", "betterdocs")}
        isClearable={false}
        menuPlacement="bottom"
        defaultValue={
          selectedValue
            ? {
                label:
                  selectedValue.charAt(0).toUpperCase() +
                  selectedValue.slice(1),
                value: selectedValue,
              }
            : null
        }
      />
    </div>
  );
};

export default KnowledgeBaseFilter;
