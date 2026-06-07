import type { Doctor } from "@/services/doctor/doctor.type";

export interface ClinicalNote {
    id: number;
    clinicalSessionId: number;
    doctorId: number;
    note: string;
    createdAt: string;
    isPrivate: boolean;
    doctor?: Doctor;
}