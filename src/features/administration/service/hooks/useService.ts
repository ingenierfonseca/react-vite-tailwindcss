import type { Service } from "@/models/service.type";
import { ServiceService } from "@/services/service/service.service";
import { useState } from "react";
import { toast } from "react-toastify";

export const useService = () => {
    const [item, setItem] = useState<Service>({
        id: 0, name: "", isActive: true
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
                await ServiceService.put(item.id, item);
                toast.success("Tipo de consulta actualizado correctamente");
            } else {
                await ServiceService.post(item);
                toast.success("Tipo de consulta creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el tipo de consulta";
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
