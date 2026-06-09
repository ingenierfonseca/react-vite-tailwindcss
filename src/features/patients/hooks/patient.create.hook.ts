import { useRef, useState, type ChangeEvent } from "react";
import type { Customer } from "../../../services/customer/customer.type";
import { CustomerService } from "../../../services/customer/customer.service";
import { toast } from "react-toastify";
import { validatePhoneNumber } from "../../../utils/number.util";
import { validateEmail } from "../../../utils/email.util";
import { validateBirthDate } from "@/utils/date.util";

export const usePatientCreateEdit = () => {
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

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
                await CustomerService.put(customer.id, customer);
                toast.success("Paciente actualizado correctamente");
            } else {
                await CustomerService.post(customer!);
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

    const uploadAvatar = async (): Promise<boolean> => {
        var success = false;
        setLoading(true);
        setError(null);

        try {
            await CustomerService.uploadAvatar(customer!.id, selectedImage);
            toast.success("Avatar actualizado correctamente");
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
    }

    function validatePatient() {
        if (!customer) {
            toast.error("No se ha inicializado el paciente");
            return false;
        }
        if (customer?.dni.length === 0) {
            toast.error("La Identificación del Paciente es requerida");
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
        if (customer?.gender.length === 0) {
            toast.error("El gener del Paciente es requerido");
            return false;
        }
        if (customer?.birthDate.trim().length >  0)
        {
            const resultValidate = validateBirthDate(new Date(customer.birthDate));
            if (!resultValidate.isValid) {
                toast.error(resultValidate.message);
                return;
            }
        }

        if (customer?.phone.trim().length > 0 && !validatePhoneNumber(customer.phone.trim())) {
            toast.error("El Teléfono no es válido");
            return false;
        }

        if (customer?.email.trim().length > 0 && !validateEmail(customer.email.trim())) {
            toast.error("El Correo Electrónico no es válido");
            return false;
        }

        return true;
    }

    return {
        loading,
        error,
        savePatient,
        uploadAvatar,
        customer,
        setCustomer,
        fileInputRef,
        selectedImage,
        handleUploadClick,
        handleFileChange
    };
};