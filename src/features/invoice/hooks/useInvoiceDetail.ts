import { useEffect, useReducer, useState } from "react";
//import { useParams } from "react-router";
import { getInitialInvoice, getInitialInvoiceItem, type Invoice, type InvoiceItem } from "../../../services/invoice/invoice.types";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import { invoiceReducer } from "../state/invoice.reducer";
import { toast } from "react-toastify";
import { formatNumber } from "../../../utils/number.util";
import type { Currency } from "../../../services/types/currency.type";
import { CurrencyService } from "../../../services/currency/currency.service";
import { ExchangeRateService } from "../../../services/exchange-rate/exchangeRate.service";

const successMsg = "SUCCESS"
export const useInvoiceDetail = () => {
    //const { id } = useParams<{ id: string }>();
    const [id, setId] = useState("0")
    const [state, dispatch] = useReducer(invoiceReducer, {
        invoice: null,
        loading: true,
        error: null
    });
    const [itemInvoice, setItemInvoice] = useState<InvoiceItem>(getInitialInvoiceItem());
    const [currency, setCurrency] = useState<Currency>()
    /*const [treatments, setTreatments] = useState<TreatmentInvoiceItemDto[]>([])
    const [treatment, setTreatment] = useState<TreatmentInvoiceItemDto>()

    const addTreatment = (newTreatment: TreatmentInvoiceItemDto) => {
        setTreatments(prev => [...prev, newTreatment]);
    };*/

    useEffect(() => {
        if (id === "0" || id === undefined) {
            var initInvoiceState = getInitialInvoice()
            dispatch({ type: 'FETCH_SUCCESS', payload: initInvoiceState });
            CurrencyService.find(initInvoiceState.currencyId).then(item => {
                setCurrency(item)
            })
            return;
        }

        dispatch({ type: 'FETCH_START' });
        InvoiceService.find(Number(id))
            .then(data => {
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
                CurrencyService.find(data.currencyId).then(item => {
                    setCurrency(item)
                })
            })
            .catch(err => dispatch({ type: 'FETCH_ERROR', payload: err }));
    }, [id]);

    const resetItemInvoice = () => {
        setItemInvoice(getInitialInvoiceItem());
    }

    const onChangeItemInvoice = (field: keyof InvoiceItem, value: any) => {
        setItemInvoice(prev => ({ ...prev, [field]: value }));
    }

    const handleAddNewItem = () => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                id: itemInvoice.id,
                productId: itemInvoice.productId,
                serviceId: itemInvoice.serviceId,
                description: itemInvoice.description,
                quantity: itemInvoice.quantity,
                unitPrice: itemInvoice.unitPrice,
                tax: itemInvoice.tax,
                discount: itemInvoice.discount,
                lineTotal: itemInvoice.lineTotal,
                originalCurrencyId: itemInvoice.originalCurrencyId,
                originalPrice: itemInvoice.originalPrice
            }
        });
    }

    const handleRemoveItem = (index: number) => {
        /*if (state.invoice && state.invoice.items.length <= 1) {
            toast.warn("La factura debe tener al menos un concepto.");
            return;
        }*/
        dispatch({ type: 'REMOVE_ITEM', payload: index });
    };

    const updateField = (field: keyof Invoice, value: any) =>
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });

    const onChangeItem = (index: number, field: keyof InvoiceItem, value: any) =>
        dispatch({ type: 'UPDATE_ITEM', payload: { index, field, value } });

    const calculateTotal = () => {
        const total = state.invoice?.items.reduce((acc, item) => {
            const line = (item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.tax || 0) / 100) * (1 - (item.discount || 0) / 100);
            return acc + line;
        }, 0) || 0;
        return formatNumber(total);
    };

    const recalculateItemsCurrency = async (newCurrencyId: number) => {
        if (!state.invoice?.items || state.invoice.items.length === 0) return;
        const lastItem = state.invoice.items.findLast(x => x.originalCurrencyId!)
        
        if (lastItem) {
            let rateValue = 1
            if (newCurrencyId !== lastItem.originalCurrencyId!) {
                const response = await ExchangeRateService.getLatest(lastItem.originalCurrencyId!, newCurrencyId);
                rateValue = response.rate;
            }

            const updatedItems = state.invoice.items.map(item => {
                if (item.originalCurrencyId === newCurrencyId) {
                    return { ...item, unitPrice: item.originalPrice };
                }

                const newUnitPrice = item.originalPrice! * rateValue;

                return {
                    ...item,
                    unitPrice: Number(newUnitPrice.toFixed(2)),
                    discount: item.discount * rateValue
                };
            });

            updateField('items', updatedItems);
        }
    };

    const saveInvoice = async (): Promise<Boolean> => {
        const { invoice } = state;

        if (!invoice) return false;

        dispatch({ type: 'FETCH_START' });
        //await fakeRequest();

        const validationMsg = validateInvoiceData(invoice);

        if (validationMsg !== successMsg) {
            toast.error(validationMsg);
            dispatch({ type: 'FETCH_ERROR', payload: validationMsg });
            return false;
        }

        try {
            const request = invoice.id === 0 
                ? InvoiceService.post(invoice) 
                : InvoiceService.put(invoice.id, invoice);

            const data = await request;
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
            toast.success("Factura guardada correctamente");
            return true;

        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Error inesperado";
            dispatch({ type: 'FETCH_ERROR', payload: msg });
            toast.error(msg);
            return false;
        }
    };

    function validateInvoiceData(inv: Invoice | null) {
        console.log("CustomerId:", inv?.customerId);
        if (!inv?.customerId)
            return "Debe seleccionar un paciente";

        if (!inv?.issueDate)
            return "Debe ingresar una fecha de emisión válida";

        if (!inv?.dueDate)
            return "Debe ingresar una fecha de vencimiento válida";

        if (!inv?.items || inv.items.length === 0)
            return "Debe agregar un tratamiento a la factura";

        for (const it of inv.items) {
            if (it.description === undefined || it.description.length === 0)
                return `Debe ingresar una descripcion para el detalle`
            if (it.quantity === undefined || it.quantity <= 0)
                return `Debe ingresar una cantidad para el detalle ${it.description || 'sin nombre'}`;
            if (it.unitPrice === undefined || it.unitPrice <= 0)
                return `Debe ingresar un precio unitario para el detalle ${it.description || 'sin nombre'}`;
        }

        return successMsg;
    }

    /*const fakeRequest = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve("ok");
            }, 5000); // 5 segundos
        });
    };*/

    return {
        ...state,
        handleAddNewItem,
        handleRemoveItem,
        onChangeItem,
        onChangeItemInvoice,
        updateField,
        calculateTotal,
        saveInvoice,
        itemInvoice,
        resetItemInvoice,
        setId,
        currency,
        setCurrency,
        recalculateItemsCurrency
    };
};