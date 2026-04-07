export interface CustomerInvoiceDTO {
    id: number;
    fullName: string;
    avatar: string;
    age: number;
    currencyId: number;
    balance: number;
    lastPayment: string;
    lastVisit: string;
    countPaid: number;
    countPending: number;
    countOverdue: number;
}