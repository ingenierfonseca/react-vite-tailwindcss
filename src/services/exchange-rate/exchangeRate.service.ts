import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ExchangeRate } from "../../models/exchangeRate.type";

const method = ENDPOINTS.EXCHANGERATE
const baseService = createCatalogService<ExchangeRate>(method);

export const ExchangeRateService =  {
    ...baseService,

    getLatest: async (from: number, to: number): Promise<{ rate: number }> => {
        const response = await api.get<{ rate: number }>(
            `${method}latest/${from}/${to}`
        );
        return response.data;
    }
}