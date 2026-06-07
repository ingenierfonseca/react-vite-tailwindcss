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
};