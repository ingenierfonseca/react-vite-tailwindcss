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
    status: string
    templateItem: TreatmentPlanItem
}

export interface RequestSessionPlanMaster {
    sessionId: number
    name: string
    status: string
    currencyId: number
    paymentTermId: number
    isFinanced: boolean
    downPayment: number
    comments: string
    plansIds: number[]
}

export interface RequestStatusUpdate {
    id: number
    itemId: number
    status: string
}

export const PlanStatus = Object.freeze({
    PENDING: 'Pendiente',
    INPROCESS: 'En Proceso',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    SUSPENDED: 'Suspendido'
});

/*export const PlanStatusLabels = {
    PlanStatus.PENDING,
    PlanStatus.INPROCESS,
    PlanStatus.COMPLETED,
    PlanStatus.CANCELLED,
    PlanStatus.SUSPENDED
};*/