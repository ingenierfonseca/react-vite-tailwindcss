import type { InvoiceItem } from "../services/invoice/invoice.types";
import { formatNumber } from "./number.util";

export const calculateLineTotal = (item: InvoiceItem) => {
    const { quantity = 0, unitPrice = 0, discount = 0 } = item;
    let total = quantity * unitPrice - discount;
    //if (tax) total *= 1 + tax / 100;
    //if (discount) total *= 1 - discount / 100;
    return formatNumber(total);
};