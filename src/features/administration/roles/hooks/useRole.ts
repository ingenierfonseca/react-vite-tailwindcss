import { useState } from "react";
import { toast } from "react-toastify";
import type { AppRole } from "../../../../models/appRole.type";
import { RoleService } from "../../../../services/role/role.service";

export const useRole = () => {
    const [item, setItem] = useState<AppRole>({ id: 0, name: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        setError(null);
        if (!validate()) { setLoading(false); return success; }
        try {
            if (item.id) {
                await RoleService.put(item.id, item);
                toast.success("Rol actualizado correctamente");
            } else {
                await RoleService.post(item);
                toast.success("Rol creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el rol";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.name.trim()) { toast.error("El nombre del rol es requerido"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
