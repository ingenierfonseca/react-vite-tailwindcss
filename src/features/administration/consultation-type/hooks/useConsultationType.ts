import { useState } from "react";
import { toast } from "react-toastify";
import type { ConsultationType } from "../../../../models/consultation.type";
import { ConsultationTypeService } from "../../../../services/consultation-type/consultationType.service";

export const useConsultationType = () => {
    const [item, setItem] = useState<ConsultationType>({
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
                await ConsultationTypeService.put(item.id, item);
                toast.success("Tipo de consulta actualizado correctamente");
            } else {
                await ConsultationTypeService.post(item);
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
