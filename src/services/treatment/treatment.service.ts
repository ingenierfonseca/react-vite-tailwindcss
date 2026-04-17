import api from "../../api/api";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { Treatment } from "./treatment.type";

const method = `/treatment/`
export const TreatmentService = {
    get: async ({
        page,
        search
    }: { 
        page: number; search: string
     }): Promise<PaginatedResponse<Treatment>> => {
        const { data } = await api.get(`${method}?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    },
    post: async (payload: Treatment | null) => {
        const { data } = await api.post(`${method}`, payload);
        return data;
    },
    put: async (id: number, payload: Treatment | null) => {
        const { data } = await api.put(`${method}${id}`, payload);
        return data;
    }
};