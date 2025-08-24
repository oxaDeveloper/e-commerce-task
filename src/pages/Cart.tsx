import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeItem,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/ordersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmailFromJwt, getUsernameFromJwt } from "../utils/jwt";
import { getLastKnownEmail } from "../utils/storage";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);
  const auth = useAppSelector((s) => s.auth);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();
  const derivedEmail =
    auth.user?.email || // First priority: backend user email
    getLastKnownEmail() || // Second priority: stored email
    getEmailFromJwt(auth.token) || // Third priority: JWT email
    (auth.user?.id && auth.user.id.includes("@") ? auth.user.id : "") || // Fourth: if user.id is actually an email
    "";
  const [manualEmail, setManualEmail] = useState<string>("");

  // Debug: log email sources
  console.log("Email sources:", {
    authUserEmail: auth.user?.email,
    authUserId: auth.user?.id,
    lastKnownEmail: getLastKnownEmail(),
    jwtEmail: getEmailFromJwt(auth.token),
    finalEmail: derivedEmail,
  });

  const total = useMemo(
    () =>
      items.reduce(
        (sum: number, i: { price: number; quantity: number }) =>
          sum + i.price * i.quantity,
        0
      ),
    [items]
  );

  const onCheckout = async () => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    const email = derivedEmail || manualEmail;
    if (!email) {
      toast.error("Email kiriting.");
      return;
    }
    const derivedName =
      auth.user?.id ||
      getUsernameFromJwt(auth.token) ||
      email.split("@")[0] ||
      "Customer";

    try {
      setSubmitting(true);
      await dispatch(
        createOrder({
          customerEmail: email,
          customerName: derivedName,
          items: items.map((i: { productId: string; quantity: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        })
      ).unwrap();
      toast.success("Order placed successfully");
      dispatch(clearCart());
      navigate("/orders");
    } catch (e) {
      // Error toasts are handled globally in the interceptor
    } finally {
      setSubmitting(false);
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

  return (
    <motion.div
      className="cart-page"
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
          <h1 className="page-title">🛒 {t("shoppingCart")}</h1>
          <p className="page-subtitle">{t("reviewItemsComplete")}</p>
        </div>

        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          className="empty-cart"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h3>{t("cartEmpty")}</h3>
            <p>{t("noProductsAdded")}</p>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🚀</span>
              <span>{t("startShopping")}</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Warning for dev admin login */}
          {auth.user?.email === "admin@example.com" && (
            <motion.div
              className="admin-warning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="warning-content">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <h4>{t("devAdminLoginDetected")}</h4>
                  <p>{t("pleaseLogoutLoginRealAccount")}</p>
                  <div className="warning-actions">
                    <motion.button
                      className="btn btn-outline"
                      onClick={() => navigate("/")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t("goToDashboard")}
                    </motion.button>
                    <motion.button
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t("clearDataReload")}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Input Section */}
          {!derivedEmail && (
            <motion.div className="email-section" variants={itemVariants}>
              <div className="email-content">
                <h3>📧 {t("emailAddressRequired")}</h3>
                <p>{t("pleaseEnterEmailContinue")}</p>
                {auth.user?.id && auth.user.id.includes("@") && (
                  <div className="email-suggestion">
                    💡 {t("suggestionTryUsing")} "{auth.user.id}"{" "}
                    {t("asYourEmail")}
                  </div>
                )}
                <div className="email-input-wrapper">
                  <input
                    type="email"
                    className="email-input"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder={
                      auth.user?.id && auth.user.id.includes("@")
                        ? auth.user.id
                        : t("enterYourEmailAddress")
                    }
                  />
                  <div className="input-border"></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cart Items */}
          <motion.div className="cart-items-section" variants={itemVariants}>
            <h2 className="section-title">
              {t("cartItems")} ({items.length})
            </h2>

            <div className="cart-items">
              {items.map((item: any, index: number) => (
                <motion.div
                  key={item.productId}
                  className="cart-item-card"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="item-image">
                    <span className="item-icon">📦</span>
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <span className="item-price">${item.price}</span>
                      <span className="item-total">
                        {t("total")}: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="item-quantity">
                    <label>{t("quantity")}:</label>
                    <div className="quantity-controls">
                      <motion.button
                        className="quantity-btn"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <span className="quantity-value">{item.quantity}</span>
                      <motion.button
                        className="quantity-btn"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    className="remove-btn"
                    onClick={() => dispatch(removeItem(item.productId))}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🗑️
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Checkout Section */}
          <motion.div className="checkout-section" variants={itemVariants}>
            <div className="checkout-card">
              <div className="checkout-summary">
                <div className="summary-item">
                  <span>{t("items")}:</span>
                  <span>{items.length}</span>
                </div>
                <div className="summary-item total">
                  <span>{t("total")}:</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                className="btn btn-primary checkout-btn"
                onClick={onCheckout}
                disabled={submitting || (!derivedEmail && !manualEmail)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">{submitting ? "⏳" : "🚀"}</span>
                <span>{submitting ? t("placingOrder") : t("placeOrder")}</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Cart;
