
import type { Key, PaginatedResponse } from "./common";

export interface AuthAccount {
    "@type": string,
    "address": string,
    "pub_key": Key,
    "account_number": string,
    "sequence": string
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