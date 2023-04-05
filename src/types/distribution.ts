import type { PaginatedResponse } from "./common"

export interface DistributionParams {
    params: {
        "community_tax": string,
        "base_proposer_reward": string,
        "bonus_proposer_reward": string,
        "withdraw_addr_enabled": boolean
    }
}

export interface PaginatedSlashes extends PaginatedResponse {
    slashes: any[]
}