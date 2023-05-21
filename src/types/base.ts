import type { Key } from "./common"

export interface NodeInfo {
    default_node_info: {
        protocol_version: {
            p2p: string,
            block: string,
            app: string
        },
        default_node_id: string,
        listen_addr: string,
        network: string,
        version: string,
        channels: string,
        moniker: string,
        other: {
            tx_index: string,
            rpc_address: string
        }
    },
    application_version: {
        name: string,
        app_name: string,
        version: string,
        git_commit: string,
        build_tags: string,
        go_version: string,
        build_deps: [
            {
                path: string,
                version: string,
                sum: string,
            },
        ],
        cosmos_sdk_version: string,
    }
}
export interface BlockId {
    hash: string,
    part_set_header: {
        total: number,
        hash: string
    }
}

export interface Signature 
{
    block_id_flag: string,
    validator_address: string,
    timestamp: string,
    signature: string,
}

export interface Block {
    block_id: BlockId,
    block: {
        header: {
            version: {
                block: string,
                app: string
            },
            chain_id: string,
            height: string,
            time: string,
            last_block_id: BlockId,
            last_commit_hash: string,
            data_hash: string,
            validators_hash: string,
            next_validators_hash: string,
            consensus_hash: string,
            app_hash: string,
            last_results_hash: string,
            evidence_hash: string,
            proposer_address: string,
        },
        data: {
            txs: any[]
        },
        evidence: {
            evidence: any[]
        },
        last_commit: Commit
    }
}

export interface Commit {
    height: string,
    round: number,
    block_id: BlockId,
    signatures: Signature[]
}

export interface TendermintValidator {
    address: string,
    pub_key: Key,
    voting_power: string,
    proposer_priority: string
}

export interface PaginatedTendermintValidator {
    validators: TendermintValidator[],
    block_height: string
}