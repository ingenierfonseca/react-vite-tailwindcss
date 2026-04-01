import type { DropDownAppModel } from "../../../models/dropdownapp.type";
import type { Invoice } from "../../../services/invoice/invoice.types";

export type State = {
    invoice: Invoice | null;
    loading: boolean;
    error: any;
};

export const InvoiceStatus = Object.freeze({
    DRAFT: 0,
    PENDING: 1,
    PAID: 2,
    OVERDUE: 3,
    CANCELLED: 4,
    PARTIAL: 5,
    REFUNDED: 6
});

export const InvoiceStatusLabels = {
    [InvoiceStatus.DRAFT]: "Borrador",
    [InvoiceStatus.PENDING]: "Pendiente",
    [InvoiceStatus.PAID]: "Pagada",
    [InvoiceStatus.OVERDUE]: "Vencida",
    [InvoiceStatus.CANCELLED]: "Cancelada",
    [InvoiceStatus.PARTIAL]: "Parcialmente pagada",
    [InvoiceStatus.REFUNDED]: "Reembolsada"
};

export const getInvoiceStatusOptions = (): DropDownAppModel[] => {
    return Object.values(InvoiceStatus).map(val => ({
        id: val,
        value: InvoiceStatusLabels[val]
    }));
};