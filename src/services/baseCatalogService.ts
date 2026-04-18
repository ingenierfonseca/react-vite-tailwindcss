import api from "../api/api";
import type { PaginatedResponse } from "../models/paginatedResponse";

interface GetParams {
    page: number;
    search: string;
}

export function createCatalogService<T>(endpoint: string) {
    return {
        get: async ({ page, search }: GetParams): Promise<PaginatedResponse<T>> => {
            const { data } = await api.get(
                `${endpoint}?pageNumber=${page}${search ? `&search=${search}` : ''}`
            );
            return data;
        },

        post: async (payload: T) => {
            const { data } = await api.post(endpoint, payload);
            return data;
        },

        put: async (id: number, payload: T) => {
            const { data } = await api.put(`${endpoint}${id}`, payload);
            return data;
        },

        /*delete: async (id: number) => {
            const { data } = await api.delete(`${endpoint}${id}`);
            return data;
        }*/
    };
}