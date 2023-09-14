import type { Key, PaginatedResponse, Coin } from "./common"

export interface Validator {
    "operator_address": string,
    "consensus_pubkey": Key,
    "jailed": boolean,
    "status": string,
    "tokens": string,
    "delegator_shares": string,
    "description": {
        "moniker": string,
        "identity"?: string,
        "website"?: string,
        "security_contact"?: string,
        "details"?: string
    },
    "unbonding_height": string,
    "unbonding_time": string,
    "commission": CommissionRate,
    "min_self_delegation": string,
    "liquid_shares": string,
    "validator_bond_shares": string
}

export interface CommissionRate {
    "commission_rates": {
        "rate": string,
        "max_rate": string,
        "max_change_rate": string
    },
    "update_time": string
}

export interface UnbondingResponses {
    delegator_address: string,
    validator_address: string,
    entries: {
        creation_height: string,
        completion_time: string,
        initial_balance: string,
        balance: string
      }[]
  }

export interface Delegation {
    delegation: {
        delegator_address: string,
        validator_address: string,
        shares: string
    },
    balance: Coin
}

export interface Redelegation {

}

export interface StakingParam {
    params: {
        "unbonding_time": string,
        "max_validators": number,
        "max_entries": number,
        "historical_entries": number,
        "bond_denom": string,
        "min_commission_rate": string,
        "min_self_delegation": string
    }
}

export interface StakingPool {
    pool: {
        not_bonded_tokens: string,
        bonded_tokens: string
    }
}

export interface PaginatedDelegations extends PaginatedResponse {
    delegation_responses: Delegation[]
}

export interface PaginatedRedelegations extends PaginatedResponse {
    redelegation_responses: Redelegation[]
}

export interface PaginatedUnbonding extends PaginatedResponse {
    unbonding_responses: UnbondingResponses[]
}

export interface PaginatedValdiators extends PaginatedResponse {
    validators: Validator[]
}