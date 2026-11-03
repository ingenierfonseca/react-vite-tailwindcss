import type { Client, ClientPage, ClientQuery } from "./client";

/** Port for the host app's client/customer persistence. */
export interface ClientRepository<TClient extends Client> {
  list(query: ClientQuery): Promise<ClientPage<TClient>>;
  find(id: number): Promise<TClient>;
  create(client: TClient): Promise<TClient>;
  update(id: number, client: TClient): Promise<TClient>;
  uploadAvatar?(id: number, file: File): Promise<unknown>;
}
