import api from "../../api/api";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { CustomerInvoiceDTO } from "./customerinvoice.dto.type";
import type { Invoice } from "./invoice.types";

const method = `/invoice/`
export const InvoiceService = {
    getCustomerIvoicesDashboard: async ({
        page,
        search
    }: { 
        page: number; search: string
     }): Promise<PaginatedResponse<CustomerInvoiceDTO>> => {
        const { data } = await api.get(`${method}dashboard?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    },
    getAllInvoicess: async () => {
        const { data } = await api.get(`${method}`);
        return data;
    },
    getInvoice: async (id:string) => {
        const { data } = await api.get(`${method}${id}`);
        return data;
    },
    addInvoice: async (payload: Invoice | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    },
    getInvoicesByCustomer: async (id:number) => {
        const { data } = await api.get(`${method}customer/${id}`);
        return data;
    },
    getPaymentHistoryByCustomer: async (id:number) => {
        const { data } = await api.get(`${method}customer/${id}/payments`);
        return data;
    }
};