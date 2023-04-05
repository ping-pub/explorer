import type { Key } from "./common"

export interface NodeInfo {
    "default_node_info": {
        "protocol_version": {
            "p2p": string,
            "block": string,
            "app": string
        },
        "default_node_id": string,
        "listen_addr": string,
        "network": string,
        "version": string,
        "channels": string,
        "moniker": string,
        "other": {
            "tx_index": string,
            "rpc_address": string
        }
    },
    "application_version": {
        "name": string,
        "app_name": string,
        "version": string,
        "git_commit": string,
        "build_tags": string,
        "go_version": string,
        "build_deps": [
            {
                "path": string,
                "version": string,
                "sum": string,
            },
        ],
        "cosmos_sdk_version": string,
    }
}

export interface Block {
    
}

export interface TendermintValidator {
    "address": string,
    "pub_key": Key,
    "voting_power": string,
    "proposer_priority": string
}

export interface PaginatedTendermintValidator {
    validators: TendermintValidator[],
    block_height: string
}