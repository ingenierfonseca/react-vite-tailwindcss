import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ClinicalNote } from "@/models/clinicalNote.type";

const method = ENDPOINTS.CLINICALNOTE
const baseService = createCatalogService<ClinicalNote>(method);

export const ClinicalNoteService =  {
    ...baseService,

    getNotesFromSession: async (sessionId: number): Promise<ClinicalNote[]> => {
        const { data } = await api.get(`${method}session/${sessionId}`);
        return data;
    },
};