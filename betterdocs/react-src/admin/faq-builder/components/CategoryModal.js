import React, { useState, useEffect, useLayoutEffect } from "react";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { toast } from "react-toastify";
import Modal from "react-modal";
import ErrorMessage from "../utils/ErrorMessage";
import { validateFormFields } from "../utils/validations";
import {
  createFaqCategory,
  updateFaqCategory,
  mediaUpload,
  getProductCategories,
  searchProducts,
} from "../utils/function";
import { useFAQScope } from "../context/ScopeContext";
import { useFAQ } from "../../components/FAQContext";
import GroupMultiSelect from "../woocommerce/GroupMultiSelect";

const GROUP_PRODUCT_CATS_META = "_betterdocs_faq_group_product_cats";
const GROUP_PRODUCTS_META = "_betterdocs_faq_group_products";
const GROUP_ALL_PRODUCTS_META = "_betterdocs_faq_group_all_products";

// WordPress term `name` column is varchar(200); longer names cause a DB insert
// error, so cap the FAQ group title input here (server also enforces this).
const MAX_GROUP_NAME = 200;

// Custom modal styles
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(35, 40, 45, 0.5)",
    zIndex: 9990,
    padding: 50,
    paddingTop: 70,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  content: {
    width: "40rem",
    maxWidth: "90%",
    position: "static",
    height: "auto",
    overflow: "initial",
    margin: "auto",
  },
};

const CategoryModal = ({
  open,
  reFetchCategories,
  setShowCategoryModal,
  updateCategory,
  setUpdateCategory,
}) => {
  const { taxonomy, isProduct } = useFAQScope();
  const { setFocusTarget } = useFAQ();
  const [formFields, setFormFields] = useState({
    title: "",
    icon: "", // Added for storing icon URL
  });
  const [errors, setErrors] = useState({
    title: "",
  });

  // Product FAQ group assignments (only used when scope is the Product taxonomy).
  const [catOptions, setCatOptions] = useState([]);
  const [catOptionsLoading, setCatOptionsLoading] = useState(true);
  const [assignedCats, setAssignedCats] = useState([]);
  const [assignedProducts, setAssignedProducts] = useState([]);
  // Targeting scope: "all" (show on every product page — the store-wide group) or
  // "specific" (the category/product selects below). Mutually exclusive, so a generated
  // store-wide group can be switched to specific products and back.
  const [assignScope, setAssignScope] = useState("specific");
  // QA-002: guards the Create/Update button against double submission.
  const [submitting, setSubmitting] = useState(false);
  // Start in the loading state when the group being edited already has saved
  // products, so the placeholder chips reserve the row on the very first paint
  // (matching `catOptionsLoading`) instead of popping in a frame later.
  const [productsLoading, setProductsLoading] = useState(
    () => Boolean(updateCategory?.meta?.[GROUP_PRODUCTS_META]?.length)
  );

  useEffect(() => {
    if (updateCategory !== null) {
      setFormFields({
        ...formFields,
        title: decodeEntities(updateCategory?.name),
        icon: updateCategory?.meta?.faq_group_icon[0] || "",
      });
    } else {
      resetFormField();
    }
  }, [open, updateCategory]);

  // Load product category options once when the Product modal is in use.
  useEffect(() => {
    if (!isProduct) return;
    setCatOptionsLoading(true);
    getProductCategories()
      .then((res) =>
        setCatOptions(
          (res?.data || []).map((c) => ({
            value: c.id,
            label: decodeEntities(c.name),
          }))
        )
      )
      .catch(() => setCatOptions([]))
      .finally(() => setCatOptionsLoading(false));
  }, [isProduct]);

  // Prefill assigned categories from the group meta (resolved via options).
  // useLayoutEffect so the resolved chips (or, while options load, the skeleton
  // driven by `catOptionsLoading`) are in place before the first paint — no
  // post-paint reflow of the chip row.
  useLayoutEffect(() => {
    if (!isProduct || !open) return;
    if (updateCategory) {
      const ids = updateCategory?.meta?.[GROUP_PRODUCT_CATS_META] || [];
      setAssignedCats(catOptions.filter((o) => ids.includes(o.value)));
    } else {
      setAssignedCats([]);
    }
  }, [open, updateCategory, isProduct, catOptions]);

  // Reflect the group's saved scope so a store-wide group opens on "All products"
  // (and can be switched to specific), and a new group defaults to "specific".
  useLayoutEffect(() => {
    if (!isProduct || !open) return;
    setAssignScope(updateCategory?.meta?.[GROUP_ALL_PRODUCTS_META] ? "all" : "specific");
  }, [open, updateCategory, isProduct]);

  // Prefill assigned products by resolving their IDs to { id, name }.
  // useLayoutEffect so `productsLoading` flips to `true` (and the skeleton chips
  // reserve their row height + margin) before the browser paints, rather than a
  // frame after — otherwise the row renders empty first and the modal jumps.
  useLayoutEffect(() => {
    if (!isProduct || !open) return;
    const ids = updateCategory?.meta?.[GROUP_PRODUCTS_META] || [];
    if (updateCategory && ids.length) {
      setProductsLoading(true);
      searchProducts({ include: ids.join(",") })
        .then((res) =>
          setAssignedProducts(
            (res?.data || []).map((p) => ({
              value: p.id,
              label: decodeEntities(p.name),
            }))
          )
        )
        .catch(() => setAssignedProducts([]))
        .finally(() => setProductsLoading(false));
    } else {
      setAssignedProducts([]);
      setProductsLoading(false);
    }
  }, [open, updateCategory, isProduct]);

  const loadProductOptions = (input) =>
    searchProducts({ q: input })
      .then((res) =>
        (res?.data || []).map((p) => ({
          value: p.id,
          label: decodeEntities(p.name),
        }))
      )
      .catch(() => []);

  const resetFormField = () => {
    setFormFields({
      title: "",
      icon: "",
    });
    setAssignedCats([]);
    setAssignedProducts([]);
  };

  const resetErrors = () => {
    setErrors({
      title: "",
    });
  };

  const handleCancel = () => {
    resetErrors();
    setShowCategoryModal(false);
    setUpdateCategory(null);
  };

  const validationRules = () => {
    return {
      title: {
        required: {
          value: true,
          message: __("Please Insert FAQ Group Title.", "betterdocs"),
        },
      },
    };
  };

  const handleIconUpload = () => {
    mediaUpload((imageUrl, id) => {
      setFormFields({ ...formFields, icon: imageUrl });
    });
  };

  const handleIconRemove = () => {
    setFormFields({ ...formFields, icon: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // QA-002: ignore repeat submits while a request is in flight.
    if (submitting) {
      return;
    }
    const validated = validateFormFields(formFields, validationRules());
    if (!validated.valid) {
      setErrors(validated.errors);
      return;
    }
    const data = {
      title: formFields?.title,
      icon: formFields?.icon,
    };

    if (isProduct) {
      const allProducts = assignScope === "all";
      data.all_products = allProducts ? 1 : 0;
      // The scopes are mutually exclusive; don't send category/product targets when the
      // group is set to show on all products (the server clears them anyway).
      data.product_cats = allProducts ? [] : assignedCats.map((o) => o.value);
      data.products = allProducts ? [] : assignedProducts.map((o) => o.value);
    }

    setSubmitting(true);
    if (updateCategory !== null) {
      updateFaqCategory({ ...data, term_id: updateCategory?.id }, taxonomy)
        .then((res) => {
          if (res) {
            resetErrors();
            reFetchCategories();
            toast.success(__("FAQ Group updated.", "betterdocs"));
          }
        })
        .catch((err) => {
          const isDuplicate =
            err?.code === "term_exists" ||
            /already exists/i.test(err?.message || "");
          toast.error(
            isDuplicate
              ? __("Name already exists. Try a different one!", "betterdocs")
              : err?.message || __("Something went wrong!", "betterdocs")
          );
        })
        .finally(() => {
          setSubmitting(false);
          setShowCategoryModal(false);
          setUpdateCategory(null);
        });
    } else {
      createFaqCategory(data, taxonomy)
        .then((res) => {
          if (res) {
            resetErrors();
            reFetchCategories();
            toast.success(__("FAQ Group created.", "betterdocs"));
            // Reveal the new group: jump to the pagination page it lands on
            // (under the active order) and flash it — same one-shot focus
            // signal the new-FAQ (?faq_action=create) flow uses.
            if (res?.term_id) {
              setFocusTarget({ groupId: res.term_id });
            }
          }
        })
        .catch((err) => {
          const isDuplicate =
            err?.code === "term_exists" ||
            /already exists/i.test(err?.message || "");
          toast.error(
            isDuplicate
              ? __("Name already exists. Try a different one!", "betterdocs")
              : err?.message || __("Something went wrong!", "betterdocs")
          );
        })
        .finally(() => {
          setSubmitting(false);
          setShowCategoryModal(false);
        });
    }
  };

  return (
    <Modal
      isOpen={open}
      className="bd-faq-ctg-modal"
      onRequestClose={() => handleCancel()}
      style={customStyles}
    >
      <form onSubmit={handleSubmit}>
        <div className="bd-faq-ctg-header">
          <span
            className="bd-faq-stat-card__icon"
            style={{ "--bd-icon-tint": "#00B884", "--bd-icon-tint-rgb": "0, 184, 132" }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
            </svg>
          </span>
          <div className="bd-faq-ctg-heading">
            <h3 className="bd-faq-ctg-title">
              {updateCategory
                ? (isProduct
                    ? __("Update Product FAQ Group", "betterdocs")
                    : __("Update FAQ Group", "betterdocs"))
                : (isProduct
                    ? __("Create a New Product FAQ Group", "betterdocs")
                    : __("Create New FAQ Group", "betterdocs"))}
            </h3>
            <p className="bd-faq-ctg-subtitle">
              {__("Organize related FAQs into a group.", "betterdocs")}
            </p>
          </div>
        </div>
        <div className="bd-faq-ctg-body">
          <div className="bd-faq-cgt-field">
            <label className="bd-faq-label">
              {__("FAQ Group Title", "betterdocs")}
            </label>
            <input
              type="text"
              className="bd-faq-input"
              maxLength={MAX_GROUP_NAME}
              value={formFields?.title}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  title: e.target.value.replace(/^\s+/, "").slice(0, MAX_GROUP_NAME),
                })
              }
              placeholder={__("FAQ Group Title...", "betterdocs")}
            />
            {formFields?.title?.length >= MAX_GROUP_NAME && (
              <p className="bd-faq-max-length-note">
                {__("Maximum character limit reached", "betterdocs")}
              </p>
            )}
            <ErrorMessage error={errors.title} />
          </div>

          {/* Icon Upload Section */}
          <div className="bd-faq-cgt-field bd-faq-icon-field">
            <label className="bd-faq-label">{__("FAQ Group Icon", "betterdocs")}</label>
            {formFields.icon ? (
              <div className="bd-faq-control bd-faq-media">
                <div className="bd-faq-image-preview">
                  <img src={formFields.icon} alt="Selected Icon" />
                </div>
                <div className="bd-faq-image-uploader uploaded">
                  <div className="bd-faq_image_overlay">
                    <button
                      type="button"
                      className="bd-faq-btn bd-faq-image-change-btn"
                      onClick={handleIconUpload}
                    >
                      <i className="btd-icon btd-upload"></i>
                    </button>
                    <button
                      type="button"
                      className="bd-faq-btn bd-faq-image-remove-btn"
                      onClick={handleIconRemove}
                    >
                      <i className="btd-icon btd-delete"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bd-faq-control bd-faq-media">
                <div className="bd-faq-image-uploader">
                  <button
                    type="button"
                    className="bd-faq-btn bd-faq-image-upload-btn"
                    onClick={handleIconUpload}
                  >
                    <span className="icon">
                      <i className="btd-icon btd-upload"></i>
                    </span>
                    <span className="title">{__("Click to upload", "betterdocs")}</span>
                    <span className="info">
                      {__("SVG, PNG, JPG or GIF", "betterdocs")}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isProduct && (
            <>
              <div className="bd-faq-cgt-field">
                <label className="bd-faq-label">
                  {__("Where should this group show?", "betterdocs")}
                </label>
                <div className="bd-faq-scope-choices">
                  <label className="bd-faq-scope-choice">
                    <input
                      type="radio"
                      name="bd-faq-assign-scope"
                      value="all"
                      checked={assignScope === "all"}
                      onChange={() => setAssignScope("all")}
                    />
                    <span>
                      <strong>{__("All products", "betterdocs")}</strong>
                      <em>{__("Show this FAQ on every product page.", "betterdocs")}</em>
                    </span>
                  </label>
                  <label className="bd-faq-scope-choice">
                    <input
                      type="radio"
                      name="bd-faq-assign-scope"
                      value="specific"
                      checked={assignScope === "specific"}
                      onChange={() => setAssignScope("specific")}
                    />
                    <span>
                      <strong>{__("Specific products", "betterdocs")}</strong>
                      <em>{__("Only the product categories or products you choose.", "betterdocs")}</em>
                    </span>
                  </label>
                </div>
              </div>

              {assignScope === "specific" && (
              <>
              <div className="bd-faq-cgt-field">
                <label className="bd-faq-label">
                  {__("Assign to Product Categories", "betterdocs")}
                </label>
                <GroupMultiSelect
                  options={catOptions}
                  value={assignedCats}
                  onChange={setAssignedCats}
                  loading={catOptionsLoading}
                  loadingCount={
                    (updateCategory?.meta?.[GROUP_PRODUCT_CATS_META] || []).length
                  }
                  placeholder={__("Select product categories…", "betterdocs")}
                  noOptionsMessage={() =>
                    __("No product categories found", "betterdocs")
                  }
                />
              </div>

              <div className="bd-faq-cgt-field">
                <label className="bd-faq-label">
                  {__("Assign to Products", "betterdocs")}
                </label>
                <GroupMultiSelect
                  loadOptions={loadProductOptions}
                  value={assignedProducts}
                  onChange={setAssignedProducts}
                  loading={productsLoading}
                  loadingCount={
                    (updateCategory?.meta?.[GROUP_PRODUCTS_META] || []).length
                  }
                  placeholder={__("Search products…", "betterdocs")}
                  noOptionsMessage={() => __("No products found", "betterdocs")}
                />
              </div>
              </>
              )}
            </>
          )}
        </div>
        <div className="bd-faq-ctg-footer">
          <button type="submit" className="bd-faq-button button-success" disabled={submitting}>
            <span className="bd-faq-text">
              {submitting
                ? __("Saving…", "betterdocs")
                : updateCategory
                ? (isProduct
                    ? __("Update Product FAQ Group", "betterdocs")
                    : __("Update FAQ Group", "betterdocs"))
                : (isProduct
                    ? __("Create Product FAQ Group", "betterdocs")
                    : __("Create FAQ Group", "betterdocs"))}
            </span>
          </button>
        </div>
      </form>
      <button
        type="button"
        className="bd-faq-modal-close-button"
        onClick={() => handleCancel()}
      >
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.69687 14L0.296875 12.6L5.89687 7L0.296875 1.4L1.69687 0L7.29688 5.6L12.8969 0L14.2969 1.4L8.69688 7L14.2969 12.6L12.8969 14L7.29688 8.4L1.69687 14Z" fill="currentColor" />
        </svg>
      </button>
    </Modal>
  );
};

export default CategoryModal;
