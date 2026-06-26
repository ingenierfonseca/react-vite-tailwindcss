import type { InvoiceItem } from "../invoice/invoice.types"

export interface Payment {
    id: number
    currencyId: number
    amount: number
    memo?: string
    invoiceId: number
    customerId: number
    paymentTypeId: number
}

export interface PaymentDTO {
    id: number
    currencySymbol: string
    amount: number
    invoiceNumber: string
    date: string
    paymentTypeName: string
}

export interface RequestPayment {
    currencyId: number
    amount: number
    memo?: string
    invoiceId: number
    customerId: number
    paymentTypeId: number
    operationTypeId: number
}

export interface PaymentBaucherDto {
    companyName: string;
    companyNIT: string;
    companyAddress: string;
    companyPhone: string;
    receiptNumber: string;
    invoiceNumber: string;
    paymentDate: string;
    amountPaid: number;
    memo?: string;
    paymentMethod: string;
    currencySymbol: string;
    isPartialPayment: boolean;
    invoiceTotal: number;
    previousBalance: number;
    remainingBalance: number;
    items: InvoiceItem[];
}