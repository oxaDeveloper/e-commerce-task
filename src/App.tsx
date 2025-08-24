import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/ProductsList";
import AdminOrders from "./pages/AdminOrders";
import AdminProductNew from "./pages/AdminProductNew";
import AdminProductEdit from "./pages/AdminProductEdit";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from "./routes/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import "./i18n";

function App() {
  return (
    <div className="app">
      <Header />
      <motion.main
        className="main-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
            </Route>

            <Route element={<ProtectedRoute roles={["USER"]} />}>
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/new" element={<Cart />} />
            </Route>

            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products/new" element={<AdminProductNew />} />
              <Route
                path="/admin/products/:id/edit"
                element={<AdminProductEdit />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

export default App;
