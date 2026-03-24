export interface Invoice {
    id: number;
    invoiceNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    type: string;
    dateTime: string;
    status: string;
}