import type { Invoice } from "../../../services/invoice/invoice.types";

export type State = {
    invoice: Invoice | null;
    loading: boolean;
    error: any;
};