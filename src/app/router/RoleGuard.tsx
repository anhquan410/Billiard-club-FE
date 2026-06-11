import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "../../libs/hooks/useAccount";
import {
  canAccessPath,
  getDefaultPathForRole,
  type AppRole,
} from "../../libs/utils/roleAccess";

export default function RoleGuard() {
  const { user } = useAccount();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user.role as AppRole;
  if (!canAccessPath(role, location.pathname)) {
    return <Navigate to={getDefaultPathForRole(role)} replace />;
  }

  return <Outlet />;
}
