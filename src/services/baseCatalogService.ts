import api from "../api/api";
import type { PaginatedResponse, Result } from "../models/paginatedResponse";

interface GetParams {
    size?: number;
    page: number;
    search: string;
}

export function createCatalogService<T>(endpoint: string) {
    return {
        get: async ({ page, search, size }: GetParams): Promise<PaginatedResponse<T>> => {
            const { data } = await api.get(
                `${endpoint}?pageNumber=${page}&pageSize=${size || 15}${search ? `&search=${search}` : ''}`
            );
            return data;
        },
        find: async (id: number): Promise<T> => {
            const { data } = await api.get(
                `${endpoint}${id}`
            );
            return data;
        },
        post: async (payload: T) => {
            const { data } = await api.post(endpoint, payload);
            return data;
        },
        post_: async (payload: T): Promise<Result<T>> => {
            const { data } = await api.post(endpoint, payload);
            return data;
        },
        put: async (id: number, payload: T) => {
            const { data } = await api.put(`${endpoint}${id}`, payload);
            return data;
        },
    };
}