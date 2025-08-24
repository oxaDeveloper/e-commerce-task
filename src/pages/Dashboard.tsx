import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0
    )
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.02,
      y: -5,
    },
  };

  // Check if user is admin
  const isAdmin = user?.email === "admin@example.com";

  // Different quick actions for users vs admins
  const userQuickActions = [
    {
      title: t("browseProducts"),
      description: t("exploreCatalog"),
      icon: "📦",
      action: t("viewProducts"),
      gradient: "var(--primary-gradient)",
      onClick: () => navigate("/products"),
    },
    {
      title: t("viewOrders"),
      description: t("checkOrderHistory"),
      icon: "📋",
      action: t("myOrders"),
      gradient: "var(--secondary-gradient)",
      onClick: () => navigate("/orders"),
    },
    {
      title: t("shoppingCart"),
      description: `${t("manageCart")} (${cartCount} ${t("items")})`,
      icon: "🛒",
      action: t("viewCart"),
      gradient: "var(--accent-gradient)",
      onClick: () => navigate("/cart"),
    },
  ];

  const adminQuickActions = [
    {
      title: t("browseProducts"),
      description: t("viewManageProducts"),
      icon: "📦",
      action: t("manageProducts"),
      gradient: "var(--primary-gradient)",
      onClick: () => navigate("/admin/products"),
    },
    {
      title: t("manageOrders"),
      description: t("handleCustomerOrders"),
      icon: "📋",
      action: t("manageOrders"),
      gradient: "var(--secondary-gradient)",
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: t("addProduct"),
      description: t("createNewListings"),
      icon: "✨",
      action: t("addProduct"),
      gradient: "var(--accent-gradient)",
      onClick: () => navigate("/admin/products/new"),
    },
  ];

  const quickActions = isAdmin ? adminQuickActions : userQuickActions;

  return (
    <motion.div
      className="dashboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div className="welcome-header" variants={itemVariants}>
        <div className="welcome-content">
          <h1 className="welcome-title">
            {t("welcomeBack")}, {isAdmin ? "Admin" : user?.email || t("user")}!
            👋
          </h1>
          <p className="welcome-subtitle">
            {isAdmin
              ? t("manageEcommercePlatform")
              : t("ecommerceExperienceToday")}
          </p>
          {isAdmin && (
            <div className="admin-badge">
              <span className="badge-icon">👑</span>
              <span className="badge-text">{t("administrator")}</span>
            </div>
          )}
        </div>

        <div className="welcome-decoration">
          <div className="floating-shapes">
            <motion.div
              className="shape shape-1"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="shape shape-2"
              animate={{
                y: [0, -15, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="shape shape-3"
              animate={{
                y: [0, -25, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="actions-section" variants={itemVariants}>
        <h2 className="section-title">
          {isAdmin ? t("adminActions") : t("quickActions")}
        </h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="action-card"
              variants={cardVariants}
              whileHover="hover"
              style={
                { "--card-gradient": action.gradient } as React.CSSProperties
              }
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                <motion.button
                  className="btn btn-primary action-btn"
                  onClick={action.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.action}
                </motion.button>
              </div>
              <div className="action-glow"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
