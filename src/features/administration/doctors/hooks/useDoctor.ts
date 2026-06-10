import { useState } from "react";
import { toast } from "react-toastify";
import type { Doctor } from "../../../../services/doctor/doctor.type";
import { DoctorService } from "../../../../services/doctor/doctor.service";

export const useDoctor = () => {
    const [item, setItem] = useState<Doctor>({
        id: 0, serviceId: 0, specialtyId: 0, staffId: 0, title: ""
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
                await DoctorService.put(item.id, item);
                toast.success("Doctor actualizado correctamente");
            } else {
                await DoctorService.post(item);
                toast.success("Doctor creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el doctor";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (item.staffId === 0) { toast.error("Seleccione un empleado"); return false; }
        if (item.serviceId === 0) { toast.error("Seleccione un area"); return false; }
        if (item.specialtyId === 0) { toast.error("Seleccione una especialidad"); return false; }
        if (!item.title.trim()) { toast.error("Seleccione un titulo"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
