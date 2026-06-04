import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { ExchangeRate } from "../../../../models/exchangeRate.type";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { CurrencyService } from "@/services/currency/currency.service";
import NumberInputApp from "@/components/commons/NumberInputApp";
import { Checkbox, FormControlLabel } from "@mui/material";

interface ExchangeRateFormProps {
    itemParam?: ExchangeRate;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function ExchangeRateForm({ itemParam, setIsOpen, reload }: ExchangeRateFormProps) {
    const { item, setItem, loading, save } = useExchangeRate();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Tipo de Cambio" : "Nuevo Tipo de Cambio"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <div className="flex gap-4">
                        <PaginatedAutocomplete
                            label="Moneda Origen"
                            value={item.fromCurrencyId}
                            onChange={(val) => setItem({ ...item, fromCurrencyId: parseInt(val) })}
                            fetchData={CurrencyService.get}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.symbol} - ${item.name.trim()}`}
                        />
                        <PaginatedAutocomplete
                            label="Moneda Destino"
                            value={item.toCurrencyId}
                            onChange={(val) => setItem({ ...item, toCurrencyId: parseInt(val) })}
                            fetchData={CurrencyService.get}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.symbol} - ${item.name.trim()}`}
                        />
                    </div>
                    <div className="flex gap-4">
                        <NumberInputApp className="flex-1" title="Tasa de Cambio" value={item.rate}
                            shrink={true} onChange={(value) => setItem({ ...item, rate: value })}
                            permitDecimal={true} />
                        <FormControlLabel
                            className="flex-1"
                            control={
                                <Checkbox
                                    className="dark:text-primary-dark!"
                                    checked={item?.isActive ?? false}
                                    onChange={(e) => setItem({ ...item!, isActive: e.target.checked })}
                                />
                            }
                            label="Activo"
                            slotProps={{
                                typography: {
                                    className: "dark:text-white!"
                                }
                            }} />
                    </div>
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Tipo de Cambio" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
