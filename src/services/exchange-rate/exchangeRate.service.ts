import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";

export interface ExchangeRate {
    rate: number
}
const method = ENDPOINTS.EXCHANGERATE
const baseService = createCatalogService<ExchangeRate>(method);

export const ExchangeRateService =  {
    ...baseService,

    getLatest: async (from: number, to: number): Promise<ExchangeRate> => {
        const response = await api.get<ExchangeRate>(
            `${method}latest/${from}/${to}`
        );
        return response.data;
    }
}