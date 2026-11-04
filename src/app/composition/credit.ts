import { api, ENDPOINTS } from "@/core/api";
import { createCreditModule } from "@/features/credit/application/create-credit-module";
import { createHttpCreditRepository } from "@/features/credit/infrastructure/http-credit.repository";

export const creditModule = createCreditModule(createHttpCreditRepository(api, ENDPOINTS.CREDIT));
