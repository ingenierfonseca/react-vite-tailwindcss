import { createClientModule } from "@/features/clients/application/create-client-module";
import { customerRepository } from "@/services/customer/customer.service";
import type { Customer } from "@/services/customer/customer.type";

/** Adapt this app's patient/customer API to the reusable client feature. */
export const customerClientModule = createClientModule<Customer>(customerRepository);
