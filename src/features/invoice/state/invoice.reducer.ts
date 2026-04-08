import { getInitialInvoice, getInitialInvoiceItem } from "../../../services/invoice/invoice.types";
import type { Action } from "./invoice.actions";
import type { State } from "./state";

export function invoiceReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, invoice: action.payload };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_FIELD':
            if (!state.invoice) return state;
            return { ...state, invoice: { ...state.invoice, [action.payload.field]: action.payload.value } };
        case 'ADD_ITEM':
            const currentInvoice = state.invoice || getInitialInvoice();

            // Si action.payload existe, usamos ese. Si no, usamos el default.
            const newItem = action.payload ? action.payload : getInitialInvoiceItem();
            return {
                ...state,
                invoice: {
                    ...currentInvoice, 
                    items: [...currentInvoice.items, newItem]
                }
            };
        case 'REMOVE_ITEM':
            if (!state.invoice) return state;
            return {
                ...state,
                invoice: { ...state.invoice, items: state.invoice.items.filter((_, i) => i !== action.payload) }
            };
        case 'UPDATE_ITEM':
            if (!state.invoice) return state;
            const newItems = state.invoice.items.map((item, i) => 
                i === action.payload.index ? { ...item, [action.payload.field]: action.payload.value } : item
            );
            return { ...state, invoice: { ...state.invoice, items: newItems } };
        default:
            return state;
    }
}