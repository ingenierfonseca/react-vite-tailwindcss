import api from "../../api/api";
import type { Invoice } from "./invoice.types";

const method = `/invoice/`
export const InvoiceService = {
    getAllInvoicess: async () => {
        const { data } = await api.get(`${method}`);
        return data;
    },
    addInvoice: async (payload: Invoice | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    }
};