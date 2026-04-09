export interface Payment {
    id: number
    amount: number
    invoiceId: number
    customerId: number
    paymentTypeId: number
}

export interface PaymentDTO {
    id: number
    amount: number
    invoiceNumber: string
    date: string
    paymentTypeName: string
}