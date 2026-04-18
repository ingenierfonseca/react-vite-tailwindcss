import { useState } from "react";
import { toast } from "react-toastify";
import type { AppointmentType } from "../../../../services/types/appointmentType.type";
import { AppointmentTypeService } from "../../../../services/appointment-type/appointmentType.service";

export const useAppointmentType = () => {
    const [item, setItem] = useState<AppointmentType>({
        id: 0,
        name: '',
        description: '',
        time: '00:00:00',
        timeMinutes: 0
    })
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
            if (item?.id) {
                await AppointmentTypeService.put(item.id, item);
                toast.success("Tratamiento actualizado correctamente");
            } else {
                await AppointmentTypeService.post(item);
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
        if (item.name.length === 0) {
            toast.error("El Nombre es requerido");
            return false;
        }
        if (item.description.length === 0) {
            toast.error("La Descripcion es requerida");
            return false;
        }
        if (item.timeMinutes <= 0) {
            toast.error("La duración debe ser mayor a 0");
            return false;
        }

        return true;
    }

    return {
        loading,
        error,
        saveTreatment,
        item,
        setItem
    };
};