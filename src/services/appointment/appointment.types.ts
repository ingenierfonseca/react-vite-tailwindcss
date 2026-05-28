import type { AppointmentType } from "../types/appointmentType.type";

export interface Appointment {
    id: number;
    patientId: number;
    patientFullName: string;
    doctorId: number;
    doctorName: string;
    chairId: number;
    chairName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
    appointmentTypeId: number
    appointmentType: AppointmentType
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface AppointmentStats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
}

export interface CreateAppointmentPayload {
    patientId: number;
    doctorId: number;
    chairId: number;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
}

export interface Chair {
    id: number;
    name: string;
}

export interface AppointmentFilters {
    startDate: string;
    endDate: string;
    doctorId?: number;
    status?: AppointmentStatus;
}
