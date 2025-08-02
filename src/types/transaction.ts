import type { Coin, Key, PaginatedResponse } from "./common"

export interface Tx {
    "@type"?: string,
    "body": {
        "messages": { "@type": string, "amount"?: Coin[], "stake"?: Coin, packet?: { data: string } }[],
        "memo": string,
        "timeout_height": string,
        "extension_options": any[],
        "non_critical_extension_options": any[]
    },
    "auth_info": {
        "signer_infos": [
            {
                "public_key": Key,
                "mode_info": {
                    "single"?: {
                        "mode": string // "SIGN_MODE_DIRECT"
                    }
                },
                "sequence": string
            }
        ],
        "fee": {
            "amount": Coin[],
            "gas_limit": string,
            "payer": string,
            "granter": string
        }
    },
    "signatures": string[]
}

export interface TxLocal {
    "messages": { "from_address"?: string, "to_address"?: string, "@type": string, "amount"?: Coin[], packet?: { data: string } }[],
    "fee": string | {
        "amount": Coin[],
        "gas_limit": string,
        "payer": string,
        "granter": string
    },
    "height": string,
    "block_height": string, // Alias for height used in templates
    "hash": string,
    "status": number,
    "timestamp": string,
    "type": string // Transaction type derived from messages
}
export interface Attributes {
    index?: boolean,
    key: string,
    value: string
}

export interface TxResponse {
    "height": string,
    "txhash": string,
    "codespace": string,
    "code": number,
    "data": string,
    "raw_log": string,
    "logs": [
        {
            "msg_index": number,
            "log": string,
            "events": Attributes[]
        }
    ],
    "info": "",
    "gas_wanted": "204431",
    "gas_used": "202682",
    "tx": Tx,
    "timestamp": "2022-08-13T23:24:54Z",
    "events": {
        "type": string,
        "attributes": Attributes[]
    }[]
}

export interface PaginatedTxs extends PaginatedResponse {
    txs: Tx[]
    tx_responses: TxResponse[]
}