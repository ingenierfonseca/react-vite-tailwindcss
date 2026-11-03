import type { Client, ClientPage, ClientQuery } from "../domain/client";
import type { ClientRepository } from "../domain/client.repository";

export interface ClientModule<TClient extends Client> {
  list(query: ClientQuery): Promise<ClientPage<TClient>>;
  find(id: number): Promise<TClient>;
  save(client: TClient): Promise<TClient>;
  uploadAvatar?: (id: number, file: File) => Promise<unknown>;
}

export function createClientModule<TClient extends Client>(
  repository: ClientRepository<TClient>,
): ClientModule<TClient> {
  const module: ClientModule<TClient> = {
    list: (query) => repository.list(query),
    find: (id) => repository.find(id),
    save: (client) => client.id > 0
      ? repository.update(client.id, client)
      : repository.create(client),
  };

  if (repository.uploadAvatar) module.uploadAvatar = repository.uploadAvatar.bind(repository);
  return module;
}
