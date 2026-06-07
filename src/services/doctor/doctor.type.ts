import type { Staff } from "@/models/staff.type"

export interface Doctor {
    id: number,
    staffId: number,
    serviceId: number,
    specialtyId: number,
    staff: Staff
}

export interface DoctorInfoDTO {
    id: number,
    firstName: string,
    lastName: string
}