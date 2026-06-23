import { useCatalog } from "../../../../hooks/useCatalog";
import { UserRoleService } from "../../../../services/user-role/userRole.service";
import type { UserRole } from "../../../../models/userRole.type";

export const useUserRoles = () => {
  const { setItem, ...rest } = useCatalog<UserRole>({
    fetchFn: UserRoleService.get,
  });

  const resetItem = () => {
    setItem(undefined);
  };

  return { resetItem, ...rest };
};
