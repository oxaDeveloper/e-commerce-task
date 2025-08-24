import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch } from "../store/hooks";
import { createProduct } from "../store/slices/productsSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  category: yup.string().optional(),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .optional(),
});

type FormValues = {
  name: string;
  price: number;
  category?: string;
  stock?: number;
};

const AdminProductNew: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: yupResolver(schema) as any });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(createProduct(data)).unwrap();
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
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

  return (
    <motion.div
      className="admin-product-new-page"
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
          <h1 className="page-title">✨ {t("addNewProduct")}</h1>
          <p className="page-subtitle">{t("createNewProductAddInventory")}</p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {/* Product Creation Guide */}
      <motion.div className="creation-guide" variants={itemVariants}>
        <div className="guide-card">
          <div className="guide-icon">📋</div>
          <div className="guide-content">
            <h3>{t("productCreationGuide")}</h3>
            <div className="guide-steps">
              <div className="guide-step">
                <span className="step-number">1</span>
                <span className="step-text">
                  {t("fillInProductDetailsBelow")}
                </span>
              </div>
              <div className="guide-step">
                <span className="step-number">2</span>
                <span className="step-text">
                  {t("ensureAllRequiredFieldsCompleted")}
                </span>
              </div>
              <div className="guide-step">
                <span className="step-number">3</span>
                <span className="step-text">
                  {t("clickCreateProductToSave")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create Form */}
      <motion.div className="create-form-section" variants={itemVariants}>
        <div className="form-container">
          <h2 className="section-title">{t("productInformation")}</h2>

          <motion.form
            className="create-form"
            onSubmit={handleSubmit(onSubmit)}
            variants={formVariants}
            noValidate
          >
            <div className="form-group">
              <label className="form-label required">
                <span className="label-icon">📝</span>
                {t("productName")}
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder={t("enterProductNameExample")}
                {...register("name")}
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
              <label className="form-label required">
                <span className="label-icon">💰</span>
                {t("price")}
              </label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input price-input ${
                    errors.price ? "error" : ""
                  }`}
                  placeholder="0.00"
                  {...register("price")}
                />
              </div>
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
                placeholder={t("enterProductCategoryExample")}
                {...register("category")}
              />
              <span className="field-hint">
                {t("optionalHelpsOrganizeProducts")}
              </span>
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
                {...register("stock")}
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
              <span className="field-hint">
                {t("optionalSetTo0IfOutOfStock")}
              </span>
            </div>

            <div className="form-actions">
              <motion.button
                type="button"
                className="btn btn-outline reset-btn"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">🔄</span>
                <span>{t("resetForm")}</span>
              </motion.button>

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
                className="btn btn-primary create-btn"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">{isSubmitting ? "⏳" : "✨"}</span>
                <span>{isSubmitting ? t("creating") : t("createProduct")}</span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductNew;
