export interface Customer {
    id: number
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    age: number
    //dateOfBirth: string
    gender: string
    avatarUrl?: string
}


export interface CustomerFormData {
    id: number
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    dateOfBirth: string
    gender: string
    avatarUrl?: string
    lastVisit: string
    nextAppointment: string
    balanceDue: number
}