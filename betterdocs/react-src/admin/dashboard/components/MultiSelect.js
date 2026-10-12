import React, { useEffect, useState } from "react";
import { decodeEntities } from "@wordpress/html-entities";
import { IconSearch } from "../../../icons";
import { addQueryArgs } from "@wordpress/url";
import useFetch from "../hooks/useFetch";

const MultiSelect = (props) => {
    const { label, placeholder, doc, endpoint, setQuickEditData, name } = props;

    if (doc?.id === undefined) {
        return null;
    }

    const [keyword, setKeyword] = useState("");
    const [items, setItems] = useState([]);

    const { data, isLoading } = useFetch({
        path: addQueryArgs(endpoint, { post: doc.id }),
    });

    const { data: allItems, isLoading: allItemsLoading } = useFetch({
        path: addQueryArgs(endpoint),
    });

    const { data: searchedData, isLoading: searchIsLoading } = useFetch({
        path: addQueryArgs(endpoint, { search: keyword }),
    });

    useEffect(() => {
        setItems([]);
    }, [doc.id]);

    useEffect(() => {
        setItems((prev) => {
            let items = [];
            let itemsId = [];
            if (data.length > 0) {
                items = data.map((item) => {
                    itemsId.push(item.id);

                    return { ...item, selected: true };
                });
            }

            if (searchedData.length > 0) {
                let searchFilteredItems = searchedData.filter(
                    (item) => !itemsId.includes(item.id),
                );

                searchFilteredItems = searchFilteredItems.map((item) => {
                    return { ...item, selected: false };
                });

                itemsId = [
                    ...itemsId,
                    ...searchFilteredItems.map((item) => item.id),
                ];

                items = [...items, ...searchFilteredItems];
            }

            if (allItems.length > 0) {
                let filteredItems = allItems.filter(
                    (item) => !itemsId.includes(item.id),
                );

                filteredItems = filteredItems.map((item) => {
                    return { ...item, selected: false };
                });

                items = [...items, ...filteredItems];
            }

            return items;
        });
    }, [data, allItems, searchedData, doc]);

    useEffect(() => {
        setQuickEditData((prev) => {
            return {
                ...prev,
                [name]: items
                    .filter((item) => item.selected)
                    .map((item) => parseInt(item.id)),
            };
        });
    }, [items]);

    const handleSelect = (id) => {
        return (event) => {
            setItems((items) => {
                return items.map((item) => {
                    if (item.id === id && event.target.checked) {
                        item.selected = true;
                    }
                    if (item.id === id && !event.target.checked) {
                        item.selected = false;
                    }

                    return item;
                });
            });
        };
    };

    return (
        <div className="betterdocs-quick-edit-form-group">
            <label htmlFor="betterdocs-quick-edit-category">{label}</label>
            <div className="betterdocs-quick-edit-multiselect">
                <div className="betterdocs-quick-edit-search">
                    <IconSearch />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="betterdocs-quick-edit-multiselect-items">
                    {items.map((item) => {
                        let defaultValue = ( name == 'doc_category' && doc?.doc_category?.includes(item?.id) ) ? true : (name == 'doc_tag' && doc?.doc_tag?.includes(item?.id) ? true : ( name == 'knowledge_base' && doc?.knowledge_base?.includes(item?.id) ? true : false ));
                        return  <div
                                    className="betterdocs-quick-edit-checkbox-group"
                                    key={item.id}
                                >
                                <input
                                    type="checkbox"
                                    value={item.name}
                                    id={item.id}
                                    defaultChecked={defaultValue}
                                    onChange={handleSelect(item.id)}
                                />
                                <label htmlFor={item.id}>{decodeEntities(item.name)}</label>
                            </div>
                    })}
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;
