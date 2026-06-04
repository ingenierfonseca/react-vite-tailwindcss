import { useCallback, useEffect, useState } from "react";
import { AppointmentService } from "../../services/appointment/appointment.service"
import type { Appointment, AppointmentFilters, AppointmentInfoDto, AppointmentStats, CreateAppointmentPayload } from "../../models/appointment.types";
import { toast } from "react-toastify";

export function useAppointmentStats(filters?: AppointmentFilters) {
    const [stats, setStats] = useState<AppointmentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const data = await AppointmentService.getStats(filters);
            setStats(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [filters?.startDate, filters?.endDate]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { stats, loading, error, refetch: fetch };
}

export function useAppointmentSchedule(filters?: AppointmentFilters) {
    const [openTransition, setOpenTransition] = useState(false)
    const [appointments, setAppointments] = useState<AppointmentInfoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const data = await AppointmentService.getAllAppointments(filters);
            setAppointments(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [filters?.startDate, filters?.endDate, filters?.doctorId, filters?.statusId]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { appointments, loading, error, refetch: fetch, openTransition, setOpenTransition };
}

export function useCreateAppointment() {
    const [appointment, setAppointment] = useState<Partial<Appointment>>({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const updateAppointment = (field: keyof Appointment, value: any) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
    }

    const create = async () => {
        const validation = validate();
        if (!validation.valid) {
            setError(new Error(validation.message));
            toast.error(validation.message);
            return validation.valid;
        }

        const payload: CreateAppointmentPayload = {
            customerId: appointment.customerId!,
            doctorId: appointment.doctorId!,
            resourceId: appointment.resourceId!,
            date: appointment.date!,
            startTime: appointment.startTime!,
            appointmentTypeId: appointment.appointmentTypeId!,
        };

        let result = true;
        try {
            setLoading(true);
            setError(null);
            await AppointmentService.create(payload);
            toast.success("Cita creada correctamente");
        } catch (err: any) {console.log(err);
            const errorMessage = err.response?.data?.message || "Error al guardar la cita";
            setError(errorMessage);
            toast.error(errorMessage);
            result = false;
        } finally {
            setLoading(false);
            return result;
        }
    };

    const validate = (): { valid: boolean; message?: string } => {
        if (!appointment.customerId) return { valid: false, message: "Paciente es requerido" };
        if (!appointment.doctorId) return { valid: false, message: "Doctor es requerido" };
        if (!appointment.appointmentTypeId) return { valid: false, message: "Tipo de cita es requerido" };
        if (!appointment.resourceId) return { valid: false, message: "Recurso es requerido" };
        if (!appointment.date) return { valid: false, message: "Fecha es requerida" };
        if (!appointment.startTime) return { valid: false, message: "Hora de inicio es requerida" };
        return { valid: true };
    }

    return { create, loading, error, appointment, updateAppointment, setAppointment };
}
