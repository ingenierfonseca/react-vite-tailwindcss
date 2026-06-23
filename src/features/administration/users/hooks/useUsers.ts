import { useCatalog } from "../../../../hooks/useCatalog";
import { UserService } from "../../../../services/user/user.service";
import type { AdminUser } from "../../../../models/adminUser.type";

export const useUsers = () => {
    const { setItem, ...rest } = useCatalog<AdminUser>({
        fetchFn: UserService.get
    });

    const resetItem = () => {
        setItem(undefined);
    };

    return { resetItem, setItem, ...rest };
};
