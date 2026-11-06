
import api from "@/api/api";
import type { TerminologyResponse } from "../types/terminology.types";
import { ENDPOINTS } from "@/api/endpoints";

export const TerminologyService = {
    async getTerminology(): Promise<TerminologyResponse> {
        const { data } = await api.get<TerminologyResponse>(ENDPOINTS.TERMINOLOGY.TRANSLATION);

        return data;
    },
    async getTerminologyByLanguage(code: string): Promise<TerminologyResponse> {
        const { data } = await api.get<TerminologyResponse>(ENDPOINTS.TERMINOLOGY.TRANSLATION + `/language/${code}/labels`);

        return data;
    }
};