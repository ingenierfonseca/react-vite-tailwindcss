import { useAuth } from "../provider/AuthProvider";
import { Role } from "../models/auth.type";
import type { PermissionAction, PermissionResource } from "../models/permission.enum";

export function usePermissions() {
  const { user } = useAuth();

  const isSuperAdmin = user?.roles?.includes(Role.SuperAdmin) ?? false;

  const can = (action: PermissionAction, resource: PermissionResource) => {
    if (isSuperAdmin) return true;
    return user?.permissions?.includes(`${resource}.${action}`) ?? false;
  };

  return { can, isSuperAdmin };
}
