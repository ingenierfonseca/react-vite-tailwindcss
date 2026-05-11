import type { DropDownAppModel } from "../../../models/dropdownapp.type";
import type { Invoice } from "../../../services/invoice/invoice.types";

export type State = {
    invoice: Invoice | null;
    loading: boolean;
    error: any;
};

export const InvoiceStatus = Object.freeze({
    PENDING: 1,
    PAID: 2,
    OVERDUE: 3,
    CANCELLED: 4,
    PARTIAL: 5,
    REFUNDED: 6
});

export const InvoiceStatusLabels = {
    [InvoiceStatus.PENDING]: "Pendiente",
    [InvoiceStatus.PAID]: "Pagada",
    [InvoiceStatus.OVERDUE]: "Vencida",
    [InvoiceStatus.CANCELLED]: "Cancelada",
    [InvoiceStatus.PARTIAL]: "Parcialmente pagada",
    [InvoiceStatus.REFUNDED]: "Reembolsada"
};

export const PaymentType = Object.freeze({
    CASH: 1,
    CARD: 2,
    TRANSFER: 3
});

export const PaymentTypeLabels = {
    [PaymentType.CASH]: "Efectivo",
    [PaymentType.CARD]: "Tarjeta de Credito/Debito",
    [PaymentType.TRANSFER]: "Transferencia Bancaria"
};

export const PaymentTypes = [
    { id: 1, value: PaymentTypeLabels[PaymentType.CASH] },
    { id: 2, value: PaymentTypeLabels[PaymentType.CARD] },
    { id: 3, value: PaymentTypeLabels[PaymentType.TRANSFER] }
];

export const getInvoiceStatusOptions = (): DropDownAppModel[] => {
    return Object.values(InvoiceStatus).map(val => ({
        id: val,
        value: InvoiceStatusLabels[val]
    }));
};