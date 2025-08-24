import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  login,
  setCredentials,
  disableDeveloperMode,
} from "../store/slices/authSlice";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface LoginForm {
  username: string;
  password: string;
}

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().min(4).required(),
  })
  .required();

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);
  const { t } = useTranslation();

  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4 },
    },
  };

  if (auth.token) return <Navigate to="/" replace />;

  return (
    <motion.div
      className="auth-page login-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Decoration */}
      <div className="auth-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="auth-container">
        <motion.div className="auth-header" variants={itemVariants}>
          <motion.div
            className="logo-section"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="logo-icon">🚀</span>
            <h1 className="logo-text">E-Commerce</h1>
          </motion.div>

          <h2 className="auth-title">{t("welcomeBack")}</h2>
          <p className="auth-subtitle">{t("signInToContinue")}</p>
        </motion.div>

        <motion.div className="auth-form-container" variants={formVariants}>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">👤 {t("usernameOrEmail")}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className={`form-input ${errors.username ? "error" : ""}`}
                  placeholder="Enter your username or email"
                  {...reg("username")}
                />
                <div className="input-border"></div>
              </div>
              {errors.username && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.username.message}
                </motion.span>
              )}
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">🔒 {t("password")}</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  {...reg("password")}
                />
                <div className="input-border"></div>
              </div>
              {errors.password && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password.message}
                </motion.span>
              )}
            </motion.div>

            <motion.button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={auth.status === "loading"}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="btn-icon">
                {auth.status === "loading" ? "⏳" : "🚀"}
              </span>
              <span>
                {auth.status === "loading" ? t("signingIn") : t("signIn")}
              </span>
            </motion.button>

            {/* Dev Admin Login */}
            {process.env.NODE_ENV !== "production" && (
              <motion.button
                type="button"
                className="btn btn-ghost dev-btn"
                onClick={() => {
                  dispatch(
                    setCredentials({
                      token: "dev-admin-token",
                      user: {
                        id: "dev-admin",
                        email: "admin@example.com",
                        role: "ADMIN",
                      },
                    })
                  );
                  navigate("/");
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-icon">🧪</span>
                <span>{t("devLoginAsAdmin")}</span>
              </motion.button>
            )}

            {/* Developer Mode Options */}
            {auth.developerMode && (
              <motion.div
                className="developer-mode-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="developer-mode-header">
                  <span className="developer-mode-icon">🧪</span>
                  <span className="developer-mode-title">Developer Mode</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm disable-dev-btn"
                    onClick={() => dispatch(disableDeveloperMode())}
                    title="Disable Developer Mode"
                  >
                    ✕
                  </button>
                </div>

                <motion.button
                  type="button"
                  className="btn btn-secondary dev-admin-btn"
                  onClick={() => {
                    dispatch(
                      setCredentials({
                        token: "dev-admin-token",
                        user: {
                          id: "dev-admin",
                          email: "admin@example.com",
                          role: "ADMIN",
                        },
                      })
                    );
                    navigate("/");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-icon">👑</span>
                  <span>Login as Admin</span>
                </motion.button>

                <motion.button
                  type="button"
                  className="btn btn-ghost dev-user-btn"
                  onClick={() => {
                    dispatch(
                      setCredentials({
                        token: "dev-user-token",
                        user: {
                          id: "dev-user",
                          email: "user@example.com",
                          role: "USER",
                        },
                      })
                    );
                    navigate("/");
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-icon">👤</span>
                  <span>Login as User</span>
                </motion.button>
              </motion.div>
            )}

            {/* Error Display */}
            <AnimatePresence>
              {auth.error && (
                <motion.div
                  className="auth-error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{auth.error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Registration Link */}
          <motion.div className="auth-footer" variants={itemVariants}>
            <p className="footer-text">
              {t("dontHaveAccount")}{" "}
              <Link to="/register" className="footer-link">
                {t("createOneHere")}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
