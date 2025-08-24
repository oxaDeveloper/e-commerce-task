import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  const spinnerVariants = {
    animate: {
      rotate: 360,
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    },
  };

  const dotsVariants = {
    animate: {
      y: [0, -10, 0],
    },
  };

  return (
    <motion.div
      className="loading-spinner"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="spinner-container">
        {/* Main Spinner */}
        <motion.div
          className="spinner-ring"
          variants={spinnerVariants}
          animate="animate"
        >
          <div className="ring-1"></div>
          <div className="ring-2"></div>
          <div className="ring-3"></div>
        </motion.div>

        {/* Center Pulse */}
        <motion.div
          className="spinner-pulse"
          variants={pulseVariants}
          animate="animate"
        >
          <div className="pulse-circle"></div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>{t("loadingAmazingProducts")}</h3>
          <p>{t("pleaseWaitFetchingDeals")}</p>
        </motion.div>

        {/* Animated Dots */}
        <div className="loading-dots">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="dot"
              variants={dotsVariants}
              animate="animate"
              transition={{ delay: index * 0.2 }}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <motion.div
            className="floating-icon"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🚀
          </motion.div>
          <motion.div
            className="floating-icon"
            animate={{
              y: [0, -15, 0],
              rotate: [360, 180, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="floating-icon"
            animate={{
              y: [0, -25, 0],
              rotate: [0, -180, -360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            💎
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
