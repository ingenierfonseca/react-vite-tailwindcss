import type { Currency } from "../types/currency.type"

export interface TreatmentPlan {
    id: number
    title: string
    description: string
    categoryId: number
    currencyId: number
    complexity: string
    estimatedDurationMonths: number
    basePrice: number
    version: number
    isActive: boolean
    items: TreatmentPlanItem[]
    currency: Currency
}

export interface TreatmentPlanItem {
    id: number
    teplateId: number
    name: string
    status: string
    order: number
}

export interface SessionPlan {
    id: number
    sessionId: number
    //title: string
    name: string
    status: string
    startDate: string
    endDate: string
    currencyId: number
    totalEstimatedPrice: number
    comments: string
    items: SessionPlanItem[]
    currency?: Currency
}

export interface SessionPlanItem {
    id: number
    sessionPlanMasterId: number
    treatmentPlanTemplateItemId: number
    name: string
    status: string
    order: number
}

export interface RequestSessionPlanMaster {
    sessionId: number
    name: string
    status: string
    currencyId: number
    //startDate: string
    //endDate: string
    //totalEstimatedPrice: number
    comments: string
    plansIds: number[]
}