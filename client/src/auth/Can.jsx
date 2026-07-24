import useAuthStore from "../modules/auth/store/useAuthStore";
import { PERMISSIONS } from "./permissions";

const Can = ({ permission, children, fallback = null }) => {
  const hasRole = useAuthStore((state) => state.hasRole);

  const allowedRoles = PERMISSIONS[permission] || [];

  return hasRole(...allowedRoles) ? children : fallback;
};

export default Can;
