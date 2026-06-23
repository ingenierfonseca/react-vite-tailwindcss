import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ClinicalFile } from "@/models/clinicalFile.type";

const method = ENDPOINTS.CLINICALFILE
const baseService = createCatalogService<ClinicalFile>(method);

export const ClinicalFileService =  {
    ...baseService,

    getImagesFromSession: async (sessionId: number): Promise<ClinicalFile[]> => {
        const { data } = await api.get(`${method}session/${sessionId}/images`);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${method}${id}`);
    },

    uploadFile: async (item: ClinicalFile, file: any) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("clinicalSessionId", String(item.clinicalSessionId));
        formData.append("customerId", String(item.customerId));
        formData.append("typeId", String(item.typeId));
        formData.append("description", String(item.description));
        
        const { data } = await api.post(`${method}${'upload-file'}`, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
        return data;
    }
};