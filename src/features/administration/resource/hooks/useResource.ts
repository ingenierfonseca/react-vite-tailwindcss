import { useState } from "react";
import { toast } from "react-toastify";
import type { Resource } from "../../../../models/resource.type";
import { ResourceService } from "../../../../services/resource/resource.service";

export const useResource = () => {
    const [item, setItem] = useState<Resource>({
        id: 0, resourceTypeId: 0, name: "", description: "",
        capacity: 1, color: "#3b82f6", isActive: true
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
                await ResourceService.put(item.id, item);
                toast.success("Recurso actualizado correctamente");
            } else {
                await ResourceService.post(item);
                toast.success("Recurso creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el recurso";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.resourceTypeId) { toast.error("El tipo de recurso es requerido"); return false; }
        if (!item.name.trim()) { toast.error("El nombre es requerido"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
