import { useCatalog } from "../../../../hooks/useCatalog";
import { UserService } from "../../../../services/user/user.service";
import type { AdminUser } from "../../../../models/adminUser.type";

export const useUsers = () => {
    const { setItem, ...rest } = useCatalog<AdminUser>({
        fetchFn: UserService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, username: "", email: "", roles: [], permissions: [], isActive: true
        });
    };

    return { resetItem, setItem, ...rest };
};
