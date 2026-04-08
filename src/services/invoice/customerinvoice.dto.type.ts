export interface CustomerInvoiceDTO {
    id: number;
    fullName: string;
    avatar: string;
    age: number;
    currencyId: number;
    currency: string;
    balance: number;
    lastPayment: string;
    lastVisit: string;
    countPaid: number;
    countPending: number;
    countOverdue: number;
    balances: CurrencyBalanceDTO[];
}

export interface CurrencyBalanceDTO {
    symbol: string;
    code: string;
    amount: number;
}