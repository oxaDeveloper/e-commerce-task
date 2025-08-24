import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductById, updateProduct } from "../store/slices/productsSlice";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type FormValues = {
  name: string;
  price: number;
  category?: string;
  stock?: number;
};

const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const current = useAppSelector((s) => s.products.current);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (current) {
      reset({
        name: current.name,
        price: current.price,
        category: current.category,
        stock: current.stock,
      });
    }
  }, [current, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await dispatch(updateProduct({ id, changes: values })).unwrap();
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (!current) {
    return (
      <motion.div
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-content">
          <div className="loading-icon">⏳</div>
          <h3>{t("loadingProduct")}</h3>
          <p>{t("pleaseWaitFetchProductDetails")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="admin-product-edit-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1 className="page-title">✏️ {t("editProduct")}</h1>
          <p className="page-subtitle">
            {t("updateProductInformationDetails")}
          </p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {/* Product Preview */}
      <motion.div className="product-preview" variants={itemVariants}>
        <div className="preview-card">
          <div className="preview-header">
            <h3>{t("currentProduct")}</h3>
            <span className="product-id">ID: {current.id}</span>
          </div>

          <div className="preview-content">
            <div className="preview-image">
              <span className="image-placeholder">📦</span>
            </div>

            <div className="preview-details">
              <h4 className="product-name">{current.name}</h4>
              <div className="product-meta">
                <span className="meta-item">
                  <span className="meta-label">{t("price")}:</span>
                  <span className="meta-value price">${current.price}</span>
                </span>
                <span className="meta-item">
                  <span className="meta-label">{t("category")}:</span>
                  <span className="meta-value">
                    {current.category || "N/A"}
                  </span>
                </span>
                <span className="meta-item">
                  <span className="meta-label">{t("stock")}:</span>
                  <span className="meta-value stock">{current.stock || 0}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <motion.div className="edit-form-section" variants={itemVariants}>
        <div className="form-container">
          <h2 className="section-title">{t("editInformation")}</h2>

          <motion.form
            className="edit-form"
            onSubmit={handleSubmit(onSubmit)}
            variants={formVariants}
            noValidate
          >
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                {t("productName")}
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder={t("enterProductName")}
                {...register("name", {
                  required: t("productNameRequired"),
                  minLength: {
                    value: 2,
                    message: t("nameMustBeAtLeast2Characters"),
                  },
                })}
              />
              {errors.name && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name.message}
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">💰</span>
                {t("price")}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? "error" : ""}`}
                placeholder="0.00"
                {...register("price", {
                  required: t("priceRequired"),
                  min: { value: 0, message: t("priceMustBePositive") },
                })}
              />
              {errors.price && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.price.message}
                </motion.span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span>
                {t("category")}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={t("enterProductCategory")}
                {...register("category")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📦</span>
                {t("stockQuantity")}
              </label>
              <input
                type="number"
                min="0"
                className={`form-input ${errors.stock ? "error" : ""}`}
                placeholder="0"
                {...register("stock", {
                  min: { value: 0, message: t("stockMustBePositive") },
                })}
              />
              {errors.stock && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.stock.message}
                </motion.span>
              )}
            </div>

            <div className="form-actions">
              <motion.button
                type="button"
                className="btn btn-outline cancel-btn"
                onClick={() => navigate("/admin/products")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">❌</span>
                <span>{t("cancel")}</span>
              </motion.button>

              <motion.button
                type="submit"
                className="btn btn-primary save-btn"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">{isSubmitting ? "⏳" : "💾"}</span>
                <span>{isSubmitting ? t("saving") : t("saveChanges")}</span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductEdit;
