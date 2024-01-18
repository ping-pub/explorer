import { fromBase64 } from '@cosmjs/encoding';
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
    this.reverse = reverse ?? false;
  }

  toPagination() {
    const pagination = CosmosPageRequest.fromPartial({
      key: this.key ? fromBase64(this.key) : undefined,
      countTotal: true,
      offset: this.offset ? longify(this.offset) : undefined,
      limit: this.limit ? longify(this.limit) : undefined,
      reverse: this.reverse ?? true,
    });
    return pagination;
  }

  setPage(page: number) {
    if (page >= 1) this.offset = (page - 1) * this.limit;
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
