import type { Block, NodeInfo, SlashingSigningInfo } from "@/types";
import type { PaginabledAccounts } from "@/types/Auth";
import type { Tx } from "@/types/Tx";
import type { Txs } from "@/types/Txs";
import type { PaginatedDenomMetadata, PaginatedSupply } from "@/types/bank";
import semver from "semver";


export interface Request<T> {
  url: string,
  adapter: (source: any) => T
}

// use snake style, since the all return object use snake style.
export interface RequestRegistry {
  auth_params: Request<any>
  auth_accounts: Request<PaginabledAccounts>;
  auth_account_address: Request<any>;

  bank_params: Request<any>;
  bank_balances_address: Request<any>;
  bank_denoms_metadata: Request<PaginatedDenomMetadata>;
  bank_supply: Request<PaginatedSupply>;
  bank_supply_by_denom: Request<any>;

  distribution_params: Request<any>;
  distribution_validator_commission: Request<any>;
  distribution_validator_outstanding_rewards: Request<any>;
  distribution_validator_slashes: Request<any>;

  slashing_params: Request<any>;
  slashing_signing_info: Request<SlashingSigningInfo>;
  
  gov_params_voting: Request<any>;
  gov_params_tally: Request<any>;
  gov_params_deposit: Request<any>;
  gov_proposals: Request<any>;
  gov_proposals_proposal_id: Request<any>;
  gov_proposals_deposits: Request<any>;
  gov_proposals_tally: Request<any>;
  gov_proposals_votes: Request<any>;
  gov_proposals_votes_voter: Request<any>;

  staking_deletations: Request<any>;
  staking_delegator_redelegations: Request<any>;
  staking_delegator_unbonding_delegations: Request<any>;
  staking_delegator_validators: Request<any>;
  staking_params: Request<any>;
  staking_pool: Request<any>;
  staking_validators: Request<any>;
  staking_validators_address: Request<any>;
  staking_validators_delegations: Request<any>;
  staking_validators_delegations_delegator: Request<any>;
  staking_validators_delegations_unbonding_delegations: Request<any>;

  base_tendermint_abci_query: Request<any>;
  base_tendermint_block_latest: Request<Block>;
  base_tendermint_block_height: Request<Block>;
  base_tendermint_node_info: Request<NodeInfo>;
  base_tendermint_validatorsets_latest: Request<any>;
  base_tendermint_validatorsets_height: Request<any>;

  tx_txs: Request<Txs>;
  tx_txs_block: Request<Txs>;
  tx_hash: Request<Tx>;

}

export function adapter<T>(source: any): T {
  return source
}

export interface Registry {
  [key: string]: RequestRegistry;
}

export function withCustomAdapter<T extends RequestRegistry>(target: T, source: Partial<T>): T {
  return Object.assign({}, target, source);
}

export function findConfigByName(name: string, registry: Registry): RequestRegistry {
  const url = registry[name];
  if (!url) {
    throw new Error(`Unsupported version or name: ${name}`);
  }

  return url;
}

export function findConfigByVersion(version: string, registry: Registry): RequestRegistry {
  let closestVersion: string | null = null;

  for (const key in registry) {
    if (semver.satisfies(key, version)) {
      if (!closestVersion || semver.gt(key, closestVersion)) {
        closestVersion = key;
      }
    }
  }

  if (!closestVersion) {
    throw new Error(`Unsupported version: ${version}`);
  }

  console.log(`Closest version to ${version}: ${closestVersion}`);

  return registry[closestVersion];
}
