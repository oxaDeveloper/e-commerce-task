import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { token, user } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce(
      (sum: number, i: { quantity: number }) => sum + i.quantity,
      0
    )
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isAdmin = token && user?.role === "ADMIN";

  const navItems = token
    ? [
        { path: "/", label: t("dashboard"), icon: "🏠" },
        { path: "/products", label: t("products"), icon: "📦" },
        ...(isAdmin
          ? [
              { path: "/admin/orders", label: t("manageOrders"), icon: "📋" },
              {
                path: "/admin/products/new",
                label: t("addProduct"),
                icon: "➕",
              },
            ]
          : [
              { path: "/orders", label: t("orders"), icon: "📋" },
              {
                path: "/orders/new",
                label: t("cart"),
                icon: "🛒",
                badge: cartCount,
              },
            ]),
      ]
    : [
        { path: "/login", label: t("login"), icon: "🔐" },
        { path: "/register", label: t("register"), icon: "📝" },
      ];

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    scrolled: {
      y: 0,
      opacity: 1,
      backgroundColor: "rgba(15, 15, 35, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -2, scale: 1.05 },
  };

  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? "scrolled" : "animate"}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="header-container">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/" className="logo-link">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">E-Com.</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              variants={navItemVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover="hover"
              className="nav-item-wrapper"
            >
              <Link
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <motion.span
                    className="nav-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          ))}

          <LanguageSwitcher />

          {token && (
            <motion.div
              className="user-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="user-info">
                <span className="user-role">{user?.role}</span>
                <button
                  className="btn btn-ghost logout-btn"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span>{t("logout")}</span>
                </button>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </motion.button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="nav-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`nav-item-mobile ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                </motion.div>
              ))}

              {token && (
                <motion.div
                  className="user-section-mobile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="user-info">
                    <span className="user-role">{user?.role}</span>
                    <button
                      className="btn btn-ghost logout-btn"
                      onClick={handleLogout}
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
