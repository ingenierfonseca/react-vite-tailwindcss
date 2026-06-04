import { useState } from "react";
import { toast } from "react-toastify";
import type { ResourceType } from "../../../../models/resourceType.type";
import { ResourceTypeService } from "../../../../services/resource-type/resourceType.service";

export const useResourceType = () => {
    const [item, setItem] = useState<ResourceType>({
        id: 0, name: ""
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
                await ResourceTypeService.put(item.id, item);
                toast.success("Tipo de recurso actualizado correctamente");
            } else {
                await ResourceTypeService.post(item);
                toast.success("Tipo de recurso creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el tipo de recurso";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.name.trim()) { toast.error("El nombre es requerido"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
