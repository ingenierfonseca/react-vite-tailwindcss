import { useAuth } from "../provider/AuthProvider";
import { Role } from "../models/auth.type";

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.roles?.includes(Role.Admin) ?? false;

  const can = (action: "create" | "view" | "update", resource: string) => {
    if (isAdmin) return true;
    return user?.permissions?.includes(`${resource}.${action}`) ?? false;
  };

  return { can, isAdmin };
}
