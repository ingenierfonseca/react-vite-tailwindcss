export interface ClinicalSession {
    id: number
    customerId: number
    doctorId: number
    date: string
    reasonForVisit: string
    clinicalNotes: string
    specialtyId: number;
    consultationTypeId: number;
    statusId: number;
}

export interface ClinicalSessionShortInfo {
    id: number;
    consultationNumber: string;
}

export interface ClinicalSessionImportDto {
    date: string;
    reasonForVisit: string;
    clinicalNotes?: string;
    doctorName?: string;
    specialtyName?: string;
    consultationTypeName?: string;
}