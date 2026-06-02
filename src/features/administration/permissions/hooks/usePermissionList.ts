import { useCatalog } from "../../../../hooks/useCatalog";
import { PermissionService } from "../../../../services/permission/permission.service";
import type { Permission } from "../../../../models/permission.type";

export const usePermissionList = () => {
    const { setItem, ...rest } = useCatalog<Permission>({
        fetchFn: PermissionService.get
    });

    const resetItem = () => {
        setItem({ id: 0, name: "", description: "" });
    };

    return { resetItem, setItem, ...rest };
};
