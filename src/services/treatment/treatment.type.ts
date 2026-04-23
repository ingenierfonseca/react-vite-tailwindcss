import type { Currency } from "../types/currency.type"

export interface Treatment {
    id: number
    name: string
    description: string
    currencyId: number
    price: number
    isActive: boolean
    durationMinutes: number
    currency?: Currency
}

export interface TreatmentInvoiceItemDto {
    id: number
    name: string
    currencyId: number
    price: number
    quantity: number
    tax: number
}