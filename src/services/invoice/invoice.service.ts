import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { InvoicePrint } from "../../models/invoicePrint.type";
import { createCatalogService } from "../baseCatalogService";
import type { CustomerDashboard } from "../customer/customer.type";
import type { PaymentDTO } from "../payment/payment.type";
import type { CustomerInvoiceDTO } from "./customerinvoice.dto.type";
import type { Invoice, InvoiceInfoDTO } from "./invoice.types";

const method = ENDPOINTS.INVOICE
const baseService = createCatalogService<Invoice>(method);

export const InvoiceService =  {
    ...baseService,

    getDashboard: async ():Promise<CustomerDashboard[]> => {
        const { data } = await api.get<CustomerDashboard[]>(`${method}dashboard`);
        return data;
    },
    getCustomerIvoicesDashboard: async ({
        page,
        search
    }: {
        page: number; search: string
     }): Promise<PaginatedResponse<CustomerInvoiceDTO>> => {
        const { data } = await api.get(`${method}dashboard-customers?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    },
    getInvoicesByCustomer: async (id:number): Promise<InvoiceInfoDTO[]> => {
        const { data } = await api.get<InvoiceInfoDTO[]>(`${method}customer/${id}`);
        return data;
    },
    getPaymentHistoryByCustomer: async (id:number): Promise<PaymentDTO[]> => {
        const { data } = await api.get<PaymentDTO[]>(`${method}customer/${id}/payments`);
        return data;
    },
    print: async (id: number): Promise<InvoicePrint> => {
        const { data } = await api.get<InvoicePrint>(`${method}${id}/print`);
        return data;
    }
}