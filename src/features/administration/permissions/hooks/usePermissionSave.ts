import { useState } from "react";
import { toast } from "react-toastify";
import type { Permission } from "../../../../models/permission.type";
import { PermissionService } from "../../../../services/permission/permission.service";

export const usePermissionSave = () => {
    const [item, setItem] = useState<Permission>({ id: 0, name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        setError(null);
        if (!validate()) { setLoading(false); return success; }
        try {
            if (item.id) {
                await PermissionService.put(item.id, item);
                toast.success("Permiso actualizado correctamente");
            } else {
                await PermissionService.post(item);
                toast.success("Permiso creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el permiso";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.name.trim()) { toast.error("El nombre del permiso es requerido"); return false; }
        if (!item.description.trim()) { toast.error("La descripción del permiso es requerida"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
