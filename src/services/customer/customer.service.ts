import api from "../../api/api";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { Customer } from "./customer.type";

const method = `/customers/`
export const CustomerService = {
    getDashboard: async () => {
        const { data } = await api.get(`${method}${`dashboard`}`);
        return data;
    },
    getAllCustomers: async ({
        page,
        search
    }: { 
        page: number; search: string
     }): Promise<PaginatedResponse<Customer>> => {
        const { data } = await api.get(`${method}?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    },
    getCustomer: async (id:string) => {
        const { data } = await api.get(`${method}${id}`);
        return data;
    },
    addCustomer: async (payload: Customer | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    },
    updateCustomer: async (id: number, payload: Customer | null) => {
        const { data } = await api.put(`${method}${id}`, payload);
        return data;
    }
};