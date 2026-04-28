import { toast } from "react-toastify";
import Modal from "../../../components/commons/Modal";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import type { InvoiceItem } from "../../../services/invoice/invoice.types";
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete";
import { useState } from "react";
import { TreatmentService } from "../../../services/treatment/treatment.service";
import { ExchangeRateService } from "../../../services/exchange-rate/exchangeRate.service";
import type { Currency } from "../../../services/types/currency.type";
import { TextField } from "@mui/material";
import { calculateLineTotal } from "../../../utils/invoice.util";


interface ThreatmentModalProps {
    invoiceItem: InvoiceItem,
    currency: Currency | undefined,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    onClick: () => void,
    onChangeItem: (field: keyof InvoiceItem, value: any) => void,
}

export default function ThreatmentModal({ 
    invoiceItem, currency, isModalOpen, setIsModalOpen, onClick, onChangeItem 
}: ThreatmentModalProps) {
    const [search, setSearch] = useState('')

    /*useEffect(() => {
        const newPrice = calculatePrice(
            invoiceItem.unitPrice,
            currency,
            treatment?.currency?.symbol ?? currency
        );
        onChangeItem("unitPrice", newPrice);
    }, [invoiceItem.unitPrice, currency, treatment]);*/
    
    return (
        <Modal isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Información del Tratamiento"
            textBtnConfirm="Agregar"
            clickBtnConfirm={() => {
                if (validateFields(invoiceItem)) {
                    onClick()
                    setIsModalOpen(false)
                }
            }}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del tratamiento
                </p>
                {invoiceItem &&
                    <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                        <PaginatedAutocomplete
                            label="Tratamiento"
                            value={search}
                            onChange={async (value, item) => {
                                setSearch(value)
                                onChangeItem("description", item?.name)

                                let exchangeRate = 1
                                if (currency?.id !== item?.currencyId) {
                                    const response = await ExchangeRateService.getLatest(item?.currencyId??0, currency!.id)
                                    exchangeRate = response.rate
                                }

                                onChangeItem("unitPrice", (item?.price! * exchangeRate))
                                onChangeItem("originalCurrencyId", item?.currencyId)
                                onChangeItem("originalPrice", item?.price)
                            }}
                            fetchData={TreatmentService.getActive}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.name.trim()}`}
                        />
                        <NumberInputApp title="Cantidad" value={invoiceItem.quantity} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem("quantity", val)} shrink={true} />
                        <TextField title="Precio" value={invoiceItem.unitPrice.toFixed(2)} className="md:flex-1 px-2 text-sm" onChange={(val) => onChangeItem("unitPrice", val)} disabled={true} />
                        <NumberInputApp title="Descuento" value={invoiceItem.discount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onChangeItem("discount", val)} />
                        <span className={`flex-1 px-2 text-sm md:text-lg dark:text-slate-200`}>Total:{currency?.symbol}{calculateLineTotal(invoiceItem)}</span>
                    </fieldset>
                }
            </div>
        </Modal>
    )
}

const validateFields = (item: InvoiceItem) => {
    const { description, quantity, unitPrice } = item;
    if (!description) {
        toast.error("El campo tratamiento es requerido");
        return false;
    }
    if (quantity === undefined || quantity <= 0) {
        toast.error("El campo cantidad debe ser mayor a 0");
        return false;
    }
    if (unitPrice === undefined || unitPrice <= 0) {
        toast.error("El campo precio debe ser mayor a 0");
        return false;
    }

    return true;
}