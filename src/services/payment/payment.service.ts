import type { Payment } from "./payment.type";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";

export const PaymentService = createCatalogService<Payment>(ENDPOINTS.PAYMENT);