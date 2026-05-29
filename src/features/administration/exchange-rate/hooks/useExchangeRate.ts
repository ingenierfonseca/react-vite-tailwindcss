import { useState } from "react";
import { toast } from "react-toastify";
import type { ExchangeRate } from "../../../../services/types/exchangeRate.type";
import { ExchangeRateService } from "../../../../services/exchange-rate/exchangeRate.service";

export const useExchangeRate = () => {
    const [item, setItem] = useState<ExchangeRate>({
        id: 0, fromCurrencyId: 0, toCurrencyId: 0, rate: 0, date: "", isActive:true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const save = async (): Promise<boolean> => {
        let success = false;
        setLoading(true);
        setError(null);
        if (!validate()) { setLoading(false); return success; }
        try {
            if (item.id) {
                await ExchangeRateService.put(item.id, item);
                toast.success("Tipo de cambio actualizado correctamente");
            } else {
                await ExchangeRateService.post(item);
                toast.success("Tipo de cambio creado correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar el tipo de cambio";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.fromCurrencyId) { toast.error("La moneda origen es requerida"); return false; }
        if (!item.toCurrencyId) { toast.error("La moneda destino es requerida"); return false; }
        if (item.fromCurrencyId === item.toCurrencyId) { toast.error("Las monedas deben ser diferentes"); return false; }
        if (!item.rate || item.rate <= 0) { toast.error("La tasa debe ser mayor a 0"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
