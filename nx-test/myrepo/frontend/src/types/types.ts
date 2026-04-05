export interface Todo {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
}

export interface PaginatedTodos {
    data: Todo[];
    meta: PaginationMeta;
}
