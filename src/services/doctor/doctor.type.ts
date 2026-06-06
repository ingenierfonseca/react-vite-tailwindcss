export interface Doctor {
    id: number,
    staffId: number,
    serviceId: number,
    specialtyId: number,
}

export interface DoctorInfoDTO {
    id: number,
    firstName: string,
    lastName: string
}