import type { AxiosInstance } from "axios";
import type { Client, ClientPage, ClientQuery } from "../domain/client";
import type { ClientRepository } from "../domain/client.repository";

export interface HttpClientRepositoryOptions<TClient extends Client> {
  endpoint: string;
  avatarEndpoint?: (id: number) => string;
  mapClient?: (response: unknown) => TClient;
}

export function createHttpClientRepository<TClient extends Client>(
  http: AxiosInstance,
  options: HttpClientRepositoryOptions<TClient>,
): ClientRepository<TClient> {
  const endpoint = options.endpoint.endsWith("/")
    ? options.endpoint
    : `${options.endpoint}/`;
  const mapClient = options.mapClient ?? ((response) => response as TClient);

  const repository: ClientRepository<TClient> = {
    async list({ page, search, size = 15 }: ClientQuery) {
      const params = new URLSearchParams({
        pageNumber: String(page),
        pageSize: String(size),
      });
      if (search.trim()) params.set("search", search.trim());

      const { data } = await http.get<ClientPage<unknown>>(`${endpoint}?${params}`);
      return { ...data, data: data.data.map(mapClient) };
    },

    async find(id) {
      const { data } = await http.get<unknown>(`${endpoint}${id}`);
      return mapClient(data);
    },

    async create(client) {
      const { data } = await http.post<unknown>(endpoint, client);
      return mapClient(data);
    },

    async update(id, client) {
      const { data } = await http.put<unknown>(`${endpoint}${id}`, client);
      return mapClient(data);
    },

  };

  const avatarEndpoint = options.avatarEndpoint;
  if (avatarEndpoint) {
    repository.uploadAvatar = async (id, file) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await http.post(avatarEndpoint(id), formData, {
            headers: {
                "Content-Type": undefined
            }
        });
      return data;
    };
  }

  return repository;
}
