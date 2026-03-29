import type { Invoice, InvoiceItem } from "../../../services/invoice/invoice.types";

export type Action = 
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Invoice }
    | { type: 'FETCH_ERROR'; payload: any }
    | { type: 'UPDATE_FIELD'; payload: { field: keyof Invoice; value: any } }
    | { type: 'ADD_ITEM' }
    | { type: 'REMOVE_ITEM'; payload: number }
    | { type: 'UPDATE_ITEM'; payload: { index: number; field: keyof InvoiceItem; value: any } };