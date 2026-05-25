// src/hooks/useMenuPermission.ts
import { useAppSelector } from "./auth";

export type PermissionLevel = 0 | 1 | 2 | 3 | 4;

interface MenuPermission {
  level: PermissionLevel | undefined;
  isNoView: boolean;
  isViewOnly: boolean;
  isViewEdit: boolean;
  isFullAccess: boolean;
  canAction: boolean;
  canEdit: boolean;
}

export function useMenuPermission(menuNameEN: string): MenuPermission {
  const user = useAppSelector((s) => s.auth.user);

  const perm = user?.permission?.find((p) => p.menuNameEN === menuNameEN);
  const level = perm?.level as PermissionLevel | undefined;

  const isNoView = level === 3;
  const isViewOnly = level === 2;
  const isViewEdit = level === 4;
  const isFullAccess = level === 0 || level === 1;

  return {
    level,
    isNoView,
    isViewOnly,
    isViewEdit,
    isFullAccess,
    canAction: isFullAccess,
    canEdit: isFullAccess || isViewEdit,
  };
}
