import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { PaymentTerm } from "./PaymentTerm.type";

export const PaymentTermService = createCatalogService<PaymentTerm>(ENDPOINTS.PAYMENTTERM);