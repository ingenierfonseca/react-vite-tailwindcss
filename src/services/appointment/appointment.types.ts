export interface Appointment {
    id: number;
    patientFullName: string;
    doctor: string;
    department: string;
    type: string;
    dateTime: string;
    status: string;
}