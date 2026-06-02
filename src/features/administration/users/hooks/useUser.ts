import { useState } from "react";
import { toast } from "react-toastify";
import type { AdminUser } from "../../../../models/adminUser.type";
import { UserService } from "../../../../services/user/user.service";

export const useUser = () => {
    const [item, setItem] = useState<AdminUser>({
        id: 0, username: "", email: "", roles: [], permissions: [], isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        setError(null);
        if (!validate()) { setLoading(false); return success; }
        try {
            if (item.id) {
                await UserService.put(item.id, item);
                toast.success("Usuario actualizado correctamente");
            } else {
                await UserService.post(item);
                toast.success("Usuario creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el usuario";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (item.roles.length === 0) { toast.error("Debe seleccionar al menos un rol"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
