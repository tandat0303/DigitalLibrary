import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/auth";

export default function ProtectedRoute() {
  const { accessToken, user } = useAppSelector((s) => s.auth);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user } = useAppSelector((s) => s.auth);
  const isAdmin = user?.username.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
