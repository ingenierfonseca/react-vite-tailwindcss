import { useState } from "react";
import type { Customer } from "../../../services/customer/customer.type";
import { CustomerService } from "../../../services/customer/customer.service";
import { toast } from "react-toastify";
import { validatePhoneNumber } from "../../../utils/number.util";
import { validateEmail } from "../../../utils/email.util";

export const usePatientCreateEdit = () => {
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const savePatient = async (): Promise<boolean> => {
        var success = false;
        setLoading(true);
        setError(null);

        if (validatePatient() === false) {
            setLoading(false);
            return success;
        }

        try {
            if (customer?.id) {
                await CustomerService.updateCustomer(customer.id, customer);
                toast.success("Paciente actualizado correctamente");
            } else {
                await CustomerService.addCustomer(customer);
                toast.success("Paciente creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear el paciente";
            setError(errorMessage);
            toast.error(errorMessage);
            success = false;
            throw err;
        } finally {
            setLoading(false);
            return success;
        }
    };

    function validatePatient() {
        if (!customer) {
            toast.error("No se ha inicializado el paciente");
            return false;
        }
        if (customer?.firstName.length === 0) {
            toast.error("El Nombre del Paciente es requerido");
            return false;
        }
        if (customer?.lastName.length === 0) {
            toast.error("El Apellido del Paciente es requerido");
            return false;
        }
        if (customer?.age <= 0) {
            toast.error("La Edad debe ser mayor a 0");
            return false;
        }

        if (customer?.phone.length > 0 && !validatePhoneNumber(customer.phone)) {
            toast.error("El Teléfono no es válido");
            return false;
        }

        if (customer?.email.length > 0 && !validateEmail(customer.email)) {
            toast.error("El Correo Electrónico no es válido");
            return false;
        }

        return true;
    }

    return {
        loading,
        error,
        savePatient,
        customer,
        setCustomer
    };
};