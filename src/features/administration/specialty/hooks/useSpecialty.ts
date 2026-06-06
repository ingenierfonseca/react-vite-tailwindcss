import { useState } from "react";
import { toast } from "react-toastify";
import type { Specialty } from "../../../../models/specialty.type";
import { SpecialtyService } from "../../../../services/specialty/specialty.service";

export const useSpecialty = () => {
    const [item, setItem] = useState<Specialty>({
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
                await SpecialtyService.put(item.id, item);
                toast.success("Especialidad actualizada correctamente");
            } else {
                await SpecialtyService.post(item);
                toast.success("Especialidad creada correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar la especialidad";
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
