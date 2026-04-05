import { useState } from "react";
import type { Customer } from "../../../services/customer/customer.type";
import { CustomerService } from "../../../services/customer/customer.service";
import { toast } from "react-toastify";

export const usePatientCreateEdit = () => {
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const savePatient = async (payload: any) => {
        setLoading(true);
        setError(null);

        try {
            if (payload.id) {
                await CustomerService.updateCustomer(payload.id, payload);
                toast.success("Paciente actualizado correctamente");
            } else {
                await CustomerService.addCustomer(payload);
                toast.success("Paciente creado correctamente");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear el paciente";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        savePatient,
        customer,
        setCustomer
    };
};