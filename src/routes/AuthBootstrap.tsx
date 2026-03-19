import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import storage from "../lib/storage";
import { hydrateAuth } from "../features/authSlice";
import Loading from "../components/ui/Loading";

// export default function AuthBootstrap({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useAppDispatch();
//   const { isHydrated } = useAppSelector((s) => s.auth);

//   useEffect(() => {
//     const auth = storage.get("auth");
//     dispatch(hydrateAuth(auth));
//   }, [dispatch]);

//   if (!isHydrated) {
//     return <Loading overlay fullScreen />;
//   }

//   return <>{children}</>;
// }

import { Outlet } from "react-router-dom";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const { isHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const auth = storage.get("auth");
    dispatch(hydrateAuth(auth));
  }, [dispatch]);

  if (!isHydrated) {
    return <Loading overlay fullScreen />;
  }

  return <Outlet />;
}
