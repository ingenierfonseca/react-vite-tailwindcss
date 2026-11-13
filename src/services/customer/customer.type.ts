import type { Client } from "@/features/clients/domain/client";

export interface Customer extends Client {
    /*idType: number
    dni: string
    phone: string
    email: string
    address: string
    birthDate: string
    gender: string
    departmentId?: number | null
    departmentName?: string | null
    cityId?: number | null
    cityName?: string | null
    latitude?: number | null
    longitude?: number | null
    locationAccuracyMeters?: number | null
    locationSource?: "ManualMap" | "BrowserGps" | null
    locationUpdatedAtUtc?: string | null
    locationDataProvided?: boolean*/
}

export interface CustomerDashboard {
    title: string
    value: string
    trend: string
    change: string
}

export interface CustomerRiskDashboard {
    title: string
    description: string
    riskLevel: string
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
