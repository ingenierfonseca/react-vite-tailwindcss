import { useEffect, useState } from "react";
import type { Paggination } from "../../services/appointment/appointment.types";
import { InvoiceService } from "../../services/invoice/invoice.service";
import type { Invoice } from "../../services/invoice/invoice.types";

export const useInvoice = () => {
  const [data, setData] = useState<Paggination | null>(null);
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

  return { data, loading, error, currentPage, saveInvoice, invoice, setInvoice };
};