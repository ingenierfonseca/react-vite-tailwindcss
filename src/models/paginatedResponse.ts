export interface PaginatedResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}