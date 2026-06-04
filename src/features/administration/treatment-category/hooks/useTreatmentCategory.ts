import { useState } from "react";
import { toast } from "react-toastify";
import type { TreatmentCategory } from "../../../../models/treatmentCategory.type";
import { TreatmentCategoryService } from "../../../../services/treatmentCategory.service";

export const useTreatmentCategory = () => {
    const [item, setItem] = useState<TreatmentCategory>({
        id: 0, name: "", description: "", isActive: true
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
                await TreatmentCategoryService.put(item.id, item);
                toast.success("Categoría actualizada correctamente");
            } else {
                await TreatmentCategoryService.post(item);
                toast.success("Categoría creada correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar la categoría";
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
