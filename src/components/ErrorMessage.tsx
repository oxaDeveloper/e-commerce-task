import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();
  if (!message) return null;

  const errorVariants = {
    initial: { opacity: 0, y: -20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
  };

  const iconVariants = {
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  return (
    <motion.div
      className="error-message"
      variants={errorVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="error-container">
        <motion.div
          className="error-icon"
          variants={iconVariants}
          animate="animate"
        >
          ⚠️
        </motion.div>

        <div className="error-content">
          <h4 className="error-title">{t("oopsSomethingWentWrong")}</h4>
          <p className="error-text">{message}</p>
        </div>

        <motion.button
          className="error-close"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          ✕
        </motion.button>
      </div>

      {/* Error Decoration */}
      <div className="error-decoration">
        <div className="error-line"></div>
        <div className="error-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
