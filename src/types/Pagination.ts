export interface Pagination {
    key?: string;
    total?: string;
}

export interface PaginatedResponse {
    pagination: Pagination;
}

/* 
class PaginatedResponse<T, K extends string> {
  [key: string]: T[];
  pagination: Pagination;

  constructor(data: T[], pagination: Pagination, dataFieldName: K) {
    this.pagination = pagination;
    this[dataFieldName] = data;
  }
}
// */