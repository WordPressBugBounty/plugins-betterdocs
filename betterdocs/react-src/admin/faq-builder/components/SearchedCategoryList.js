import React, { useEffect, useState } from "react";
import SearchedCategory from "./SearchedCategory";

const SearchedCategoryList = ({
    isLoading,
    categoriesLoading,
    allFaqCategories,
    reFetchCategories,
    setUpdateCategory,
    setShowFaqAIModalForm,
}) => {
    const [createFaqAt, setCreateFaqAt] = useState(null);
    const [faqExpanded, setFaqExpanded] = useState(undefined);
    const [categoryExpanded, setCategoryExpanded] = useState(undefined);
    const [sortableCategories, setSortableCategories] = useState([]);
    const [changeFaqSort, setChangeFaqSort] = useState({});
    const [reFetchFaqForCategory, setReFetchFaqForCategory] = useState(null);

    useEffect(() => {
        if (allFaqCategories?.length) {
            const sorted = allFaqCategories.sort(function (a, b) {
                return a?.meta?.order[0] - b?.meta?.order[0];
            });
            setSortableCategories(sorted, 33);
            // Auto-open the first matched group after a search so the matching
            // FAQs are visible without an extra click.
            setCategoryExpanded(sorted[0]?.term_id);
        } else {
            setSortableCategories([]);
            setCategoryExpanded(undefined);
        }
    }, [allFaqCategories]);

    return (
        <>
            {!isLoading ? (
                <div className="bd-faq-ctg-list">
                    <div className="bd-faq-ctg-list-droppable">
                        {!categoriesLoading
                            ? sortableCategories?.map((category, index) => {
                                  return (
                                      <SearchedCategory
                                          key={category?.term_id}
                                          index={index}
                                          category={category}
                                          categoriesLoading={categoriesLoading}
                                          allFaqCategories={allFaqCategories}
                                          reFetchCategories={reFetchCategories}
                                          createFaqAt={createFaqAt}
                                          setUpdateCategory={setUpdateCategory}
                                          categoryExpanded={categoryExpanded}
                                          setCategoryExpanded={
                                              setCategoryExpanded
                                          }
                                          setCreateFaqAt={setCreateFaqAt}
                                          faqExpanded={faqExpanded}
                                          setFaqExpanded={setFaqExpanded}
                                          changeFaqSort={changeFaqSort}
                                          setChangeFaqSort={setChangeFaqSort}
                                          reFetchFaqForCategory={
                                              reFetchFaqForCategory
                                          }
                                          setReFetchFaqForCategory={
                                              setReFetchFaqForCategory
                                          }
                                          setShowFaqAIModalForm={
                                              setShowFaqAIModalForm
                                          }
                                      />
                                  );
                              })
                            : "loading"}
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export default React.memo(SearchedCategoryList);
