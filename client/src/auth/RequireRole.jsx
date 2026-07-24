import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth/useAuthStore";

const RequireRole = ({ roles, children }) => {
  const hasRole = useAuthStore((state) => state.hasRole);

  return hasRole(...roles) ? children : <Navigate to="/" replace />;
};

export default RequireRole;
