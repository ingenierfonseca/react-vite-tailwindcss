import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Currency } from "../types/currency.type";

const method = ENDPOINTS.CURRENCY
const baseService = createCatalogService<Currency>(method);

export const CurrencyService =  {
    ...baseService,

    getActive: async (): Promise<Currency> => {
        const response = await api.get<Currency>(
            `${method}/active`
        );
        return response.data;
    }
}