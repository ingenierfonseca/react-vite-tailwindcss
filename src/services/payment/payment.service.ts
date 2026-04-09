import api from "../../api/api";
import type { Payment } from "./payment.type";

const method = `/payment/`
export const PaymentService = {
    addInvoice: async (payload: Payment | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    },
};