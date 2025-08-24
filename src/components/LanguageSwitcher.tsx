import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLang = i18n.language;

  return (
    <motion.div
      className="language-switcher"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lang-buttons">
        <motion.button
          className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
          onClick={() => changeLanguage("en")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🇺🇸
        </motion.button>

        <motion.button
          className={`lang-btn ${currentLang === "uz" ? "active" : ""}`}
          onClick={() => changeLanguage("uz")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🇺🇿
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher;
