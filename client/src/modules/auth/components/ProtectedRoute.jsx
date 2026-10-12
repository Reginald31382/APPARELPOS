import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const isTokenExpired = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return true;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(
      atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")),
    );

    if (typeof decoded.exp !== "number") return true;

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children, roles = [] }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!token || isTokenExpired(token)) {
    if (token) logout();

    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const allowedRoles = roles.map((role) => role.toLowerCase());

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
