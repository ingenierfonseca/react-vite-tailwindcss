import { useState } from "react";
import { toast } from "react-toastify";
import type { Doctor } from "../../../../services/doctor/doctor.type";
import { DoctorService } from "../../../../services/doctor/doctor.service";

export const useDoctor = () => {
    const [item, setItem] = useState<Doctor>({
        id: 0, firstName: "", lastName: "", age: 0, specialist: "", phone: ""
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
        if (!item.firstName.trim()) { toast.error("El nombre es requerido"); return false; }
        if (!item.lastName.trim()) { toast.error("El apellido es requerido"); return false; }
        if (!item.specialist.trim()) { toast.error("La especialidad es requerida"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
