import React, { useState } from "react";
import { Product, deleteProduct } from "../store/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAdmin = role === "ADMIN";
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const onAdd = () => {
    if (isAdmin) return;
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  };

  const onEdit = () => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  const onDelete = async () => {
    if (
      window.confirm(
        `${t("deleteProductConfirm")} "${product.name}"? ${t(
          "actionCannotBeUndone"
        )}`
      )
    ) {
      setIsDeleting(true);
      try {
        await dispatch(deleteProduct(product.id)).unwrap();
        // Product will be automatically removed from the list via Redux
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -2 },
  };

  return (
    <motion.div
      className="product-card"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Product Image Placeholder */}
      <motion.div
        className="product-image"
        variants={imageVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="image-placeholder">
          <span className="image-icon">📦</span>
        </div>
        <div className="image-overlay">
          <span className="category-badge">{product.category}</span>
        </div>
      </motion.div>

      {/* Product Content */}
      <div className="product-content">
        <motion.h3
          className="product-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {product.name}
        </motion.h3>

        <motion.div
          className="product-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="product-category">{product.category}</span>
          <motion.span
            className="product-price"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            ${product.price}
          </motion.span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="product-actions"
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          {isAdmin ? (
            <div className="admin-actions">
              <motion.button
                className="btn btn-outline btn-edit"
                onClick={onEdit}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                variants={buttonVariants}
              >
                <span className="btn-icon">✏️</span>
                <span>{t("edit")}</span>
              </motion.button>

              <motion.button
                className="btn btn-outline btn-delete"
                onClick={onDelete}
                disabled={isDeleting}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                variants={buttonVariants}
              >
                <span className="btn-icon">{isDeleting ? "⏳" : "🗑️"}</span>
                <span>{isDeleting ? t("deleting") : t("delete")}</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              className="btn btn-primary btn-add-cart"
              onClick={onAdd}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              variants={buttonVariants}
            >
              <span className="btn-icon">🛒</span>
              <span>{t("addToCart")}</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Hover Effects */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="card-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
