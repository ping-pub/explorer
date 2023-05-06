import type { PaginatedResponse } from "."

export interface DenomTrace {
    path: string,
    base_denom: string
}

export interface Connection {
    id: string,
    client_id: string,
    versions: {
        identifier: string,
        features: string[]
    }[],
    state: string,
    counterparty: {
        client_id: string,
        connection_id: string,
        prefix: {
            key_prefix: string
        }
    },
    delay_period: string
}

export interface Channel {
    state: string,
    ordering: string,
    counterparty: {
      port_id: string,
      channel_id: string
    },
    connection_hops: string[],
    version: string,
    port_id: string,
    channel_id: string
  }

export interface ClientState {
    "@type": string,
    chain_id: string,
    trust_level: {
      numerator: string,
      denominator: string
    },
    trusting_period: string,
    unbonding_period: string,
    max_clock_drift: string,
    frozen_height: {
      revision_number: string,
      revision_height: string
    },
    latest_height: {
      revision_number: string,
      revision_height: string
    },
    proof_specs: {
        leaf_spec: {
          hash: string,
          prehash_key: string,
          prehash_value: string,
          length: string,
          prefix: string
        },
        inner_spec: {
          child_order: number[],
          child_size: number,
          min_prefix_length: number,
          max_prefix_length: number,
          empty_child: string,
          hash: string
        },
        max_depth: number,
        min_depth: number
      }[],
    upgrade_path: string[],
    allow_update_after_expiry: boolean,
    allow_update_after_misbehaviour: boolean
  }

export interface ClientStateWithProof {
    identified_client_state: {
        client_id: string,
        client_state: ClientState
    },
    proof: string,
    proof_height: {
        revision_number: string,
        revision_height: string
    }

}
export interface ConnectionWithProof {
    connection: Connection,
    proof: string,
    proof_height: {
        revision_number: string,
        revision_height: string
    }

}
export interface PaginatedIBCChannels extends PaginatedResponse {
    channels: Channel[]
}
export interface PaginatedIBCConnections extends PaginatedResponse {
    connections: Connection[]
}