export interface Payment {
    id: number
    currencyId: number
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

export interface RequestPayment {
    currencyId: number
    amount: number
    invoiceId: number
    customerId: number
    paymentTypeId: number
    operationTypeId: number
}