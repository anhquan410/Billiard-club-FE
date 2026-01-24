import { Typography } from "@mui/material";
import { Navigate, Outlet } from "react-router";
import { useAccount } from "../../libs/hooks/useAccount";

export default function RequireAuth() {
  const { user, isLoadingUser } = useAccount();

  if (isLoadingUser) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}