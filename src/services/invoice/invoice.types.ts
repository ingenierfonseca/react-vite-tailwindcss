export interface Invoice {
    id: number
    customerId: number
    customerName: string
    number: string
    issueDate: string
    dueDate: string
    subTotal: number
    taxTotal: number
    discountTotal: number
    total: number
    currencyId: number
    createdAt: string
    statusId: number
    paymentTermId: number
    createdBy: string
    items: InvoiceItem[]
}

export interface InvoiceItem {
    id: number
    productId: number
    serviceId: number
    description: string
    quantity: number
    unitPrice: number
    tax: number
    discount: number
    lineTotal: number
}

export interface InvoiceInfoDTO {
    id: number
    number: string
    issueDate: string
    dueDate: string
    subTotal: number
    taxTotal: number
    discountTotal: number
    total: number
    currency: string
    status: string
    paymentTerm: string
    statusId: number
}

export const getInitialInvoice = (): Invoice => ({
    id: 0,
    customerId: 0,
    customerName: '',
    number: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    subTotal: 0,
    taxTotal: 0,
    discountTotal: 0,
    total: 0,
    currencyId: 1,
    createdAt: new Date().toISOString().split('T')[0],
    statusId: 1,
    createdBy: '',
    paymentTermId: 1,
    items: [getInitialInvoiceItem()]
});

export const getInitialInvoiceItem = (): InvoiceItem => ({
    id: 0,
    productId: 0,
    serviceId: 0,
    description: '',
    quantity: 1,
    unitPrice: 0,
    tax: 0,
    discount: 0,
    lineTotal: 0
});