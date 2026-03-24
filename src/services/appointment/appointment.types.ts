export interface Appointment {
    id: number;
    patientFullName: string;
    doctor: string;
    department: string;
    type: string;
    dateTime: string;
    status: string;
}

export interface Paggination {
    currentPage: number
    totalItems: number
    totalPages: number
    data: Appointment[]
}