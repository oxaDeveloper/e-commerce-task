import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface Props {
  role?: "ADMIN" | "USER";
  roles?: Array<"ADMIN" | "USER">;
}

const ProtectedRoute: React.FC<Props> = ({ role, roles }) => {
  const { token, user } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  const allowRoles = roles || (role ? [role] : undefined);
  if (allowRoles && user && !allowRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
