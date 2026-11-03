export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  avatar?: string;
}

export interface ClientQuery {
  page: number;
  search: string;
  size?: number;
}

export interface ClientPage<TClient> {
  data: TClient[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}
