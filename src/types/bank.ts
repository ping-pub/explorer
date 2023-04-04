import type { Coin } from "./Coin";
import type { PaginatedResponse } from "./Pagination";

export interface BankParams {
    params: {
        "send_enabled": string[],
        "default_send_enabled": boolean;
    }
}

export interface DenomMetadata {
    "description": string,
    "denom_units": {
        "denom": string,
        "exponent": number,
        "aliases": string[]
    }[],
    "base": string,
    "display": string,
    "name": string,
    "symbol": string
}

export interface PaginatedDenomMetadata extends PaginatedResponse{
    metadatas: DenomMetadata[]
}

export interface PaginatedSupply extends PaginatedResponse {
    supply: Coin[]
}