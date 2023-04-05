import type { AuthAccount, Block, Coin, NodeInfo, PaginabledAccounts, PaginatedTendermintValidator,} from "@/types";
import type { BankParams, PaginatedBalances, PaginatedDenomMetadata, PaginatedSupply } from "@/types/bank";
import type { DistributionParams, PaginatedSlashes } from "@/types/distribution";
import type { GovParams, GovProposal, GovVote, PaginatedProposalDeposit, PaginatedProposalVotes, PaginatedProposals, Tally } from "@/types/gov";
import type { PaginatedSigningInfo } from "@/types/slashing";
import type { Delegation, PaginatedDelegations, PaginatedRedelegations, PaginatedUnbonding, PaginatedValdiators, StakingParam, StakingPool, Validator } from "@/types/staking";
import type { PaginatedTxs, Tx, TxResponse } from "@/types/tx";
import semver from "semver";


export interface Request<T> {
  url: string,
  adapter: (source: any) => T
}

// use snake style, since the all return object use snake style.
export interface RequestRegistry {
  auth_params: Request<any>
  auth_accounts: Request<PaginabledAccounts>;
  auth_account_address: Request<{account: AuthAccount}>;

  bank_params: Request<BankParams>;
  bank_balances_address: Request<PaginatedBalances>;
  bank_denoms_metadata: Request<PaginatedDenomMetadata>;
  bank_supply: Request<PaginatedSupply>;
  bank_supply_by_denom: Request<{amount: Coin}>;

  distribution_params: Request<DistributionParams>;
  distribution_validator_commission: Request<{commission?: {commission?: Coin[]}}>;
  distribution_validator_outstanding_rewards: Request<{rewards?: {rewards?: Coin[]}}>;
  distribution_validator_slashes: Request<PaginatedSlashes>;

  slashing_params: Request<any>;
  slashing_signing_info: Request<PaginatedSigningInfo>;
  
  gov_params_voting: Request<GovParams>;
  gov_params_tally: Request<GovParams>;
  gov_params_deposit: Request<GovParams>;
  gov_proposals: Request<PaginatedProposals>;
  gov_proposals_proposal_id: Request<{proposal: GovProposal}>;
  gov_proposals_deposits: Request<PaginatedProposalDeposit>;
  gov_proposals_tally: Request<Tally>;
  gov_proposals_votes: Request<PaginatedProposalVotes>;
  gov_proposals_votes_voter: Request<{vote: GovVote}>;

  staking_deletations: Request<PaginatedDelegations>;
  staking_delegator_redelegations: Request<PaginatedRedelegations>;
  staking_delegator_unbonding_delegations: Request<PaginatedUnbonding>;
  staking_delegator_validators: Request<PaginatedValdiators>;
  staking_params: Request<StakingParam>;
  staking_pool: Request<StakingPool>;
  staking_validators: Request<PaginatedValdiators>;
  staking_validators_address: Request<{validator: Validator}>;
  staking_validators_delegations: Request<PaginatedDelegations>;
  staking_validators_delegations_delegator: Request<{delegation_response: Delegation}>;
  staking_validators_delegations_unbonding_delegations: Request<any>;

  base_tendermint_abci_query: Request<any>;
  base_tendermint_block_latest: Request<Block>;
  base_tendermint_block_height: Request<Block>;
  base_tendermint_node_info: Request<NodeInfo>;
  base_tendermint_validatorsets_latest: Request<PaginatedTendermintValidator>;
  base_tendermint_validatorsets_height: Request<PaginatedTendermintValidator>;

  tx_txs: Request<PaginatedTxs>;
  tx_txs_block: Request<Tx>;
  tx_hash: Request<{tx: Tx, tx_response: TxResponse}>;

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
