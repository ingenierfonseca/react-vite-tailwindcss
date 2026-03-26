import { useEffect, useState } from "react";
import type { Paggination } from "../../services/appointment/appointment.types";
import { InvoiceService } from "../../services/invoice/invoice.service";
import { getInitialInvoice, getInitialInvoiceItem, type Invoice, type InvoiceItem } from "../../services/invoice/invoice.types";
import { useParams } from "react-router";

export const useInvoice = () => {
    const [data, setData] = useState<Paggination<Invoice> | null>(null);
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        InvoiceService.getAllInvoicess()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const saveInvoice = async (payload: any) => {
        setLoading(true);
        setError(null);
        //setSuccess(false);

        try {
            const data = await InvoiceService.addInvoice(payload);
            //setSuccess(true);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear la factura";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        currentPage,
        saveInvoice,
        invoice,
        setInvoice
    };
};

export const useInvoiceDetail = () => {
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (id === "0" || id === undefined) {
            //setInvoice(getInitialInvoice())
            return;
        }

        InvoiceService.getInvoice(id)
            .then(setInvoice)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddItem = () => {
        if (!invoice) {
            setInvoice(getInitialInvoice());
            return;
        }

        setInvoice(prevInvoice => {
            // Doble check por si acaso (aunque el if de arriba ya lo hace)
            if (!prevInvoice) return null;

            return {
                ...prevInvoice,
                items: [...prevInvoice.items, getInitialInvoiceItem()]
            };
        });
    };

    const handleRemoveItem = (indexToRemove: number) => {
        if (!invoice) return;

        if (invoice.items.length <= 1) {
            alert("La factura debe tener al menos un concepto.");
            return;
        }

        setInvoice(prevInvoice => {
            if (!prevInvoice) return null;

            return {
                ...prevInvoice,
                items: prevInvoice.items.filter((_, index) => index !== indexToRemove)
            };
        });
    };

    const onChangeDescription = (newText: string, index: number) => {
        const updatedItems = [...invoice!.items]
        updatedItems[index].description = newText

        setInvoice((prevInvoice) => {
            if (!prevInvoice) return null

            return {
                ...prevInvoice,
                items: updatedItems
            };
        });
    }

    const onChangeItem = <K extends keyof InvoiceItem>(
        index: number,
        field: K,
        value: InvoiceItem[K]
    ) => {
        setInvoice((prev) => {
            if (!prev) return null

            const items = prev.items.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )

            return {
                ...prev,
                items
            }
        })
    }

    const saveInvoice = async (payload: any) => {
        setLoading(true);
        setError(null);
        //setSuccess(false);

        try {
            const data = await InvoiceService.addInvoice(payload);
            //setSuccess(true);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Error al crear la factura";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        saveInvoice,
        invoice,
        handleAddItem,
        handleRemoveItem,
        onChangeItem
    };
};