export interface Consultation {
    id: number;
    customerId: number;
    doctorId: number;
    specialtyId: number;
    date: string;
    consultationReason: string;
    consultationTypeId: number;
    statusId: number;
    notes: string;
}