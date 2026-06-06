import type { InvoiceItem } from "@/services/invoice/invoice.types";

export interface InvoicePrint {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyNIT: string;
  companyLogoUrl: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  invoiceNumber: string;
  date: string;
  paymentTerm: string;
  currencySymbol: string;
  subTotal: number;
  total: number;
  items: InvoiceItem[];
}