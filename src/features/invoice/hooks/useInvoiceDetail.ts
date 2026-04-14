import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { getInitialInvoice, getInitialInvoiceItem, type Invoice, type InvoiceItem } from "../../../services/invoice/invoice.types";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import { invoiceReducer } from "../state/invoice.reducer";
import { toast } from "react-toastify";
import { formatNumber } from "../../../utils/number.util";

const successMsg = "SUCCESS"
export const useInvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [state, dispatch] = useReducer(invoiceReducer, {
        invoice: null,
        loading: true,
        error: null
    });
    const [itemInvoice, setItemInvoice] = useState<InvoiceItem>(getInitialInvoiceItem());

    useEffect(() => {
        if (id === "0" || id === undefined) {
            dispatch({ type: 'FETCH_SUCCESS', payload: getInitialInvoice() });
            return;
        }

        dispatch({ type: 'FETCH_START' });
        InvoiceService.getInvoice(id)
            .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
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
                lineTotal: itemInvoice.lineTotal
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

    const calculateLineTotal = (item: InvoiceItem) => {
        const { quantity = 0, unitPrice = 0, tax = 0, discount = 0 } = item;
        let total = quantity * unitPrice;
        if (tax) total *= 1 + tax / 100;
        if (discount) total *= 1 - discount / 100;
        return formatNumber(total);
    };

    const calculateTotal = () => {
        const total = state.invoice?.items.reduce((acc, item) => {
            const line = (item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.tax || 0) / 100) * (1 - (item.discount || 0) / 100);
            return acc + line;
        }, 0) || 0;
        return formatNumber(total);
    };

    const saveInvoice = async () : Promise<boolean> => {
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
            const data = await InvoiceService.addInvoice(invoice);
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
            toast.success("Factura guardada correctamente");
            return true;
            
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear la factura";
            dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
            toast.error("Ocurrio un error al crear la factura, Intente mas tarde");
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
            return "Debe agregar un detalle a la factura";

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
        calculateLineTotal,
        calculateTotal,
        saveInvoice,
        itemInvoice,
        resetItemInvoice
    };
};