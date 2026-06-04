import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import type { AppointmentFilters, AppointmentInfoDto, AppointmentStats, CreateAppointmentPayload } from "../../models/appointment.types";

const method = ENDPOINTS.APPOINTMENT

export const AppointmentService = {
    getAllAppointments: async (filters?: AppointmentFilters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.doctorId) params.append('doctorId', String(filters.doctorId));
        if (filters?.statusId) params.append('statusId', String(filters.statusId));
        const queryString = params.toString();
        const { data } = await api.get(`${method}${queryString ? `?${queryString}` : ''}`);
        return data.data as AppointmentInfoDto[];
    },

    getStats: async (filters?: AppointmentFilters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        const queryString = params.toString();
        const { data } = await api.get(`${method}stats${queryString ? `?${queryString}` : ''}`);
        return data as AppointmentStats;
    },

    create: async (payload: CreateAppointmentPayload) => {
        const { data } = await api.post(method, payload);
        return data;
    },

    update: async (id: number, payload: Partial<CreateAppointmentPayload>) => {
        const { data } = await api.put(`${method}${id}`, payload);
        return data;
    },

    getChairs: async () => {
        const { data } = await api.get(`${method}chairs`);
        return data as { id: number; name: string }[];
    }
};
