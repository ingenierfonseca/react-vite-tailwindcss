import { useState } from "react";
import { toast } from "react-toastify";
import type { Treatment } from "../../../../services/treatment/treatment.type";
import { TreatmentService } from "../../../../services/treatment/treatment.service";

export const useTreatment = () => {
    const [treatment, setTreatment] = useState<Treatment | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const saveTreatment = async (): Promise<boolean> => {
        var success = false;
        setLoading(true);
        setError(null);

        if (validateTreatment() === false) {
            setLoading(false);
            return success;
        }

        try {
            if (treatment?.id) {
                await TreatmentService.put(treatment.id, treatment);
                toast.success("Tratamiento actualizado correctamente");
            } else {
                await TreatmentService.post(treatment);
                toast.success("Tratamiento creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear el tratamiento";
            setError(errorMessage);
            toast.error(errorMessage);
            success = false;
            throw err;
        } finally {
            setLoading(false);
            return success;
        }
    };

    function validateTreatment() {
        if (!treatment) {
            toast.error("No se ha inicializado el tratamiento");
            return false;
        }
        if (treatment?.name.length === 0) {
            toast.error("El Tratamiento es requerido");
            return false;
        }
        if (treatment?.description.length === 0) {
            toast.error("La Descripcion es requerida");
            return false;
        }
        if (!treatment?.currencyId) {
            toast.error("Debe seleccionar una moneda");
            return false;
        }
        if (treatment?.price <= 0) {
            toast.error("El Precio debe ser mayor a 0");
            return false;
        }

        return true;
    }

    return {
        loading,
        error,
        saveTreatment,
        treatment,
        setTreatment
    };
};