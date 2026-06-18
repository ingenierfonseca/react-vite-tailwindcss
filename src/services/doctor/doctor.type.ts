import type { Staff } from "@/models/staff.type"

export interface Doctor {
    id: number,
    staffId: number,
    serviceId: number,
    specialtyId: number,
    title: string,
    staff?: Staff
}

export interface DoctorInfoDTO {
    id: number,
    avatar: string,
    title: string,
    firstName: string,
    lastName: string,
    service: string,
    specialty: string,
    birthDate: string
}