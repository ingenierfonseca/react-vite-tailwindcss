import { useAuth } from "../provider/AuthProvider";
import { Role } from "../models/auth.type";

export function usePermissions() {
  const { user } = useAuth();

  const isSuperAdmin = user?.roles?.includes(Role.SuperAdmin) ?? false;

  const can = (action: "create" | "view" | "update", resource: string) => {
    if (isSuperAdmin) return true;
    return user?.permissions?.includes(`${resource}.${action}`) ?? false;
  };

  return { can, isSuperAdmin };
}
