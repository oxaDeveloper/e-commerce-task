import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders, updateOrderStatus } from "../store/slices/ordersSlice";
import { OrderStatus } from "../types/order";
import { Order } from "../store/slices/ordersSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { ALL_ORDER_STATUSES } from "../types/order";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.orders);
  const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchOrders());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (order: Order, status: OrderStatus) => {
    dispatch(updateOrderStatus({ id: order.id, status }));
  };

  const handleCancel = async (order: Order) => {
    if (order.status !== "PENDING") {
      return; // Only PENDING orders can be cancelled
    }

    if (window.confirm(`Are you sure you want to cancel order ${order.id}?`)) {
      setCancellingIds((prev) => new Set(prev).add(order.id));
      try {
        await dispatch(
          updateOrderStatus({ id: order.id, status: "CANCELLED" })
        ).unwrap();
      } catch (error) {
        console.error("Failed to cancel order:", error);
      } finally {
        setCancellingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(order.id);
          return newSet;
        });
      }
    }
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.02,
      y: -5,
    },
  };

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusIcon = (status: OrderStatus) => {
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

  return (
    <motion.div
      className="admin-orders-page"
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
          <h1 className="page-title">📋 {t("manageOrders")}</h1>
          <p className="page-subtitle">{t("monitorManageOrders")}</p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div className="orders-stats" variants={itemVariants}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{t("totalOrders")}</h3>
              <p className="stat-value">{items.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{t("pending")}</h3>
              <p className="stat-value">
                {items.filter((o: Order) => o.status === "PENDING").length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{t("confirmed")}</h3>
              <p className="stat-value">
                {items.filter((o: Order) => o.status === "CONFIRMED").length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <h3>{t("shipped")}</h3>
              <p className="stat-value">
                {items.filter((o: Order) => o.status === "SHIPPED").length}
              </p>
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
      {status === "idle" && items.length > 0 && (
        <motion.div className="orders-section" variants={itemVariants}>
          <h2 className="section-title">Order Details</h2>

          <div className="orders-grid">
            {items.map((order: Order, index: number) => (
              <motion.div
                key={order.id}
                className="order-card"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                <div className="order-header">
                  <div className="order-id">
                    <span className="id-label">Order ID:</span>
                    <span className="id-value">{order.id}</span>
                  </div>
                  <div
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    <span className="status-icon">
                      {getStatusIcon(order.status)}
                    </span>
                    <span className="status-text">{order.status}</span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">Customer:</span>
                    <span className="detail-value">{order.customerEmail}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value total-amount">
                      ${order.totalAmount}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Items:</span>
                    <span className="detail-value">
                      {order.items?.length || 0} items
                    </span>
                  </div>
                </div>

                <div className="order-actions">
                  <div className="status-selector">
                    <label>Update Status:</label>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleChange(order, e.target.value as OrderStatus)
                      }
                      disabled={
                        order.status === "SHIPPED" ||
                        order.status === "CANCELLED"
                      }
                    >
                      {ALL_ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {order.status === "PENDING" && (
                    <motion.button
                      className="btn btn-outline btn-warning cancel-btn"
                      onClick={() => handleCancel(order)}
                      disabled={cancellingIds.has(order.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="btn-icon">
                        {cancellingIds.has(order.id) ? "⏳" : "❌"}
                      </span>
                      <span>
                        {cancellingIds.has(order.id)
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {status === "idle" && items.length === 0 && (
        <motion.div
          className="empty-orders"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-orders-content">
            <div className="empty-orders-icon">📋</div>
            <h3>No Orders Yet</h3>
            <p>There are no orders to manage at the moment</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;
