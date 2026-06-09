export interface Customer {
    id: number
    dni: string
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    birthDate: string
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

export interface CustomerImportDto {
    DNI: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
}

export interface ResponseImportResult {
    totalRows: number
    successCount: number
    errorCount: number
    errors: RowError[]
    processingTimeSeconds: number
}

export interface RowError {
    rowNumber: number
    errorMessage: string
}