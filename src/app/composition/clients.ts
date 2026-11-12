import type { Client } from "@/features/clients";
import { createClientModule } from "@/features/clients/application/create-client-module";
import { customerRepository } from "@/services/customer/customer.service";

/** Adapt this app's patient/customer API to the reusable client feature. */
export const customerClientModule = createClientModule<Client>(customerRepository);
