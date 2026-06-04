import { useCatalog } from "../../../../hooks/useCatalog";
import { CurrencyService } from "../../../../services/currency/currency.service";
import type { Currency } from "../../../../models/currency.type";

export const useCurrencies = () => {
    const { setItem, ...rest } = useCatalog<Currency>({
        fetchFn: CurrencyService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: "", code: "", symbol: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
