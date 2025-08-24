import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  page: number;
  size: number;
  total: number;
  onChange: (page: number) => void;
}

const PaginationControls: React.FC<Props> = ({
  page,
  total,
  size,
  onChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / size));

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.1, y: -2 },
    tap: { scale: 0.95 },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="pagination-controls"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Info */}
      <motion.div
        className="page-info"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="page-text">
          {t("Page")} {page} {t("of")} {totalPages}
        </span>
        <span className="total-text">
          {total} {t("totalItems")}
        </span>
      </motion.div>

      {/* Pagination Buttons */}
      <div className="pagination-buttons">
        {/* Previous Button */}
        <motion.button
          className={`pagination-btn prev-btn ${page === 1 ? "disabled" : ""}`}
          onClick={() => page > 1 && onChange(page - 1)}
          disabled={page === 1}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          animate="animate"
        >
          <span className="btn-icon">←</span>
          <span>{t("Previous")}</span>
        </motion.button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {pageNumbers.map((pageNum, index) => (
            <motion.div
              key={index}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.05 }}
            >
              {pageNum === "..." ? (
                <span className="page-ellipsis">{t("...")}</span>
              ) : (
                <motion.button
                  className={`page-btn ${pageNum === page ? "active" : ""}`}
                  onClick={() => onChange(pageNum as number)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  {pageNum}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          className={`pagination-btn next-btn ${
            page === totalPages ? "disabled" : ""
          }`}
          onClick={() => page < totalPages && onChange(page + 1)}
          disabled={page === totalPages}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          animate="animate"
        >
          <span>{t("Next")}</span>
          <span className="btn-icon">→</span>
        </motion.button>
      </div>

      {/* Quick Navigation */}
      <motion.div
        className="quick-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          className="quick-btn"
          onClick={() => onChange(1)}
          disabled={page === 1}
        >
          {t("First")}
        </button>
        <button
          className="quick-btn"
          onClick={() => onChange(totalPages)}
          disabled={page === totalPages}
        >
          {t("Last")}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PaginationControls;
