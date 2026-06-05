import type { AppointmentType } from "./appointmentType.type";

export interface Appointment {
    id: number;
    customerId: number;
    patientFullName: string;
    doctorId: number;
    doctorName: string;
    resourceId: number;
    resourceName: string;
    date: string;
    startTime: string;
    endTime: string;
    statusId: number;
    notes?: string;
    cancellationReason?: string;
    isConfirmed: boolean;
    reminderSent: boolean;
    appointmentTypeId: number
    appointmentType: AppointmentType
}

export const AppointmentStatus = Object.freeze({
    PENDING: 1,
    CONFIRMED: 2,
    IN_PROGRESS: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    NO_SHOW: 6,
    RESCHEDULED: 7
});

export const InvoiceStatusLabels = {
    [AppointmentStatus.PENDING]: "Pendiente",
    [AppointmentStatus.CONFIRMED]: "Confirmada",
    [AppointmentStatus.IN_PROGRESS]: "En progreso",
    [AppointmentStatus.COMPLETED]: "Completada",
    [AppointmentStatus.CANCELLED]: "Cancelada",
    [AppointmentStatus.NO_SHOW]: "No presentado",
    [AppointmentStatus.RESCHEDULED]: "Reagendada"
};

export interface AppointmentStats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
}

export interface CreateAppointmentPayload {
    customerId: number;
    doctorId: number;
    resourceId: number;
    date: string;
    startTime: string;
    appointmentTypeId: number;
}

export interface UpdateAppointmentPayload {
    customerId: number;
    doctorId: number;
    resourceId: number;
    date: string;
    startTime: string;
    appointmentTypeId: number;
    statusId: number;
    notes?: string;
    cancellationReason?: string;
    isConfirmed?: boolean;
}

export interface Chair {
    id: number;
    name: string;
}

export interface AppointmentFilters {
    startDate: string;
    endDate: string;
    doctorId?: number;
    statusId?: number;
}

export interface AppointmentInfoDto {
    id: number;
    customerId: number;
    doctorId: number;
    resourceId: number;
    statusId: number;
    appointmentTypeId: number;
    date: string;
    startTime: string;
    endTime: string;
    patientName: string;
    doctorName: string;
    resourceName: string;
    typeName: string;
    statusName: string;
    notes?: string;
}
