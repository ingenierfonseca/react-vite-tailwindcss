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
    avatarUrl: string,
    title: string,
    firstName: string,
    lastName: string,
    staffName: string,
    serviceName: string,
    specialtyName: string
}