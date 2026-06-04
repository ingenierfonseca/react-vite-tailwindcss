import TextFieldApp from "../../../../components/commons/TextFieldApp";
import { useEffect } from "react";
import ButtonSaveApp from "../../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../../components/commons/PageRightComponent";
import type { Currency } from "../../../../models/currency.type";
import { useCurrency } from "../hooks/useCurrency";

interface CurrencyFormProps {
    itemParam?: Currency;
    setIsOpen: (value: boolean) => void;
    reload: () => void;
}

export default function CurrencyForm({ itemParam, setIsOpen, reload }: CurrencyFormProps) {
    const { item, setItem, loading, save } = useCurrency();

    useEffect(() => {
        if (itemParam) setItem(itemParam);
    }, [itemParam]);

    const handleSave = async () => {
        const response = await save();
        if (response) { reload(); setIsOpen(false); }
    };

    return (
        <PageRightComponent
            title={item.id ? "Editar Moneda" : "Nueva Moneda"}
            onClick={() => setIsOpen(false)}
        >
            <fieldset disabled={loading}>
                <div className="flex flex-col gap-4 pt-3">
                    <TextFieldApp className="flex-3" label="Nombre" value={item.name}
                        maxLength={50} onChange={(value) => setItem({ ...item, name: value })} />
                    <TextFieldApp className="flex-1" label="Código" value={item.code}
                        maxLength={5} onChange={(value) => setItem({ ...item, code: value })} />
                    <TextFieldApp className="flex-1" label="Símbolo" value={item.symbol}
                        maxLength={5} onChange={(value) => setItem({ ...item, symbol: value })} />
                </div>
                <div className="flex justify-center">
                    <ButtonSaveApp className="flex-6" label="Moneda" onClick={handleSave} loading={loading} />
                </div>
            </fieldset>
        </PageRightComponent>
    );
}
