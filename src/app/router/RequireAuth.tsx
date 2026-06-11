import { Navigate, Outlet } from "react-router";
import { useAccount } from "../../libs/hooks/useAccount";
import PageLoader from "../../components/common/PageLoader";

export default function RequireAuth() {
  const { user, isLoadingUser } = useAccount();

  if (isLoadingUser) {
    return <PageLoader minHeight="100vh" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}