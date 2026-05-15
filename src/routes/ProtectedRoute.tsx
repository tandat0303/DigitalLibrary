import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/auth";
import { vendorHiddenPaths } from "../components/ui/HomeButtons";

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

export function VendorGuard() {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();

  const hasVendor = Boolean(user?.vendorCode);

  const isHiddenPath = vendorHiddenPaths.some((p) =>
    location.pathname.startsWith(p),
  );

  if (isHiddenPath && hasVendor) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
