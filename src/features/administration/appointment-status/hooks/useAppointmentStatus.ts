import { useState } from "react";
import { toast } from "react-toastify";
import type { AppointmentStatus } from "../../../../models/appointmentStatus.type";
import { AppointmentStatusService } from "../../../../services/appointment-status/appointmentStatus.service";

export const useAppointmentStatus = () => {
    const [item, setItem] = useState<AppointmentStatus>({
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
                await AppointmentStatusService.put(item.id, item);
                toast.success("Estado de cita actualizado correctamente");
            } else {
                await AppointmentStatusService.post(item);
                toast.success("Estado de cita creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el estado de cita";
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
