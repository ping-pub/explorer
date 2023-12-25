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
    next_key?: string;
    total?: string;
}

export class PageRequest {
    key?: string;
    limit: number;
    offset?: number;
    count_total: boolean;
    reverse?: boolean;
    constructor() {
        this.limit = 20
        this.count_total = true
    }
    toQueryString() {
        const query = []
        if(this.key) query.push(`pagination.key=${this.key}`)
        if(this.limit) query.push(`pagination.limit=${this.limit}`)
        if(this.offset !== undefined) query.push(`pagination.offset=${this.offset}`)
        if(this.count_total) query.push(`pagination.count_total=${this.count_total}`)
        if(this.reverse) query.push(`pagination.reverse=${this.reverse}`)
        return query.join('&')
    }
    setPage(page: number) {
        if(page >= 1) this.offset = (page - 1) * this.limit
    }    
    setPageSize(size: number) {
        this.limit = size
    }
    
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

export interface CoinWithPrice extends Coin {
    value?: number;
    price?: number;
    change24h?: number    
}

export interface UptimeStatus {
    height: number;
    filled: boolean;
    signed: boolean;
}