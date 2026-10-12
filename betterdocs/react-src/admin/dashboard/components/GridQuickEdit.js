import React, { useEffect, useState } from "react";
import { IconClose } from "../../../icons";
import { useDashboardContext } from "../DashboardContext";
import MultiSelect from "./MultiSelect";
import { __ } from "@wordpress/i18n";
import Select from "react-select";
import { applyFilters } from "@wordpress/hooks";
import { toast } from "react-toastify";
import { decodeEntities } from "@wordpress/html-entities";
import useDebounce from "../hooks/useDebounce";
import { addQueryArgs } from "@wordpress/url";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";
import useAuthorsQuery from "../hooks/useAuthorsQuery";
import useAuthorsSearchQuery from "../hooks/useAuthorsSearchQuery";

const GridQuickEdit = ({ data, setQuickEdit, setCategoriesPosts, docCategoriesQueryParams }) => {
    const { docData, docId: selectedDocId, termId: selectedTermId } = data;
    const [saveText, setSaveText] = useState("Save");
    const [quickEditData, setQuickEditData] = useState({
        author: "",
        title: "",
        slug: "",
        comment_status: "",
        status: "",
        date: "",
        password: "",
    });
    const [currentDocUser, setCurrentDocUser] = useState({});

    const { usersLoading, authors, authorParams, setAuthorParams, isNextPageAvailable } = useAuthorsQuery('authors', {
        per_page:10,
        page:1
    });

    const { searchLoading, searchedUsers, setUserSearchValue }  = useAuthorsSearchQuery();
    const [privacyOption, setPrivacyOption]  = useState("");

    useEffect(() => {
        setQuickEditData({
            author: docData?.author,
            title: docData.title,
            slug: docData.slug,
            comment_status: docData.comment_status,
            status: docData.status,
            date: docData?.date,
            password: docData?.password,
        });
        setCurrentDocUser({
            value: docData.author,
            label: docData.author_info.name,
        });
        if (docData.status == "private") {
            setPrivacyOption("private");
        } else if (docData?.content?.protected || docData?.password?.length > 0) {
            setPrivacyOption("password");
        } else {
            setPrivacyOption("none");
        }
    }, [docData]);

    const statusOptions = [
        { value: "publish", label: __("Published", "betterdocs") },
        { value: "pending", label: __("Pending review", "betterdocs") },
        { value: "draft", label: __("Draft", "betterdocs") },
    ];

    return (
        <div className="betterdocs-quick-edit-panel">
            <div className="betterdocs-quick-edit-wrap">
                <div className="betterdocs-quick-edit-header">
                    <h3 className="betterdocs-quick-edit-title">
                        {decodeEntities(quickEditData.title)}
                    </h3>
                    <div
                        onClick={() =>
                            setQuickEdit((prevState) => {
                                return { ...prevState, isOpen: !prevState.isOpen };
                            })
                        }
                        className="betterdocs-quick-edit-close"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
                <div className="betterdocs-quick-edit-body">
                    <div className="betterdocs-quick-edit-form-group">
                        <label htmlFor="betterdocs-quick-edit-status">
                            {__("Authors:", "betterdocs")}
                        </label>
                        <Select
                            className="quick-edit-select-fields betterdocs-quick-edit-authors"
                            id="betterdocs-quick-edit-authors"
                            value={currentDocUser}
                            onInputChange={(e) => {
                                setUserSearchValue(e);
                            }}
                            onMenuScrollToBottom={(e) => {
                                if(e != null && isNextPageAvailable){
                                    setAuthorParams((prev) => {
                                        return {...prev, page:authorParams.page + 1}
                                    })
                                }
                            }}
                            onChange={(selectedOption) => {
                                setQuickEditData((state) => ({
                                    ...state,
                                    author: selectedOption?.value,
                                }));
                                setCurrentDocUser(selectedOption);
                            }}
                            filterOption={(option, inputValue)=> {
                                return option;
                            }}
                            options={searchedUsers?.length > 0 ? searchedUsers : authors}
                            classNamePrefix="quick-edit-select-fields"
                        />
                    </div>
                    <div className="betterdocs-quick-edit-form-group">
                        <label htmlFor="betterdocs-quick-edit-status">
                            {__("Status:", "betterdocs")}
                        </label>
                        <Select
                            className="quick-edit-select-fields betterdocs-quick-edit-status"
                            id="betterdocs-quick-edit-status"
                            value={statusOptions.find(
                                (option) =>
                                    option.value === quickEditData.status,
                            )}
                            onChange={(selectedOption) => {
                                setQuickEditData((state) => ({
                                    ...state,
                                    status: selectedOption?.value,
                                }));
                            }}
                            options={statusOptions}
                            classNamePrefix="quick-edit-select-fields"
                        />
                    </div>
                    <div className="betterdocs-quick-edit-form-group">
                        <label htmlFor="betterdocs-quick-edit-title">
                            {__("Title:", "betterdocs")}
                        </label>
                        <input
                            id="betterdocs-quick-edit-title"
                            type="text"
                            value={quickEditData.title}
                            onChange={(event) =>
                                setQuickEditData((state) => ({
                                    ...state,
                                    title: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="betterdocs-quick-edit-form-group">
                        <label htmlFor="betterdocs-quick-edit-slug">
                            {__("Slug", "betterdocs")}
                        </label>
                        <input
                            id="betterdocs-quick-edit-slug"
                            type="text"
                            placeholder="Slug"
                            value={quickEditData.slug}
                            onChange={(event) =>
                                setQuickEditData((state) => ({
                                    ...state,
                                    slug: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="betterdocs-quick-edit-form-group">
                        <label htmlFor="betterdocs-quick-date">
                            {__("Date:", "betterdocs")}
                        </label>
                        <input
                            id="betterdocs-quick-edit-date"
                            type="datetime-local"
                            placeholder="date"
                            value={quickEditData?.date}
                            onChange={(e) => {
                                setQuickEditData((state) => ({
                                    ...state,
                                    date: e?.target?.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="betterdocs-quick-edit-form-group">
                        <label>{__("Select Privacy", "betterdocs")}</label>
                        <div className="betterdocs-quick-edit-privacy-radio">
                            <div className="betterdocs-quick-edit-privacy-radio-group">
                                <input
                                    id="password"
                                    type="radio"
                                    name="privacy"
                                    value="password"
                                    checked={privacyOption === "password"}
                                    onChange={(e) => {
                                        setPrivacyOption(e.target.value);
                                        const defaultData = {
                                            ...quickEditData,
                                            status: docData?.status
                                        };
                                        if( docData?.password?.length > 0 ) {
                                            defaultData['password'] = docData?.password;
                                        }
                                        setQuickEditData((prev) => (defaultData));
                                    }}
                                />
                                <label htmlFor="password">
                                    {__("Password Protected", "betterdocs")}
                                </label>
                            </div>
                            <div className="betterdocs-quick-edit-privacy-radio-group">
                                <input
                                    id="private"
                                    type="radio"
                                    name="privacy"
                                    value="private"
                                    checked={privacyOption === "private"}
                                    onChange={(e) => {
                                        setPrivacyOption(e.target.value);
                                        if (
                                            quickEditData?.hasOwnProperty(
                                                "password",
                                            )
                                        ) {
                                            delete quickEditData["password"];
                                        }
                                        setQuickEditData((prev) => ({
                                            ...quickEditData,
                                            status: "private",
                                        }));
                                    }}
                                />
                                <label htmlFor="private">
                                    {__("Make Private", "betterdocs")}
                                </label>
                            </div>
                            <div className="betterdocs-quick-edit-privacy-radio-group">
                                <input
                                    id="none"
                                    type="radio"
                                    name="privacy"
                                    value="none"
                                    checked={privacyOption === "none"}
                                    onChange={(e) => {
                                        setPrivacyOption(e.target.value);
                                        setQuickEditData((prev) => ({
                                            ...quickEditData,
                                            title: quickEditData?.title?.replace(
                                                "Private:",
                                                "",
                                            ),
                                            status: "publish",
                                            password:""
                                        }));
                                    }}
                                />
                                <label htmlFor="none">
                                    {__("None", "betterdocs")}
                                </label>
                            </div>
                        </div>
                    </div>
                    {privacyOption === "password" && (
                        <div className="betterdocs-quick-edit-form-group betterdocs-quick-edit-password-field">
                            <label htmlFor="betterdocs-quick-edit-password">
                                {__("Password:", "betterdocs")}
                            </label>
                            <input
                                id="betterdocs-quick-edit-password"
                                type="text"
                                placeholder=""
                                value={
                                    quickEditData?.password?.length > 0
                                        ? quickEditData?.password
                                        : ""
                                }
                                onChange={(e) => {
                                    setQuickEditData((state) => ({
                                        ...state,
                                        status:
                                            docData?.status == "private"
                                                ? "publish"
                                                : docData?.status,
                                        password: e?.target?.value,
                                    }));
                                }}
                            />
                        </div>
                    )}

                    {betterdocs_admin?.multiple_kb == 1 &&
                        applyFilters("quick_edit_mkb_filter", "", [
                            docData,
                            setQuickEditData,
                            MultiSelect,
                        ])}

                    <MultiSelect
                        name="doc_category"
                        endpoint="wp/v2/doc_category"
                        doc={docData}
                        setQuickEditData={setQuickEditData}
                        label={__("Category", "betterdocs")}
                        placeholder={__("Search Category", "betterdocs")}
                    />

                    <MultiSelect
                        name="doc_tag"
                        endpoint="wp/v2/doc_tag"
                        doc={docData}
                        setQuickEditData={setQuickEditData}
                        label={__("Tags", "betterdocs")}
                        placeholder={__("Search Tags", "betterdocs")}
                    />

                    <div className="betterdocs-quick-edit-form-group">
                        <div className="betterdocs-quick-edit-comments">
                            <input
                                type="checkbox"
                                id={docData.id}
                                checked={
                                    quickEditData.comment_status === "open"
                                }
                                onChange={(event) =>
                                    setQuickEditData((prev) => ({
                                        ...prev,
                                        comment_status: event.target.checked
                                            ? "open"
                                            : "closed",
                                    }))
                                }
                            />
                            <label htmlFor={docData.id}>
                                {__("Allow Comments", "betterdocs")}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="betterdocs-quick-edit-footer">
                    <div className="betterdocs-quick-edit-submit">
                        <button
                            type="button"
                            className="betterdocs-quick-edit-cancel-btn"
                            onClick={() =>
                                setQuickEdit((prevState) => {
                                    return { ...prevState, isOpen: !prevState.isOpen };
                                })
                            }
                        >
                            {__("Cancel", "betterdocs")}
                        </button>
                        <button
                            type="submit"
                            className="betterdocs-quick-edit-submit-btn"
                            onClick={async (event) => {
                                event.preventDefault();
                                setSaveText("Saving...");
                                const response = await wp.apiFetch({
                                    path: `/wp/v2/docs/${docData.id}`,
                                    method: "POST",
                                    data: quickEditData,
                                });
                                if (response != undefined) {
									setCategoriesPosts.invalidateQueries(['docsCategories', docCategoriesQueryParams]); // refetch the updated query from the DB after update
                                    setSaveText("Save");
                                    toast.success(
                                        __("Saved Successfully", "betterdocs"),
                                    );
                                } else {
                                    setSaveText("Save");
                                    toast.error(
                                        __("Error While Saving", "betterdocs"),
                                    );
                                }
                            }}
                        >
                            {saveText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridQuickEdit;
