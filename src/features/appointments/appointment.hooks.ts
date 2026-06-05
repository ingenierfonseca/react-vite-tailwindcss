import { useCallback, useEffect, useState } from "react";
import { AppointmentService } from "../../services/appointment/appointment.service"
import type { Appointment, AppointmentFilters, AppointmentInfoDto, AppointmentStats, CreateAppointmentPayload, UpdateAppointmentPayload } from "../../models/appointment.types";
import { AppointmentStatus } from "../../models/appointment.types";
import { toast } from "react-toastify";

const validTransitions: Record<number, number[]> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.RESCHEDULED],
    [AppointmentStatus.CONFIRMED]: [AppointmentStatus.IN_PROGRESS, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW, AppointmentStatus.RESCHEDULED],
    [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.CANCELLED]: [],
    [AppointmentStatus.NO_SHOW]: [],
    [AppointmentStatus.RESCHEDULED]: [AppointmentStatus.PENDING, AppointmentStatus.CANCELLED],
}

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

function validateStatusTransition(from: number | null | undefined, to: number): string | null {
    if (from == null) return null
    if (from === to) return null
    const allowed = validTransitions[from]
    if (!allowed) return "El estado actual no permite cambios"
    if (!allowed.includes(to)) return `No se puede cambiar de "${getStatusLabel(from)}" a "${getStatusLabel(to)}"`
    return null
}

function getStatusLabel(statusId: number): string {
    const labels: Record<number, string> = {
        [AppointmentStatus.PENDING]: "Pendiente",
        [AppointmentStatus.CONFIRMED]: "Confirmada",
        [AppointmentStatus.IN_PROGRESS]: "En progreso",
        [AppointmentStatus.COMPLETED]: "Completada",
        [AppointmentStatus.CANCELLED]: "Cancelada",
        [AppointmentStatus.NO_SHOW]: "No presentado",
        [AppointmentStatus.RESCHEDULED]: "Reagendada",
    }
    return labels[statusId] ?? "Desconocido"
}

export function useAppointmentForm() {
    const [appointment, setAppointment] = useState<Partial<Appointment>>({})
    const [lastStatusId, setLastStatusId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const updateAppointment = (field: keyof Appointment, value: any) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
    }

    const validate = (): { valid: boolean; message?: string } => {
        if (!appointment.customerId) return { valid: false, message: "Paciente es requerido" };
        if (!appointment.doctorId) return { valid: false, message: "Doctor es requerido" };
        if (!appointment.appointmentTypeId) return { valid: false, message: "Tipo de cita es requerido" };
        if (!appointment.resourceId) return { valid: false, message: "Recurso es requerido" };
        if (!appointment.date) return { valid: false, message: "Fecha es requerida" };
        if (!appointment.startTime) return { valid: false, message: "Hora de inicio es requerida" };

        if (appointment.id && lastStatusId != null && appointment.statusId != null) {
            const transitionError = validateStatusTransition(lastStatusId, appointment.statusId)
            if (transitionError) return { valid: false, message: transitionError }
        }

        return { valid: true };
    }

    const save = async () => {
        const validation = validate();
        if (!validation.valid) {
            setError(new Error(validation.message));
            toast.error(validation.message);
            return false;
        }

        const basePayload: CreateAppointmentPayload = {
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

            if (appointment.id && appointment.id > 0) {
                const updatePayload: UpdateAppointmentPayload = {
                    ...basePayload,
                    statusId: appointment.statusId!,
                    notes: appointment.notes,
                    cancellationReason: appointment.cancellationReason,
                    isConfirmed: appointment.isConfirmed,
                }
                await AppointmentService.update(appointment.id, updatePayload);
                toast.success("Cita actualizada correctamente");
            } else {
                await AppointmentService.create(basePayload);
                toast.success("Cita creada correctamente");
            }
        } catch (err: any) {
            console.log(err);
            const errorMessage = err.response?.data?.message || "Error al guardar la cita";
            setError(errorMessage);
            toast.error(errorMessage);
            result = false;
        } finally {
            setLoading(false);
            return result;
        }
    };

    return { save, loading, error, appointment, updateAppointment, setAppointment, lastStatusId, setLastStatusId };
}

export function useCreateAppointment() {
    const [appointment, setAppointment] = useState<Partial<Appointment>>({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const updateAppointment = (field: keyof Appointment, value: any) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
    }

    const create = async (_payload?: any) => {
        const validation = validate();
        if (!validation.valid) {
            setError(new Error(validation.message));
            toast.error(validation.message);
            return validation.valid;
        }

        const createPayload: CreateAppointmentPayload = {
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
            await AppointmentService.create(createPayload);
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
