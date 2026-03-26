export interface Invoice {
    id: number
    customerId: number
    number: string
    date: string
    dueDate: string
    subTotal: number
    taxTotal: number
    discountTotal: number
    total: number
    currencyId: number
    createdAt: string
    statusId: string
    createdBy: string
    items: InvoiceItem[]
}

export interface InvoiceItem {
    id: number
    productId: number
    serviceId: string
    description: string
    quantity: number
    unitPrice: number
    tax: number
    discount: number
    lineTotal: number
}

export const getInitialInvoice = (): Invoice => ({
    id: 0,
    customerId: 0,
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    subTotal: 0,
    taxTotal: 0,
    discountTotal: 0,
    total: 0,
    currencyId: 1,
    createdAt: new Date().toISOString(),
    statusId: 'Draft',
    createdBy: '',
    items: [getInitialInvoiceItem()]
});

export const getInitialInvoiceItem = (): InvoiceItem => ({
    id: 0,
    productId: 0,
    serviceId: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    tax: 0,
    discount: 0,
    lineTotal: 0
});