export interface ClinicalSession {
    id: number
    customerId: number
    doctorId: number
    date: string
    reasonForVisit: string
    clinicalNotes: string
}