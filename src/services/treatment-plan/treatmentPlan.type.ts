export interface TreatmentPlan {
    id: number
    title: string
    description: string
    categoryId: number
    complexity: string
    estimatedDurationMonths: number
    basePrice: number
    version: number
    isActive: boolean
    items: TreatmentPlanItem[]
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
    totalEstimatedPrice: number
    comments: string
    items: SessionPlanItem[]
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