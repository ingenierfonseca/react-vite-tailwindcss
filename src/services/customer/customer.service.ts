import api from "../../api/api";
import type { Customer } from "./customer.type";

const method = `/customers/`
export const CustomerService = {
    getAllCustomers: async (page: number, search?: string) => {
        const { data } = await api.get(`${method}?page=${page}${search ? `&search=${search}` : ''}`);
        return data;
    },
    getCustomer: async (id:string) => {
        const { data } = await api.get(`${method}${id}`);
        return data;
    },
    addCustomer: async (payload: Customer | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    }
};