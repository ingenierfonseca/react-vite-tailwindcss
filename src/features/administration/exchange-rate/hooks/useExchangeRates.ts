import { useCatalog } from "../../../../hooks/useCatalog";
import { ExchangeRateService } from "../../../../services/exchange-rate/exchangeRate.service";
import type { ExchangeRate } from "../../../../models/exchangeRate.type";

export const useExchangeRates = () => {
    const { setItem, ...rest } = useCatalog<ExchangeRate>({
        fetchFn: ExchangeRateService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, fromCurrencyId: 0, toCurrencyId: 0, rate: 0, date: "", isActive:false
        });
    };

    return { resetItem, setItem, ...rest };
};
