import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { longify } from '@cosmjs/stargate/build/queryclient';
import { PageRequest as CosmosPageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';

export interface Key {
  '@type': string;
  key: string;
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
  count_total?: boolean;
  reverse?: boolean;

  constructor(limit?: number, reverse?: boolean) {
    this.limit = limit ?? 20;
    this.count_total = true;
    this.reverse = reverse ?? true;
  }

  toQueryString() {
    const query = [];
    if (this.key) query.push(`pagination.key=${this.key}`);
    if (this.limit) query.push(`pagination.limit=${this.limit}`);
    if (this.offset !== undefined)
      query.push(`pagination.offset=${this.offset}`);
    if (this.count_total)
      query.push(`pagination.count_total=${this.count_total}`);
    if (this.reverse) query.push(`pagination.reverse=${this.reverse}`);
    return query.join('&');
  }

  toPagination() {
    const pagination = CosmosPageRequest.fromPartial({
      key: this.key ? fromBase64(this.key) : undefined,
      countTotal: this.count_total ?? true,
      offset: this.offset ? longify(this.offset) : undefined,
      limit: this.limit ? longify(this.limit) : undefined,
      reverse: this.reverse ?? true,
    });
    return pagination;
  }

  setNextKey(key?: Uint8Array) {
    this.key = key ? toBase64(key) : undefined;
  }

  setPage(page: number) {
    if (page >= 1) this.offset = (page - 1) * this.limit;
  }

  setCountTotal(count: boolean) {
    this.count_total = count;
  }

  setPageSize(size: number) {
    this.limit = size;
  }
}

export interface PaginatedResponse {
  pagination: Pagination;
}

export class Response<T> {
  [key: string]: T;
}

export interface Coin {
  amount: string;
  denom: string;
}

export interface CoinWithPrice extends Coin {
  value?: number;
  price?: number;
  change24h?: number;
}

export interface UptimeStatus {
  height: number;
  filled: boolean;
  signed: boolean;
}
