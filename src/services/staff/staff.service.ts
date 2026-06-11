import { createCatalogService } from "../baseCatalogService";
import type { Staff } from "@/models/staff.type";
import { ENDPOINTS } from "@/api/endpoints";
import api from "@/api/api";

const method = ENDPOINTS.STAFF
const baseService = createCatalogService<Staff>(method);

export const StaffService = {
    ...baseService,
    uploadAvatar: async (id: number, file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post(`${method}${id}${'/upload-avatar'}`, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
        return data;
    }
}
