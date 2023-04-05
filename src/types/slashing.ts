import type { PaginatedResponse } from "./common";

export interface SigningInfo {
    "address": string,
    "start_height": string,
    "index_offset": string,
    "jailed_until": string,
    "tombstoned": boolean,
    "missed_blocks_counter": string
}

export interface PaginatedSigningInfo extends PaginatedResponse {
    info: SigningInfo[]
}