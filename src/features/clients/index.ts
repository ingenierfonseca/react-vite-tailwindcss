export type { Client, ClientPage, ClientQuery } from "./domain/client";
export type { ClientRepository } from "./domain/client.repository";
export { createClientModule } from "./application/create-client-module";
export type { ClientModule } from "./application/create-client-module";
export { ClientsPage } from "./presentation/ClientsPage";
export type {
  ClientFormRenderProps,
  ClientProfileActions,
  ClientLabels,
  ClientQueries,
  ClientProfileData,
} from "./presentation/types";
export type { ClientsPageProps } from "./presentation/ClientsPage";
