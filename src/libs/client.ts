import { DEFAULT, fetchData } from '@/libs';
import { PageRequest } from '@/types';
import {
  setupWasmExtension,
  type WasmExtension,
} from '@cosmjs/cosmwasm-stargate';
import { fromBase64, fromHex, toBase64, toHex } from '@cosmjs/encoding';
import type { DecodedTxRaw } from '@cosmjs/proto-signing';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import {
  createProtobufRpcClient,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupGovExtension,
  setupIbcExtension,
  setupMintExtension,
  setupSlashingExtension,
  setupStakingExtension,
  setupTxExtension,
  type AuthExtension,
  type BankExtension,
  type DistributionExtension,
  type GovExtension,
  type GovProposalId,
  type IbcExtension,
  type MintExtension,
  type StakingExtension,
  type TxExtension,
} from '@cosmjs/stargate';
import type { SlashingExtension } from '@cosmjs/stargate/build/modules';
import type { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import { longify } from '@cosmjs/stargate/build/queryclient';
import {
  HttpClient,
  Tendermint37Client,
  WebsocketClient,
  type AbciQueryParams,
  type CometClient,
  type QueryTag,
  type TxResponse,
} from '@cosmjs/tendermint-rpc';
import { buildQuery } from '@cosmjs/tendermint-rpc/build/tendermint37/requests';
import {
  QueryAccountsResponse,
  QueryClientImpl as AuthQueryClientImpl,
} from 'cosmjs-types/cosmos/auth/v1beta1/query';
import {
  QueryClientImpl as BankQueryClientImpl,
  QueryParamsResponse as QueryBankParamsResponse,
  QueryTotalSupplyResponse,
} from 'cosmjs-types/cosmos/bank/v1beta1/query';
import {
  GetNodeInfoResponse,
  ServiceClientImpl as TmQueryClientImpl,
} from 'cosmjs-types/cosmos/base/tendermint/v1beta1/query';
import {
  Proposal,
  TextProposal,
  VoteOption,
  type ProposalStatus,
} from 'cosmjs-types/cosmos/gov/v1beta1/gov';

import { useBlockchain, type ChainConfig } from '@/stores';
import type { PageResponse } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';
import type { QueryValidatorOutstandingRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query';
import {
  QueryClientImpl as GovQueryClientImplV1,
  QueryProposalsResponse as QueryProposalsResponseV1,
} from 'cosmjs-types/cosmos/gov/v1/query';
import {
  QueryClientImpl as GovQueryClientImpl,
  QueryProposalsResponse,
  QueryVotesResponse,
} from 'cosmjs-types/cosmos/gov/v1beta1/query';
import type {
  QueryDelegationResponse,
  QueryValidatorDelegationsResponse,
  QueryValidatorResponse,
} from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { QueryClientImpl as StakingQueryClientImpl } from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { GetTxResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  QueryAllContractStateResponse,
  QueryClientImpl as WasmQueryClientImpl,
  QueryCodesResponse,
  QueryContractsByCreatorResponse,
  QueryParamsResponse as QueryWasmParamsResponse,
} from 'cosmjs-types/cosmwasm/wasm/v1/query';
import { toTimestamp } from 'cosmjs-types/helpers';
import type { Event, EventAttribute } from 'cosmjs-types/tendermint/abci/types';
import semver from 'semver';
import type { Request } from './registry';
import {
  findApiProfileByChain,
  findApiProfileBySDKVersion,
  registryChainProfile,
  registryVersionProfile,
  withCustomRequest,
  type AbstractRegistry,
  type RequestRegistry,
} from './registry';

export const DEFAULT_SDK_VERSION = '0.45.16';
export const LCD_FALLBACK_CHAINS = ['OraiBtcMainnet'];

export type ExtraTxResponse = TxResponse & {
  txRaw: DecodedTxRaw;
  timestamp?: string;
};
export interface ExtraTxSearchResponse {
  readonly txs: ExtraTxResponse[];
  readonly totalCount: number;
}

export type ExtraProposal = Proposal &
  TextProposal & {
    voterStatus: VoteOption;
  };

export interface ExtraQueryProposalsResponse {
  /** proposals defines all the requested governance proposals. */
  proposals: ExtraProposal[];
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse;
}

export interface ExtraExtension {
  readonly extra: {
    readonly accounts: (page?: PageRequest) => Promise<QueryAccountsResponse>;
    readonly votes: (
      proposalId: GovProposalId,
      page?: PageRequest
    ) => Promise<QueryVotesResponse>;
    readonly proposals: (
      proposalStatus: ProposalStatus,
      page?: PageRequest
    ) => Promise<QueryProposalsResponse>;
    readonly proposalsV1: (
      proposalStatus: ProposalStatus,
      page?: PageRequest
    ) => Promise<QueryProposalsResponseV1>;
    readonly totalSupply: (
      page?: PageRequest
    ) => Promise<QueryTotalSupplyResponse>;
    readonly listCode: (page?: PageRequest) => Promise<QueryCodesResponse>;
    readonly wasmParams: () => Promise<QueryWasmParamsResponse>;
    readonly bankParams: () => Promise<QueryBankParamsResponse>;
    readonly contractsByCreator: (
      address: string,
      page?: PageRequest
    ) => Promise<QueryContractsByCreatorResponse>;
    readonly contractStates: (
      address: string,
      page?: PageRequest
    ) => Promise<QueryAllContractStateResponse>;

    readonly validatorDelegations: (
      validatorAddr: string,
      page?: PageRequest
    ) => Promise<QueryValidatorDelegationsResponse>;

    readonly getNodeInfo: () => Promise<GetNodeInfoResponse>;
  };
}
function setupExtraExtension(base: QueryClient) {
  const rpc = createProtobufRpcClient(base);
  const authQueryService = new AuthQueryClientImpl(rpc);
  const govQueryService = new GovQueryClientImpl(rpc);
  const govQueryServiceV1 = new GovQueryClientImplV1(rpc);
  const bankQueryService = new BankQueryClientImpl(rpc);
  const wasmQueryService = new WasmQueryClientImpl(rpc);
  const stakingQueryService = new StakingQueryClientImpl(rpc);
  const tmQueryClientImpl = new TmQueryClientImpl(rpc);
  return {
    extra: {
      accounts: async (page?: PageRequest) => {
        return authQueryService.Accounts({
          pagination: page?.toPagination(),
        });
      },
      votes: async (proposalId: GovProposalId, page?: PageRequest) => {
        return await govQueryService.Votes({
          proposalId: longify(proposalId),
          pagination: page?.toPagination(),
        });
      },
      proposals: async (proposalStatus: ProposalStatus, page?: PageRequest) => {
        return await govQueryService.Proposals({
          proposalStatus,
          voter: '',
          depositor: '',
          pagination: page?.toPagination(),
        });
      },
      proposalsV1: async (
        proposalStatus: ProposalStatus,
        page?: PageRequest
      ) => {
        return await govQueryServiceV1.Proposals({
          proposalStatus,
          voter: '',
          depositor: '',
          pagination: page?.toPagination(),
        });
      },
      totalSupply: async (page?: PageRequest) => {
        return await bankQueryService.TotalSupply({
          pagination: page?.toPagination(),
        });
      },
      listCode: async (page?: PageRequest) => {
        return await wasmQueryService.Codes({
          pagination: page?.toPagination(),
        });
      },
      wasmParams: async () => {
        return await wasmQueryService.Params();
      },
      contractsByCreator: async (address: string, page?: PageRequest) => {
        return await wasmQueryService.ContractsByCreator({
          pagination: page?.toPagination(),
          creatorAddress: address,
        });
      },
      contractStates: async (address: string, page?: PageRequest) => {
        return await wasmQueryService.AllContractState({
          pagination: page?.toPagination(),
          address,
        });
      },
      bankParams: async () => {
        return await bankQueryService.Params();
      },
      validatorDelegations: async (
        validatorAddr: string,
        page?: PageRequest
      ) => {
        return await stakingQueryService.ValidatorDelegations({
          validatorAddr,
          pagination: page?.toPagination(),
        });
      },

      getNodeInfo: async () => {
        return await tmQueryClientImpl.GetNodeInfo();
      },
    },
  };
}

export class BaseRestClient<R extends AbstractRegistry> {
  endpoint: string;
  registry: R;
  version: string;
  protected readonly tmClient: CometClient;
  public queryClient:
    | QueryClient &
        AuthExtension &
        BankExtension &
        StakingExtension &
        MintExtension &
        GovExtension &
        IbcExtension &
        SlashingExtension &
        DistributionExtension &
        TxExtension &
        WasmExtension &
        ExtraExtension;

  constructor(endpoint: string, registry: R, version?: string) {
    this.endpoint = endpoint;
    this.registry = registry;
    this.version = version ?? DEFAULT_SDK_VERSION;

    // init queryClient
    const useHttp =
      this.endpoint.startsWith('http://') ||
      this.endpoint.startsWith('https://');
    const rpcClient = useHttp
      ? new HttpClient(this.endpoint)
      : new WebsocketClient(this.endpoint);
    // @ts-ignore
    this.tmClient = new Tendermint37Client(rpcClient);
    this.queryClient = QueryClient.withExtensions(
      this.tmClient,
      setupAuthExtension,
      setupBankExtension,
      setupStakingExtension,
      setupMintExtension,
      setupGovExtension,
      setupIbcExtension,
      setupSlashingExtension,
      setupDistributionExtension,
      setupTxExtension,
      setupWasmExtension,
      setupExtraExtension
    );
  }
  async request<T>(
    request: Request<T>,
    args: Record<string, any>,
    query = '',
    adapter?: (source: any) => T
  ) {
    let url = request.url;
    if (!url.startsWith('http')) {
      const blockchain = useBlockchain();
      url = (blockchain.current?.endpoints.rest?.[0].address ?? '') + url;
    }

    url += query;
    Object.keys(args).forEach((k) => {
      url = url.replace(`{${k}}`, args[k] || '');
    });

    return fetchData<T>(url, adapter || request.adapter);
  }
}

// dynamic all custom request implementations
function registeCustomRequest() {
  const extensions: Record<string, any> = import.meta.glob('./clients/*.ts', {
    eager: true,
  });
  Object.values(extensions).forEach((m) => {
    if (m.store === 'version') {
      registryVersionProfile(m.name, withCustomRequest(DEFAULT, m.requests));
    } else {
      registryChainProfile(m.name, withCustomRequest(DEFAULT, m.requests));
    }
  });
}

registeCustomRequest();

export class CosmosRestClient extends BaseRestClient<RequestRegistry> {
  static newDefault(endpoint: string) {
    return new CosmosRestClient(endpoint, DEFAULT, DEFAULT_SDK_VERSION);
  }

  static newStrategy(endpoint: string, chain?: ChainConfig) {
    let req;
    if (chain) {
      // find by name first
      req = findApiProfileByChain(chain.chainName);
      // if not found. try sdk version
      if (!req && chain.versions?.cosmosSdk) {
        req = findApiProfileBySDKVersion(
          localStorage.getItem(`sdk_version_${chain.chainName}`) ||
            chain.versions?.cosmosSdk
        );
      }
    }

    return new CosmosRestClient(
      endpoint,
      req || DEFAULT,
      chain?.versions.cosmosSdk ?? DEFAULT_SDK_VERSION
    );
  }

  // Auth Module
  async getAuthAccounts(page?: PageRequest) {
    if (!page) page = new PageRequest();
    // const query = `?${page.toQueryString()}`;
    // return this.request(this.registry.auth_accounts, {}, query);
    const res = await this.queryClient.extra.accounts(page);
    console.log(res);
    return res;
  }
  async getAuthAccount(address: string) {
    // return this.request(this.registry.auth_account_address, { address });
    const res = await this.queryClient.auth.account(address);
    console.log(res);
    return res;
  }
  // Bank Module
  async getBankParams() {
    // return await this.request(this.registry.bank_params, {});
    const res = await this.queryClient.extra.bankParams();
    return res;
  }
  async getBankBalances(address: string) {
    // return this.request(this.registry.bank_balances_address, { address });
    const res = await this.queryClient.bank.allBalances(address);
    console.log(res);
    return res;
  }
  async getBankDenomsMetadata() {
    const res = await this.queryClient.bank.denomsMetadata();
    console.log(res);
    return res;
    // return this.request(this.registry.bank_denoms_metadata, {});
  }
  async getBankSupply(page?: PageRequest) {
    // if (!page) page = new PageRequest();
    // const query = `?${page.toQueryString()}`;
    // return this.request(this.registry.bank_supply, {}, query);
    const res = await this.queryClient.extra.totalSupply(page);
    console.log(res);
    return res;
  }
  async getBankSupplyByDenom(denom: string) {
    try {
      const res = await this.queryClient.bank.supplyOf(denom);
      console.log(res);
      return res;
    } catch (ex) {
      console.log(ex);
    }
  }
  // Distribution Module
  async getDistributionParams() {
    // return this.request(this.registry.distribution_params, {});
    const res = await this.queryClient.distribution.params();
    console.log(res);
    return res;
  }
  async getDistributionCommunityPool() {
    // return this.request(this.registry.distribution_community_pool, {});
    const res = await this.queryClient.distribution.communityPool();
    console.log(res);
    return res;
  }
  async getDistributionDelegatorRewards(delegator_addr: string) {
    // return this.request(this.registry.distribution_delegator_rewards, {
    //   delegator_addr,
    // });
    const res = await this.queryClient.distribution.delegationTotalRewards(
      delegator_addr
    );
    console.log(res);
    return res;
  }
  async getDistributionValidatorCommission(validator_address: string) {
    // return this.request(this.registry.distribution_validator_commission, {
    //   validator_address,
    // });
    try {
      const res = await this.queryClient.distribution.validatorCommission(
        validator_address
      );
      console.log(res);
      return res;
    } catch (ex) {
      console.log(ex);
    }
  }
  async getDistributionValidatorOutstandingRewards(
    validator_address: string
  ): Promise<QueryValidatorOutstandingRewardsResponse | undefined> {
    try {
      const blockchain = useBlockchain();
      if (LCD_FALLBACK_CHAINS.includes(blockchain.chainName)) {
        const { rewards } = await this.request(
          this.registry.distribution_validator_outstanding_rewards,
          { validator_address }
        );

        const res = {
          rewards: {
            rewards:
              rewards?.rewards?.map((r) => {
                return r;
              }) ?? [],
          },
        };
        return res;
      } else {
        const res =
          await this.queryClient.distribution.validatorOutstandingRewards(
            validator_address
          );

        return res;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  async getDistributionValidatorSlashes(
    validator_address: string,
    starting_height: number,
    ending_height: number
  ) {
    // return this.request(this.registry.distribution_validator_slashes, {
    //   validator_address,
    // });
    const res = await this.queryClient.distribution.validatorSlashes(
      validator_address,
      starting_height,
      ending_height
    );
    console.log(res);
    return res;
  }
  // Slashing
  async getSlashingParams() {
    // return this.request(this.registry.slashing_params, {});
    const res = await this.queryClient.slashing.params();
    console.log(res);
    return res;
  }
  async getSlashingSigningInfos() {
    // const query = '?pagination.limit=300';
    // return this.request(this.registry.slashing_signing_info, {}, query);
    const res = await this.queryClient.slashing.signingInfos();
    console.log(res);
    return res;
  }
  // Gov
  async getParams(subspace: string, key: string) {
    // console.log(this.registry.params, subspace, key);
    // return this.request(this.registry.params, { subspace, key });
    switch (subspace) {
      case 'distribution':
        return await this.getDistributionParams();
    }
  }
  async getGovParamsVoting() {
    // return this.request(this.registry.gov_params_voting, {});
    const res = await this.queryClient.gov.params('voting');
    console.log(res);
    return res;
  }
  async getGovParamsDeposit() {
    // return this.request(this.registry.gov_params_deposit, {});
    const res = await this.queryClient.gov.params('deposit');
    console.log(res);
    return res;
  }
  async getGovParamsTally() {
    // return this.request(this.registry.gov_params_tally, {});
    const res = await this.queryClient.gov.params('tallying');
    console.log(res);
    return res;
  }
  async getGovProposals(
    status: ProposalStatus,
    page?: PageRequest
  ): Promise<ExtraQueryProposalsResponse> {
    try {
      // v1 for sdk version > 0.45
      if (semver.gt(this.version, DEFAULT_SDK_VERSION)) {
        const resV1 = await this.queryClient.extra.proposalsV1(status, page);
        return {
          // @ts-ignore
          proposals: resV1.proposals.map((v) => {
            return {
              ...v,
              proposalId: v.id,
            };
          }),
          pagination: resV1.pagination,
        };
      } else {
        const res = await this.queryClient.extra.proposals(status, page);
        res?.proposals.forEach((item) => {
          if (item.content) {
            Object.assign(item, TextProposal.decode(item.content.value));
          }
        });

        return res as ExtraQueryProposalsResponse;
      }
    } catch (ex) {
      console.log(ex);
      return {
        proposals: [],
      };
    }
  }
  async getGovProposal(proposal_id: string) {
    return await this.queryClient.gov.proposal(proposal_id);
  }
  async getGovProposalDeposits(proposal_id: string) {
    return this.queryClient.gov.deposits(proposal_id);
  }
  async getGovProposalTally(proposal_id: string) {
    const res = await this.queryClient.gov.tally(proposal_id);
    console.log(res);
    return res;

    // return this.request(
    //   this.registry.gov_proposals_tally,
    //   { proposal_id },
    //   undefined,
    //   (source: any) => {
    //     return {
    //       tally: {
    //         yes: source.tally.yes || source.tally.yes_count,
    //         abstain: source.tally.abstain || source.tally.abstain_count,
    //         no: source.tally.no || source.tally.no_count,
    //         no_with_veto:
    //           source.tally.no_with_veto || source.tally.no_with_veto_count,
    //       },
    //     };
    //   }
    // );
  }
  async getGovProposalVotes(proposal_id: GovProposalId, page?: PageRequest) {
    // if (!page) page = new PageRequest();
    // page.reverse = true;
    // const query = `?proposal_status={status}&${page.toQueryString()}`;
    // return this.request(
    //   this.registry.gov_proposals_votes,
    //   { proposal_id },
    //   query
    // );

    // const paginationKey = page?.key ? fromBase64(page.key) : undefined;
    const res = await this.queryClient.extra.votes(proposal_id, page);
    console.log('vote', proposal_id, res);
    return res;
  }
  async getGovProposalVotesVoter(proposal_id: string, voter: string) {
    // return this.request(this.registry.gov_proposals_votes_voter, {
    //   proposal_id,
    //   voter,
    // });
    const res = await this.queryClient.gov.vote(proposal_id, voter);
    console.log(res);
    return res;
  }
  // staking
  async getStakingDelegations(delegator_addr: string) {
    const res = await this.queryClient.staking.delegatorDelegations(
      delegator_addr
    );
    return res;
    // console.log(res);
    // return this.request(this.registry.staking_deletations, { delegator_addr });
  }
  async getStakingDelegatorRedelegations(
    delegator_addr: string,
    src_validator_addr: string,
    dest_validator_addr: string
  ) {
    const res = await this.queryClient.staking.redelegations(
      delegator_addr,
      src_validator_addr,
      dest_validator_addr
    );
    return res;
    // return this.request(this.registry.staking_delegator_redelegations, {
    //   delegator_addr,
    // });
  }
  async getStakingDelegatorUnbonding(delegator_addr: string) {
    // return this.request(this.registry.staking_delegator_unbonding_delegations, {
    //   delegator_addr,
    // });
    const res = await this.queryClient.staking.delegatorUnbondingDelegations(
      delegator_addr
    );
    console.log(res);
    return res;
  }
  async getStakingDelegatorValidators(delegator_addr: string) {
    // return this.request(this.registry.staking_delegator_validators, {
    //   delegator_addr,
    // });
    const res = await this.queryClient.staking.delegatorValidators(
      delegator_addr
    );
    console.log(res);
    return res;
  }
  async getStakingParams() {
    try {
      const res = await this.queryClient.staking.params();
      console.log(res);
      return res;
    } catch (ex) {
      console.log(ex);
    }
    // return this.request(this.registry.staking_params, {});
  }
  async getStakingPool() {
    try {
      const res = await this.queryClient.staking.pool();
      // const res = await this.request(this.registry.staking_pool, {});
      console.log(res);
      return res;
    } catch (error) {
      console.log('error staking pool: ', error);
    }
    // return this.request(this.registry.staking_pool, {});
  }
  async getStakingValidators(status: BondStatusString, limit = 200) {
    try {
      const res = await this.queryClient.staking.validators(status);
      console.log(status, res);
      return res;
    } catch (ex) {
      console.log(ex);
    }
  }
  async getStakingValidator(
    validator_addr: string
  ): Promise<QueryValidatorResponse | undefined> {
    try {
      const blockchain = useBlockchain();
      // TODO:// hardcode for nomic sdk
      if (LCD_FALLBACK_CHAINS.includes(blockchain.chainName)) {
        const { validator } = await this.request(
          this.registry.staking_validators_address,
          {
            validator_addr,
          }
        );

        return {
          validator: {
            operatorAddress: validator.operator_address,
            commission: {
              commissionRates: {
                maxChangeRate:
                  validator.commission.commission_rates.max_change_rate,
                maxRate: validator.commission.commission_rates.max_rate,
                rate: validator.commission.commission_rates.rate,
              },
              updateTime: toTimestamp(
                new Date(validator.commission.update_time)
              ),
            },
            consensusPubkey: {
              typeUrl: validator.consensus_pubkey['@type'],
              value: fromBase64(validator.consensus_pubkey.key),
            },
            delegatorShares: validator.delegator_shares,
            description: {
              details: validator.description.details ?? '',
              identity: validator.description.identity ?? '',
              moniker: validator.description.moniker ?? '',
              securityContact: validator.description.security_contact ?? '',
              website: validator.description.website ?? '',
            },
            minSelfDelegation: validator.min_self_delegation,
            unbondingHeight: BigInt(validator.unbonding_height),
            unbondingTime: toTimestamp(new Date(validator.unbonding_time)),
            tokens: validator.tokens,
            status: bondStatusFromJSON(validator.status),
            jailed: validator.jailed,
            unbondingOnHoldRefCount: 0n,
            unbondingIds: [],
          },
        };
      } else {
        const res = await this.queryClient.staking.validator(validator_addr);
        console.log(res);

        return res;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  async getStakingValidatorsDelegations(
    validator_addr: string,
    page?: PageRequest
  ) {
    // if (!page) {
    //   page = new PageRequest();
    //   // page.reverse = true
    //   page.count_total = true;
    //   page.offset = 0;
    // }
    // const query = `?${page.toQueryString()}`;
    // return this.request(
    //   this.registry.staking_validators_delegations,
    //   {
    //     validator_addr,
    //   },
    //   query
    // );
    const res = await this.queryClient.extra.validatorDelegations(
      validator_addr,
      page
    );
    console.log(res);
    return res;
  }
  async getStakingValidatorsDelegationsDelegator(
    validator_addr: string,
    delegator_addr: string
  ): Promise<QueryDelegationResponse | undefined> {
    try {
      const blockchain = useBlockchain();
      // TODO:// hardcode for nomic sdk
      if (LCD_FALLBACK_CHAINS.includes(blockchain.chainName)) {
        const { delegation_responses } = await this.request(
          this.registry.staking_deletations,
          {
            delegator_addr,
          }
        );
        const res = delegation_responses.find(
          (d) => d.delegation.validator_address === validator_addr
        );
        if (res) {
          const response: QueryDelegationResponse = {
            delegationResponse: {
              delegation: {
                delegatorAddress: res.delegation.delegator_address,
                validatorAddress: res.delegation.validator_address,
                shares: res.delegation.shares,
              },
              balance: res.balance,
            },
          };
          return response;
        }
      } else {
        const res = await this.queryClient.staking.delegation(
          delegator_addr,
          validator_addr
        );

        return res;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  async getStakingValidatorsDelegationsUnbonding(
    validator_addr: string,
    delegator_addr: string
  ) {
    // return this.request(
    //   this.registry.staking_validators_delegations_unbonding_delegations,
    //   { validator_addr, delegator_addr }
    // );
    const res = await this.queryClient.staking.unbondingDelegation(
      validator_addr,
      delegator_addr
    );
    console.log(res);
    return res;
  }

  //tendermint
  async getBaseAbciQuery(params: AbciQueryParams) {
    // return this.request(this.registry.base_tendermint_abci_query, {});
    const res = await this.tmClient.abciQuery(params);
    console.log(res);
    return res;
  }
  async getBaseBlockLatest() {
    const res = await this.tmClient.block();
    console.log(res);
    return res;
    // return this.request(this.registry.base_tendermint_block_latest, {});
  }
  async getBaseBlockAt(height: string | number | undefined) {
    // return this.request(this.registry.base_tendermint_block_height, { height });
    const res = await this.tmClient.block(height ? Number(height) : undefined);
    return res;
  }
  async getBaseNodeInfo(): Promise<GetNodeInfoResponse | undefined> {
    // return this.request(this.registry.base_tendermint_node_info, {});
    try {
      const blockchain = useBlockchain();
      // TODO:// hardcode for nomic sdk
      if (LCD_FALLBACK_CHAINS.includes(blockchain.chainName)) {
        const res = await this.tmClient.status();
        return GetNodeInfoResponse.fromPartial({
          // @ts-ignore
          defaultNodeInfo: res.nodeInfo,
        });
      } else {
        return await this.queryClient.extra.getNodeInfo();
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  async getBaseValidatorsetAt(height: string | number, offset: number) {
    // const query = `?pagination.limit=100&pagination.offset=${offset}`;
    // return this.request(
    //   this.registry.base_tendermint_validatorsets_height,
    //   {
    //     height,
    //   },
    //   query
    // );
    // const per_page = 10;
    // const page = Math.ceil(offset / per_page);

    const res = await this.tmClient.validatorsAll(
      Number(height)
      // per_page,
      // page,
    );
    console.log(res);
    return res;
  }
  async getBaseValidatorsetLatest(offset: number) {
    // const query = `?pagination.limit=100&pagination.offset=${offset}`;
    // return this.request(
    //   this.registry.base_tendermint_validatorsets_latest,
    //   {},
    //   query
    // );
    const res = await this.tmClient.validatorsAll();
    console.log(res);
    return res;
  }
  // tx
  async getTxsBySender(sender: string, page?: PageRequest) {
    // const blockchain = useBlockchain();
    // if (blockchain.chainName === 'osmosis') {
    //   if (!page) page = new PageRequest(undefined, true);
    //   page.setCountTotal(false);
    // }

    // const query = `?order_by=2&events=message.sender='${sender}'&pagination.limit=${
    //   page.limit
    // }&pagination.offset=${page.offset || 0}`;
    // return this.request(this.registry.tx_txs, {}, query);

    return await this.getTxs(
      [
        {
          key: 'message.sender',
          value: sender,
        },
      ],
      page
    );
  }

  // query ibc sending msgs
  // ?&pagination.reverse=true&events=send_packet.packet_src_channel='${channel}'&events=send_packet.packet_src_port='${port}'
  // query ibc receiving msgs
  // ?&pagination.reverse=true&events=recv_packet.packet_dst_channel='${channel}'&events=recv_packet.packet_dst_port='${port}'
  async getTxs(
    params?: QueryTag[],
    page?: PageRequest,
    decodeRaw = true
  ): Promise<ExtraTxSearchResponse> {
    // if (!page) page = new PageRequest();
    // return this.request(
    //   this.registry.tx_txs,
    //   params,
    //   `${query}&${page.toQueryString()}`
    // );
    const res = await this.tmClient.txSearch({
      query: buildQuery({
        tags: params,
      }),
      order_by: page?.reverse ? 'desc' : 'asc',
      per_page: page?.limit,
      page:
        page?.limit && page?.offset
          ? Math.ceil(page.offset / page.limit)
          : undefined,
    });

    if (decodeRaw) {
      res.txs.forEach((tx, i) => {
        // @ts-ignore
        tx.txRaw = decodeTxRaw(tx.tx);
      });
    }
    console.log('getTxs', res);
    // @ts-ignore
    return res;
  }

  async getTxsAt(height: string | number) {
    return await this.getTxs([
      {
        key: 'block.height',
        value: height.toString(),
      },
    ]);
  }

  async getTx(hash: string): Promise<GetTxResponse | undefined> {
    try {
      const blockchain = useBlockchain();
      // TODO:// hardcode for nomic sdk
      if (LCD_FALLBACK_CHAINS.includes(blockchain.chainName)) {
        const tmRes = await this.tmClient.tx({ hash: fromHex(hash) });
        const tx = Tx.decode(tmRes.tx);
        const block = await this.tmClient.block(tmRes.height);
        return {
          tx,
          txResponse: {
            height: BigInt(tmRes.height),
            gasUsed: tmRes.result.gasUsed,
            gasWanted: tmRes.result.gasWanted,
            txhash: toHex(tmRes.hash),
            code: tmRes.result.code,
            codespace: tmRes.result.codespace ?? '',
            data: tmRes.result.data ? toHex(tmRes.result.data) : '',
            rawLog: tmRes.result.log ?? '',
            logs: [],
            info: '',
            timestamp: block.block.header.time.toString(),
            events: tmRes.result.events.map((e) => {
              const event: Event = {
                type: e.type,
                attributes: e.attributes.map((a) => {
                  const attribute: EventAttribute = {
                    key: toBase64(a.key),
                    value: toBase64(a.value),
                    index: false,
                  };
                  return attribute;
                }),
              };
              return event;
            }),
          },
        };
      } else {
        return await this.queryClient.tx.getTx(hash);
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  // mint
  async getMintParam() {
    // return this.request(this.registry.mint_params, {});
    const res = await this.queryClient.mint.params();
    console.log(res);
    return res;
  }
  async getMintInflation() {
    // return this.request(this.registry.mint_inflation, {});
    const res = await this.queryClient.mint.inflation();
    console.log(res);
    return res;
  }
  async getMintAnnualProvisions() {
    // return this.request(this.registry.mint_annual_provisions, {});
    const res = await this.queryClient.mint.annualProvisions();
    console.log(res);
    return res;
  }

  // ibc
  async getIBCAppTransferDenom(hash: string) {
    // return this.request(this.registry.ibc_app_transfer_denom_traces_hash, {
    //   hash,
    // });
    const res = await this.queryClient.ibc.transfer.denomTrace(hash);
    console.log(res);
    return res;
  }
  async getIBCConnections(page?: PageRequest) {
    // if (!page) page = new PageRequest();
    // const query = `?${page.toQueryString()}`;
    // return this.request(
    //   this.registry.ibc_core_connection_connections,
    //   {},
    //   query
    // );
    const paginationKey = page?.key ? fromBase64(page.key) : undefined;
    const res = await this.queryClient.ibc.connection.connections(
      paginationKey
    );
    console.log(res);
    return res;
  }
  async getIBCConnectionsById(connection_id: string) {
    // return this.request(
    //   this.registry.ibc_core_connection_connections_connection_id,
    //   { connection_id }
    // );
    const res = await this.queryClient.ibc.connection.connection(connection_id);
    console.log(res);
    return res;
  }
  async getIBCConnectionsClientState(connection_id: string) {
    // return this.request(
    //   this.registry.ibc_core_connection_connections_connection_id_client_state,
    //   { connection_id }
    // );
    const res = await this.queryClient.ibc.connection.clientState(
      connection_id
    );
    console.log(res);
    return res;
  }
  async getIBCConnectionsChannels(connection_id: string) {
    // return this.request(this.registry.ibc_core_channel_connections_channels, {
    //   connection_id,
    // });
    const res = await this.queryClient.ibc.channel.connectionChannels(
      connection_id
    );
    console.log(res);
    return res;
  }
  async getIBCChannels() {
    // return this.request(this.registry.ibc_core_channel_channels, {});
    const res = await this.queryClient.ibc.channel.allChannels();
    console.log(res);
    return res;
  }
  async getIBCChannelAcknowledgements(channel_id: string, port_id: string) {
    // return this.request(
    //   this.registry.ibc_core_channel_channels_acknowledgements,
    //   { channel_id, port_id }
    // );
    const res = await this.queryClient.ibc.channel.packetAcknowledgements(
      port_id,
      channel_id
    );
    console.log(res);
    return res;
  }
  async getIBCChannelNextSequence(channel_id: string, port_id: string) {
    // return this.request(this.registry.ibc_core_channel_channels_next_sequence, {
    //   channel_id,
    //   port_id,
    // });
    const res = await this.queryClient.ibc.channel.nextSequenceReceive(
      port_id,
      channel_id
    );
    console.log(res);
    return res;
  }
  async getInterchainSecurityValidatorRotatedKey(
    chain_id: string,
    provider_address: string
  ) {
    return { consumerAddress: '' };
    // return this.request(
    //   this.registry.interchain_security_ccv_provider_validator_consumer_addr,
    //   { chain_id, provider_address }
    // );
  }
}
