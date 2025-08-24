import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  setPage,
  setQuery,
  Product,
} from "../store/slices/productsSlice";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import PaginationControls from "../components/PaginationControls";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

const ProductsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, total, page, size, status, error, query } = useAppSelector(
    (s) => s.products
  );
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchProducts({ page, size, ...query }));
  }, [dispatch, page, size, query]);

  const list = Array.isArray(items) ? items : [];

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

  return (
    <motion.div
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="header-content">
          <h1 className="page-title">{t("discoverProducts")}</h1>
          <p className="page-subtitle">{t("exploreCollection")}</p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        className="search-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SearchBar
          initialName={query.name}
          initialCategory={query.category}
          onSearch={(q) => {
            console.log("ProductsList: onSearch called with:", q);
            console.log("Current query before update:", query);
            dispatch(setQuery(q));
            dispatch(setPage(1));
            console.log(
              "Query and page updated, fetchProducts will be triggered"
            );
          }}
        />
      </motion.div>
      {/* Loading State */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage message={error || "Error"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Products State */}
      <AnimatePresence>
        {status === "idle" && list.length === 0 && (
          <motion.div
            className="no-products"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-products-content">
              <div className="no-products-icon">🔍</div>
              <h3>{t("noProductsFound")}</h3>
              <p>
                {query.name || query.category
                  ? `${t("noProductsMatchSearch")}: ${
                      query.name ? `${t("name")}: "${query.name}"` : ""
                    } ${
                      query.category
                        ? `${t("category")}: "${query.category}"`
                        : ""
                    }`
                  : t("tryAddingProducts")}
              </p>
              <div className="no-products-actions">
                <button className="btn btn-primary">
                  <span>🔄</span>
                  <span>{t("clearSearch")}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      {list.length > 0 && (
        <motion.div
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {list.map((p: Product, index: number) => (
            <motion.div
              key={p.id}
              variants={itemVariants}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <motion.div
          className="pagination-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PaginationControls
            page={page}
            size={size}
            total={total}
            onChange={(p) => dispatch(setPage(p))}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductsList;
