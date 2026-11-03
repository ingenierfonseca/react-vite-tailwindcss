export type { Client, ClientPage, ClientQuery } from "./domain/client";
export type { ClientRepository } from "./domain/client.repository";
export { createClientModule } from "./application/create-client-module";
export type { ClientModule } from "./application/create-client-module";
export { createHttpClientRepository } from "./infrastructure/http-client.repository";
export type { HttpClientRepositoryOptions } from "./infrastructure/http-client.repository";
export { ClientForm } from "./presentation/ClientForm";
export type { ClientFormLabels } from "./presentation/ClientForm";
export { ClientsPage } from "./presentation/ClientsPage";
export type {
  ClientFormRenderProps,
  ClientProfileActions,
  ClientsPageLabels,
  ClientsPageProps,
} from "./presentation/ClientsPage";
