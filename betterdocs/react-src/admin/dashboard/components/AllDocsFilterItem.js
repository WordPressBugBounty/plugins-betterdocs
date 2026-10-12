import React, { useCallback, useEffect, useState } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import ReactSelect from "react-select/async";

const AllDocsFilterItem = (props) => {
    const {
        path,
        filterIcon: FilterIcon,
        filterName,
        placeholder = filterName,
        defaultValue,
        options = [],
        onFilterSelect,
        name,
        setIsLoading,
        ...propsToPass
    } = props;

    const [defaultOptions, setDefaultOptions] = useState(options);

    useEffect(() => {
        if( options?.length > 0 ){
            setDefaultOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (path == undefined) {
            return;
        }

        loadOptions("", (value) => value).then((res) => {
            setDefaultOptions(res);
        });
    }, [path]);

    const loadOptions = useCallback(
        async (inputValue, callback) => {
            if (path == undefined) {
                return;
            }

            const docsData = await wp.apiFetch({
                path: path,
            });

            return callback(
                docsData.map((data) => ({
                    label: decodeEntities(data.name),
                    value: data.id,
                }))
            );
        },
        [path]
    );

    return (
        <li className={props.name}>
            {FilterIcon && <FilterIcon />}
            <ReactSelect
                placeholder={placeholder}
                isClearable={true}
                isSearchable={true}
                loadOptions={loadOptions}
                defaultValue={defaultValue}
                defaultOptions={defaultOptions}
                className={`betterdocs-dashboard-filter-select betterdocs-dashboard-filter-select-${name}`}
                classNamePrefix="betterdocs-dashboard-filter"
                onChange={(e) => {
                    onFilterSelect((prev) => {
                        let orderData = {};
                        if (prev == undefined) {
                            orderData[name] = e?.value;
                            if( e?.value == null ) {
                                delete orderData[name];
                            }
                            return { ...orderData };
                        } else if (e?.value == prev[name]) {
                            return prev;
                        } else if (prev != undefined && e?.value != undefined) {
                            orderData[name] = e?.value;
                            return { ...prev, ...orderData };
                        } else {
                            delete prev[name];
                            return { ...prev, ...orderData };
                        }
                    });
                }}
                {...propsToPass}
            />
        </li>
    );
};

export default AllDocsFilterItem;
