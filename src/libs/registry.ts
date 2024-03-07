import type {
  AuthAccount,
  Block,
  ClientStateWithProof,
  Coin,
  ConnectionWithProof,
  DenomTrace,
  NodeInfo,
  PaginabledAccounts,
  PaginatedIBCChannels,
  PaginatedIBCConnections,
  PaginatedTendermintValidator,
} from '@/types';
import type {
  BankParams,
  PaginatedBalances,
  PaginatedDenomMetadata,
  PaginatedSupply,
} from '@/types/bank';
import type {
  DistributionParams,
  PaginatedSlashes,
} from '@/types/distribution';
import type {
  GovParams,
  GovProposal,
  GovVote,
  PaginatedProposalDeposit,
  PaginatedProposalVotes,
  PaginatedProposals,
  Tally,
} from '@/types/gov';
import type { PaginatedSigningInfo, SlashingParam } from '@/types/slashing';
import type {
  Delegation,
  PaginatedDelegations,
  PaginatedRedelegations,
  PaginatedUnbonding,
  PaginatedValdiators,
  StakingParam,
  StakingPool,
  Validator,
} from '@/types/staking';
import type { PaginatedTxs, Tx, TxResponse } from '@/types';
import semver from 'semver'
export interface Request<T> {
  url: string;
  adapter: (source: any) => Promise<T>;
}

export interface AbstractRegistry {
  [key: string]: Request<any>;
}

// use snake style, since the all return object use snake style.
export interface RequestRegistry extends AbstractRegistry {
  auth_params: Request<any>;
  auth_accounts: Request<PaginabledAccounts>;
  auth_account_address: Request<{ account: AuthAccount }>;

  bank_params: Request<BankParams>;
  bank_balances_address: Request<PaginatedBalances>;
  bank_denoms_metadata: Request<PaginatedDenomMetadata>;
  bank_supply: Request<PaginatedSupply>;
  bank_supply_by_denom: Request<{ amount: Coin }>;

  distribution_params: Request<DistributionParams>;
  distribution_validator_commission: Request<{
    commission?: { commission?: Coin[] };
  }>;
  distribution_validator_outstanding_rewards: Request<{
    rewards?: { rewards?: Coin[] };
  }>;
  distribution_validator_slashes: Request<PaginatedSlashes>;
  distribution_community_pool: Request<{ pool: Coin[] }>;
  distribution_delegator_rewards: Request<{
    rewards: {
      validator_address: string, 
      reward: Coin[]
    }[],
    total: Coin[]
  }>;

  mint_inflation: Request<{ inflation: string }>;
  mint_params: Request<{
    params: {
      mint_denom: string;
      blocks_per_year: string;
    };
  }>;
  mint_annual_provisions: Request<{ annual_provisions: string }>;

  slashing_params: Request<{params: SlashingParam}>;
  slashing_signing_info: Request<PaginatedSigningInfo>;

  gov_params_voting: Request<GovParams>;
  gov_params_tally: Request<GovParams>;
  gov_params_deposit: Request<GovParams>;
  gov_proposals: Request<PaginatedProposals>;
  gov_proposals_proposal_id: Request<{ proposal: GovProposal }>;
  gov_proposals_deposits: Request<PaginatedProposalDeposit>;
  gov_proposals_tally: Request<{ tally: Tally }>;
  gov_proposals_votes: Request<PaginatedProposalVotes>;
  gov_proposals_votes_voter: Request<{ vote: GovVote }>;

  staking_deletations: Request<PaginatedDelegations>;
  staking_delegator_redelegations: Request<PaginatedRedelegations>;
  staking_delegator_unbonding_delegations: Request<PaginatedUnbonding>;
  staking_delegator_validators: Request<PaginatedValdiators>;
  staking_params: Request<StakingParam>;
  staking_pool: Request<StakingPool>;
  staking_validators: Request<PaginatedValdiators>;
  staking_validators_address: Request<{ validator: Validator }>;
  staking_validators_delegations: Request<PaginatedDelegations>;
  staking_validators_delegations_delegator: Request<{
    delegation_response: Delegation;
  }>;
  staking_validators_delegations_unbonding_delegations: Request<PaginatedUnbonding>;

  base_tendermint_abci_query: Request<any>;
  base_tendermint_block_latest: Request<Block>;
  base_tendermint_block_height: Request<Block>;
  base_tendermint_node_info: Request<NodeInfo>;
  base_tendermint_validatorsets_latest: Request<PaginatedTendermintValidator>;
  base_tendermint_validatorsets_height: Request<PaginatedTendermintValidator>;

  params: Request<{param: any}>;

  tx_txs: Request<PaginatedTxs>;
  tx_txs_block: Request<Tx>;
  tx_hash: Request<{ tx: Tx; tx_response: TxResponse }>;

  ibc_app_ica_controller_params: Request<any>;
  ibc_app_ica_host_params: Request<any>;
  ibc_app_transfer_escrow_address: Request<any>;
  ibc_app_transfer_denom_traces: Request<any>;
  ibc_app_transfer_denom_traces_hash: Request<{
    denom_trace: DenomTrace;
  }>;
  ibc_core_channel_channels: Request<PaginatedIBCChannels>;
  ibc_core_channel_channels_next_sequence: Request<{
    next_sequence_receive: string;
    proof: string;
    proof_height: {
      revision_number: string;
      revision_height: string;
    };
  }>;
  ibc_core_channel_channels_acknowledgements: Request<any>;
  ibc_core_channel_connections_channels: Request<PaginatedIBCChannels>;
  ibc_core_connection_connections: Request<PaginatedIBCConnections>;
  ibc_core_connection_connections_connection_id: Request<ConnectionWithProof>;
  ibc_core_connection_connections_connection_id_client_state: Request<ClientStateWithProof>;
  interchain_security_ccv_provider_validator_consumer_addr: Request<{consumer_address: string}>
}

export function adapter<T>(source: any): Promise<T> {
  return source;
}

export interface ApiProfileRegistry {
  [key: string]: RequestRegistry;
}

export function withCustomRequest<T extends RequestRegistry>(
  target: T,
  source?: Partial<T>
): T {
  return source ? Object.assign({}, target, source) : target;
}

// SDK Version Profile Registry
export const VERSION_REGISTRY: ApiProfileRegistry = {};
// ChainName Profile Registory
export const NAME_REGISTRY: ApiProfileRegistry = {};

export function registryVersionProfile(version: string, requests: RequestRegistry) {
  VERSION_REGISTRY[version] = requests
}

export function registryChainProfile(version: string, requests: RequestRegistry) {
  NAME_REGISTRY[version] = requests
}
export function findApiProfileByChain(
  name: string,
): RequestRegistry {
  const url = NAME_REGISTRY[name];
  // if (!url) {
  //   throw new Error(`Unsupported version or name: ${name}`);
  // }
  return url;
}

export function findApiProfileBySDKVersion(
  version: string,
): RequestRegistry | undefined {
  let closestVersion: string | null = null;

  for (const k in VERSION_REGISTRY) {
    const key = k.replace('v', "")
    // console.log(semver.gt(key, version), semver.gte(version, key), key, version)
    if (semver.lte(key, version)) {
      if (!closestVersion || semver.gt(key, closestVersion)) {
        closestVersion = k;
      }
    }
  }
  // console.log(`Closest version to ${version}: ${closestVersion}`, VERSION_REGISTRY);
  if (!closestVersion) {
    return undefined;
  }
  return VERSION_REGISTRY[closestVersion];
}
