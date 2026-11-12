import { api, ENDPOINTS } from "@/core/api";
import { createHttpClientRepository } from "@/features/clients/infrastructure/http-client.repository";
import type { Customer } from "./customer.type";

export const customerRepository = createHttpClientRepository<Customer>(api, {
  endpoint: ENDPOINTS.CUSTOMERS,
  avatarEndpoint: ENDPOINTS.CUSTOMER_AVATAR,
});
