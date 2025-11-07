/**
 * Transaction API utility functions
 * Handles fetching transactions from the new /api/v1/transactions endpoint
 * with support for filtering, sorting, and pagination
 */

export interface TransactionFilters {
  address?: string;
  addresses?: string[];
  type?: string;
  status?: string;
  chain?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
  sort_by?: 'timestamp' | 'amount' | 'fee' | 'block_height' | 'type' | 'status';
  sort_order?: 'asc' | 'desc';
}

export interface ApiTransaction {
  id: string;
  hash: string;
  block_id: string;
  sender: string;
  recipient: string;
  amount: string;
  fee: string;
  memo: string;
  type: string;
  status: string;
  chain: string;
  timestamp: string;
  block_height: number;
  tx_data: any;
}

export interface TransactionsResponse {
  data: ApiTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch transactions from the API
 * Automatically uses POST method when filtering by many addresses (>5)
 * @param filters - Filter parameters
 * @returns Promise with transactions response
 */
export async function fetchTransactions(
  filters: TransactionFilters = {}
): Promise<TransactionsResponse> {
  const {
    address,
    addresses,
    type,
    status,
    chain,
    start_date,
    end_date,
    min_amount,
    max_amount,
    page = 1,
    limit = 10,
    sort_by = 'timestamp',
    sort_order = 'desc',
  } = filters;

  // Determine if we should use POST (many addresses or explicitly needed)
  const addressList = addresses || (address ? [address] : []);
  const shouldUsePost = addressList.length > 5 || addressList.length === 0;

  if (shouldUsePost) {
    // POST method - send filters in body
    const body: any = {
      page,
      limit,
      sort_by,
      sort_order,
    };

    if (addressList.length > 0) {
      body.addresses = addressList;
    }
    if (type) body.type = type;
    if (status) body.status = status;
    if (chain) body.chain = chain;
    if (start_date) body.start_date = start_date;
    if (end_date) body.end_date = end_date;
    if (min_amount !== undefined) body.min_amount = min_amount;
    if (max_amount !== undefined) body.max_amount = max_amount;

    const response = await fetch('/api/v1/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } else {
    // GET method - use query parameters
    const params = new URLSearchParams();

    if (addressList.length === 1) {
      params.append('address', addressList[0]);
    } else if (addressList.length > 1) {
      params.append('addresses', addressList.join(','));
    }
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (chain) params.append('chain', chain);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    if (min_amount !== undefined) params.append('min_amount', min_amount.toString());
    if (max_amount !== undefined) params.append('max_amount', max_amount.toString());
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('sort_by', sort_by);
    params.append('sort_order', sort_order);

    const response = await fetch(`/api/v1/transactions?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

/**
 * Fetch transaction statistics
 * @param filters - Filter parameters (pagination and sorting ignored)
 * @returns Promise with statistics response
 */
export async function fetchTransactionStats(
  filters: Omit<TransactionFilters, 'page' | 'limit' | 'sort_by' | 'sort_order'> = {}
): Promise<any> {
  const {
    address,
    addresses,
    type,
    status,
    chain,
    start_date,
    end_date,
    min_amount,
    max_amount,
  } = filters;

  const addressList = addresses || (address ? [address] : []);
  const shouldUsePost = addressList.length > 5 || addressList.length === 0;

  if (shouldUsePost) {
    const body: any = {};

    if (addressList.length > 0) {
      body.addresses = addressList;
    }
    if (type) body.type = type;
    if (status) body.status = status;
    if (chain) body.chain = chain;
    if (start_date) body.start_date = start_date;
    if (end_date) body.end_date = end_date;
    if (min_amount !== undefined) body.min_amount = min_amount;
    if (max_amount !== undefined) body.max_amount = max_amount;

    const response = await fetch('/api/v1/transactions/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } else {
    const params = new URLSearchParams();

    if (addressList.length === 1) {
      params.append('address', addressList[0]);
    } else if (addressList.length > 1) {
      params.append('addresses', addressList.join(','));
    }
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (chain) params.append('chain', chain);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    if (min_amount !== undefined) params.append('min_amount', min_amount.toString());
    if (max_amount !== undefined) params.append('max_amount', max_amount.toString());

    const response = await fetch(`/api/v1/transactions/stats?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

