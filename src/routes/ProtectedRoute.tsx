import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/auth";

export default function ProtectedRoute() {
  const { accessToken, isHydrated } = useAppSelector((state) => state.auth);

  if (!isHydrated) return null;

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
