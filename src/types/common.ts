export interface Key {
    "@type": string,
    "key": string,
}

export enum LoadingStatus {
    UNLOADED,
    LOADING,
    LOADED,
}

export interface Pagination {
    key?: string;
    total?: string;
}

export class PageRequest {
    limit?: number;
}

export interface PaginatedResponse {
    pagination: Pagination;
}

export class Response<T> {
    [key: string]: T
}

export interface Coin {
    amount: string;
    denom: string;
}