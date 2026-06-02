import { useCatalog } from "../../../../hooks/useCatalog";
import { RoleService } from "../../../../services/role/role.service";
import type { AppRole } from "../../../../models/appRole.type";

export const useRoles = () => {
    const { setItem, ...rest } = useCatalog<AppRole>({
        fetchFn: RoleService.get
    });

    const resetItem = () => {
        setItem({ id: 0, name: "" });
    };

    return { resetItem, setItem, ...rest };
};
