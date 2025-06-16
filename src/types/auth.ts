import type { Key, PaginatedResponse } from "./common";
import type { Coin } from "./common";

export interface VestingInfo {
    original_vesting: Coin[];
    start_time: string;
    end_time: string;
}

export interface AuthAccount {
    "@type": string,
    "address": string,
    "pub_key": Key,
    "account_number": string,
    "sequence": string,
    // For vesting accounts
    "vesting_account"?: {
        "start_time"?: string,
        "base_vesting_account"?: {
            "end_time"?: string,
            "original_vesting"?: Coin[]
        }
    },
    // For multi-vesting accounts
    "infos"?: VestingInfo[],
    "base_account"?: {
        "address": string,
        "pub_key": Key,
        "account_number": string,
        "sequence": string
    },
    // For account owner
    "account_owner"?: string
}

export interface AuthParam {
    params: {
        "max_memo_characters": string,
        "tx_sig_limit": string,
        "tx_size_cost_per_byte": string,
        "sig_verify_cost_ed25519": string,
        "sig_verify_cost_secp256k1": string
    }
}

export interface PaginabledAccounts extends PaginatedResponse {
    accounts: AuthAccount[]
}