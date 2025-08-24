import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register as registerThunk } from "../store/slices/authSlice";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const schema = yup
  .object({
    username: yup
      .string()
      .min(5, "Username kamida 5 ta belgi bo'lishi kerak")
      .required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(6, "Parol kamida 6 ta belgi bo'lishi kerak")
      .required(),
  })
  .required();

type RegisterForm = { username: string; email: string; password: string };

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = (data: RegisterForm) => {
    dispatch(registerThunk(data));
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
      className="auth-page register-page"
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

          <h2 className="auth-title">{t("joinCommunity")}</h2>
          <p className="auth-subtitle">{t("createAccountStart")}</p>
        </motion.div>

        <motion.div className="auth-form-container" variants={formVariants}>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">👤 {t("username")}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className={`form-input ${errors.username ? "error" : ""}`}
                  placeholder="Enter your username"
                  {...register("username")}
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
              <label className="form-label">📧 {t("email")}</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email address"
                  {...register("email")}
                />
                <div className="input-border"></div>
              </div>
              {errors.email && (
                <motion.span
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email.message}
                </motion.span>
              )}
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label className="form-label">🔒 {t("password")}</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Create a strong password"
                  {...register("password")}
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
                {auth.status === "loading" ? "⏳" : "✨"}
              </span>
              <span>
                {auth.status === "loading"
                  ? "Creating Account..."
                  : "Create Account"}
              </span>
            </motion.button>

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

          {/* Login Link */}
          <motion.div className="auth-footer" variants={itemVariants}>
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
