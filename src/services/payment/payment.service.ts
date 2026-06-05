import type { Payment, PaymentBaucherDto, RequestPayment } from "./payment.type";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import api from "@/api/api";

const method = ENDPOINTS.PAYMENT
const baseService = createCatalogService<Payment>(method);

export const PaymentService =  {
    ...baseService,

    post: async (request: RequestPayment): Promise<Payment> => {
        const { data } = await api.post(`${method}`, request);
        return data;
    },
    getBaucher: async (id: number): Promise<PaymentBaucherDto> => {
        const { data } = await api.get(`${method}baucher/${id}`);
        return data;
    }
}