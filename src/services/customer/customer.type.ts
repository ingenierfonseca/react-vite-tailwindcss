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
    avatar?: string
}

export interface CustomerDashboard {
    title: string
    value: string
    trend: string
    change: string
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
    avatar?: string
    lastVisit: string
    nextAppointment: string
    balanceDue: number
}