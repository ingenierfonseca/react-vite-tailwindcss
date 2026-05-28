import { useState } from "react";
import { toast } from "react-toastify";
import type { Currency } from "../../../../services/types/currency.type";
import { CurrencyService } from "../../../../services/currency/currency.service";

export const useCurrency = () => {
    const [item, setItem] = useState<Currency>({
        id: 0, name: "", code: "", symbol: ""
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
                await CurrencyService.put(item.id, item);
                toast.success("Moneda actualizada correctamente");
            } else {
                await CurrencyService.post(item);
                toast.success("Moneda creada correctamente");
            }
            success = true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al guardar la moneda";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
        return success;
    };

    function validate() {
        if (!item.name.trim()) { toast.error("El nombre es requerido"); return false; }
        if (!item.code.trim()) { toast.error("El código es requerido"); return false; }
        if (!item.symbol.trim()) { toast.error("El símbolo es requerido"); return false; }
        return true;
    }

    return { loading, error, save, item, setItem };
};
