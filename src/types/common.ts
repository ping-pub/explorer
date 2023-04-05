export interface Key {
    "@type": string,
    "key": string,
}

export interface Pagination {
    key?: string;
    total?: string;
}

export interface PaginatedResponse {
    pagination: Pagination;
}

export class Response<T> {
    [key: string]: T
}

export interface Coin {
    amount: string|number;
    denom: string;
}