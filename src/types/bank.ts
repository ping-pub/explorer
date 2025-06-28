
import type { Coin, PaginatedResponse } from "./common";
import type { Asset } from "./chaindata";

export interface BankParams {
    params: {
        "send_enabled": string[],
        "default_send_enabled": boolean;
    }
}

export interface PaginatedBalances extends PaginatedResponse {
    balances: Coin[]
}

export interface PaginatedDenomMetadata extends PaginatedResponse {
    metadatas: Asset[]
}

export interface PaginatedSupply extends PaginatedResponse {
    supply: Coin[]
}
