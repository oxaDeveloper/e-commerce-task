import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMyOrders } from "../store/slices/ordersSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "../store/slices/ordersSlice";
import { useTranslation } from "react-i18next";

const MyOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.orders);
  const email = useAppSelector((s) => s.auth.user?.email);
  const { t } = useTranslation();

  useEffect(() => {
    if (email) dispatch(fetchMyOrders(email));
  }, [dispatch, email]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "var(--warning-color)";
      case "CONFIRMED":
        return "var(--accent-color)";
      case "SHIPPED":
        return "var(--success-color)";
      case "CANCELLED":
        return "var(--error-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "CONFIRMED":
        return "✅";
      case "SHIPPED":
        return "🚚";
      case "CANCELLED":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Processing";
      case "CONFIRMED":
        return "Confirmed";
      case "SHIPPED":
        return "Shipped";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <motion.div
      className="my-orders-page"
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
          <h1 className="page-title">📦 {t("myOrders")}</h1>
          <p className="page-subtitle">{t("trackOrdersStatus")}</p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {/* Orders Summary */}
      <motion.div className="orders-summary" variants={itemVariants}>
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3>{t("orderSummary")}</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">{t("totalOrders")}:</span>
                <span className="stat-value">
                  {Array.isArray(items) ? items.length : 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t("activeOrders")}:</span>
                <span className="stat-value">
                  {Array.isArray(items)
                    ? items.filter(
                        (o) =>
                          o.status !== "CANCELLED" && o.status !== "SHIPPED"
                      ).length
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
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

      {/* Orders List */}
      {status === "idle" && Array.isArray(items) && items.length > 0 && (
        <motion.div className="orders-section" variants={itemVariants}>
          <h2 className="section-title">{t("orderHistory")}</h2>

          <div className="orders-grid">
            {items.map((order, index) => (
              <motion.div
                key={order.id}
                className="order-card"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <div className="order-header">
                  <div className="order-id">
                    <span className="id-label">{t("orderId")}:</span>
                    <span className="id-value">{order.id}</span>
                  </div>
                  <div
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    <span className="status-icon">
                      {getStatusIcon(order.status)}
                    </span>
                    <span className="status-text">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">{t("orderDate")}:</span>
                    <span className="detail-value">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">{t("totalAmount")}:</span>
                    <span className="detail-value total-amount">
                      ${order.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="order-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-title">Order Placed</span>
                      <span className="timeline-time">Just now</span>
                    </div>
                  </div>

                  {order.status === "CONFIRMED" && (
                    <div className="timeline-item active">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Order Confirmed</span>
                        <span className="timeline-time">Processing</span>
                      </div>
                    </div>
                  )}

                  {order.status === "SHIPPED" && (
                    <div className="timeline-item active">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Order Shipped</span>
                        <span className="timeline-time">On the way</span>
                      </div>
                    </div>
                  )}

                  {order.status === "CANCELLED" && (
                    <div className="timeline-item cancelled">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Order Cancelled</span>
                        <span className="timeline-time">Cancelled</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {status === "idle" && (!Array.isArray(items) || items.length === 0) && (
        <motion.div
          className="empty-orders"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-orders-content">
            <div className="empty-orders-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              order history here!
            </p>
            <motion.button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🚀</span>
              <span>Start Shopping</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyOrders;
