import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  initialName?: string;
  initialCategory?: string;
  onSearch: (params: { name?: string; category?: string }) => void;
}

const SearchBar: React.FC<Props> = ({
  initialName,
  initialCategory,
  onSearch,
}) => {
  const [name, setName] = useState(initialName || "");
  const [category, setCategory] = useState(initialCategory || "");
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();

  const handleSearch = () => {
    const searchParams = {
      name: name.trim() || undefined,
      category: category.trim() || undefined,
    };
    console.log("SearchBar: handleSearch called with:", searchParams);
    onSearch(searchParams);
  };

  const handleClear = () => {
    setName("");
    setCategory("");
    onSearch({});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="search-bar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="search-container">
        {/* Search Icon */}
        <motion.div
          className="search-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🔍
        </motion.div>

        {/* Search Inputs */}
        <div className="search-inputs">
          <motion.div className="input-group" variants={itemVariants}>
            <label className="input-label">{t("productName")}</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="search-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t("enterProductName")}
              />
              <div className="input-border"></div>
            </div>
          </motion.div>

          <motion.div className="input-group" variants={itemVariants}>
            <label className="input-label">{t("category")}</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="search-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t("enterCategory")}
              />
              <div className="input-border"></div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="search-actions">
          <motion.button
            className="btn btn-primary search-btn"
            onClick={handleSearch}
            disabled={!name.trim() && !category.trim()}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">🔍</span>
            <span>{t("search")}</span>
          </motion.button>

          <AnimatePresence>
            {(name || category) && (
              <motion.button
                className="btn btn-ghost clear-btn"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="btn-icon">🗑️</span>
                <span>{t("clear")}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="search-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="suggestion-item">
              <span className="suggestion-icon">💡</span>
              <span>{t("pressEnterToSearch")}</span>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">🔍</span>
              <span>{t("leaveFieldsEmptyToSeeAll")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
