export interface PaginatedResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

export interface Result<T> {
    isSuccess: boolean;
    value: T;
    errorMessage: string;
}