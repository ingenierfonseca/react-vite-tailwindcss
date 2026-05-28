import { useCallback, useEffect, useState } from "react";
import { AppointmentService } from "../../services/appointment/appointment.service"
import type { Appointment, AppointmentFilters, AppointmentStats, CreateAppointmentPayload } from "../../services/appointment/appointment.types";

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
    const [appointments, setAppointments] = useState<Appointment[]>([]);
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
    }, [filters?.startDate, filters?.endDate, filters?.doctorId, filters?.status]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { appointments, loading, error, refetch: fetch };
}

export function useCreateAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const create = async (payload: CreateAppointmentPayload) => {
        try {
            setLoading(true);
            setError(null);
            const result = await AppointmentService.create(payload);
            return { success: true, data: result };
        } catch (err) {
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}
