import { fetchData } from '@/libs';
import {
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupStakingExtension,
  setupTxExtension,
  type AuthExtension,
  type BankExtension,
  type StakingExtension,
  type TxExtension,
  type MintExtension,
  setupMintExtension,
  type GovExtension,
  setupGovExtension,
  type GovProposalId,
  type IbcExtension,
  setupIbcExtension,
  setupSlashingExtension,
  setupDistributionExtension,
} from '@cosmjs/stargate';
import {
  HttpClient,
  Tendermint37Client,
  // Tendermint34Client,
  WebsocketClient,
  type CometClient,
  type AbciQueryParams,
} from '@cosmjs/tendermint-rpc';
import { DEFAULT } from '@/libs';
import {
  adapter,
  type Request,
  type RequestRegistry,
  type AbstractRegistry,
  findApiProfileByChain,
  findApiProfileBySDKVersion,
  registryChainProfile,
  registryVersionProfile,
  withCustomRequest,
} from './registry';
import { buildQuery } from '@cosmjs/tendermint-rpc/build/tendermint37/requests';
import { PageRequest, type Coin } from '@/types';
import type {
  DistributionExtension,
  SlashingExtension,
} from '@cosmjs/stargate/build/modules';
import type { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import type { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

export class BaseRestClient<R extends AbstractRegistry> {
  endpoint: string;
  registry: R;
  protected readonly tmClient: CometClient;
  protected queryClient:
    | QueryClient &
        AuthExtension &
        BankExtension &
        StakingExtension &
        MintExtension &
        GovExtension &
        IbcExtension &
        SlashingExtension &
        DistributionExtension &
        TxExtension;

  constructor(endpoint: string, registry: R) {
    this.endpoint = endpoint;
    this.registry = registry;

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
      setupTxExtension
    );
  }

  async request<T>(
    request: Request<T>,
    args: Record<string, any>,
    query = '',
    adapter?: (source: any) => T
  ) {
    let url = `${request.url.startsWith('http') ? '' : this.endpoint}${
      request.url
    }${query}`;
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
    return new CosmosRestClient(endpoint, DEFAULT);
  }

  static newStrategy(endpoint: string, chain: any) {
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
    return new CosmosRestClient(endpoint, req || DEFAULT);
  }

  // Auth Module
  async getAuthAccounts(page?: PageRequest) {
    if (!page) page = new PageRequest();
    const query = `?${page.toQueryString()}`;
    return this.request(this.registry.auth_accounts, {}, query);
  }
  async getAuthAccount(address: string) {
    // return this.request(this.registry.auth_account_address, { address });
    const res = await this.queryClient.auth.account(address);
    console.log(res);
    return res;
  }
  // Bank Module
  async getBankParams() {
    return this.request(this.registry.bank_params, {});
    // const res = await this.queryClient.bank
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
    const paginationKey = page?.key
      ? Buffer.from(page.key, 'base64')
      : undefined;
    const res = await this.queryClient.bank.totalSupply(paginationKey);
    console.log(res);
    return res;
  }
  async getBankSupplyByDenom(denom: string) {
    let supply;
    try {
      supply = await this.queryClient.bank.supplyOf(denom);
      console.log(supply);
    } catch (err) {
      // will move this to sdk version profile later
      console.log('err getting bank supply: ', err);
    }
    return supply;
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
    const res = await this.queryClient.distribution.validatorCommission(
      validator_address
    );
    console.log(res);
    return res;
  }
  async getDistributionValidatorOutstandingRewards(validator_address: string) {
    // return this.request(
    //   this.registry.distribution_validator_outstanding_rewards,
    //   { validator_address }
    // );
    const res = await this.queryClient.distribution.validatorOutstandingRewards(
      validator_address
    );
    console.log(res);
    return res;
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
    console.log(this.registry.params, subspace, key);
    return this.request(this.registry.params, { subspace, key });
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
  async getGovProposals(status: ProposalStatus, page?: PageRequest) {
    if (!page) page = new PageRequest();
    page.reverse = true;
    // const query = `?proposal_status={status}&${page.toQueryString()}`;
    // return this.request(this.registry.gov_proposals, { status }, query);
    const paginationKey = page?.key
      ? Buffer.from(page.key, 'base64')
      : undefined;
    // @ts-ignore
    const res = await this.queryClient.gov.proposals(
      status,
      '',
      '',
      paginationKey
    );
    console.log(res);
    return res;
  }
  async getGovProposal(proposal_id: string) {
    return this.queryClient.gov.proposal(proposal_id);
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
  async getGovProposalVotes(proposal_id: string, page?: PageRequest) {
    // if (!page) page = new PageRequest();
    // page.reverse = true;
    // const query = `?proposal_status={status}&${page.toQueryString()}`;
    // return this.request(
    //   this.registry.gov_proposals_votes,
    //   { proposal_id },
    //   query
    // );

    const paginationKey = page?.key
      ? Buffer.from(page.key, 'base64')
      : undefined;
    const res = await this.queryClient.gov.votes(proposal_id, paginationKey);
    console.log(res);
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
    const res = await this.queryClient.staking.params();
    console.log(res);
    return res;
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
    const res = await this.queryClient.staking.validators(status);
    console.log(status, res);
    return res;
    // return this.request(this.registry.staking_validators, { status, limit });
  }
  async getStakingValidator(validator_addr: string) {
    // return this.request(this.registry.staking_validators_address, {
    //   validator_addr,
    // });
    const res = await this.queryClient.staking.validator(validator_addr);
    console.log(res);
    return res;
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
    const res = await this.queryClient.staking.validatorDelegations(
      validator_addr
    );
    console.log(res);
    return res;
  }
  async getStakingValidatorsDelegationsDelegator(
    validator_addr: string,
    delegator_addr: string
  ) {
    // return this.request(
    //   this.registry.staking_validators_delegations_delegator,
    //   { validator_addr, delegator_addr }
    // );
    const res = await this.queryClient.staking.delegation(
      delegator_addr,
      validator_addr
    );
    console.log(res);
    return res;
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
    console.log(res);
    return res;
  }
  async getBaseNodeInfo() {
    // return this.request(this.registry.base_tendermint_node_info, {});
    const res = await this.tmClient.status();
    console.log(res);
    return res.nodeInfo;
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
    // if (!page) page = new PageRequest();
    // const query = `?order_by=2&events=message.sender='${sender}'&pagination.limit=${
    //   page.limit
    // }&pagination.offset=${page.offset || 0}`;
    // return this.request(this.registry.tx_txs, {}, query);
    const res = await this.tmClient.txSearch({
      query: buildQuery({
        tags: [
          {
            key: 'message.sender',
            value: sender,
          },
        ],
      }),
      order_by: page?.reverse ? 'desc' : 'asc',
    });
    console.log(res);
    return res;
  }
  // query ibc sending msgs
  // ?&pagination.reverse=true&events=send_packet.packet_src_channel='${channel}'&events=send_packet.packet_src_port='${port}'
  // query ibc receiving msgs
  // ?&pagination.reverse=true&events=recv_packet.packet_dst_channel='${channel}'&events=recv_packet.packet_dst_port='${port}'
  async getTxs(query: string, params: any, page?: PageRequest) {
    // if (!page) page = new PageRequest();
    // return this.request(
    //   this.registry.tx_txs,
    //   params,
    //   `${query}&${page.toQueryString()}`
    // );
    const res = await this.tmClient.txSearch({
      query,
    });
    console.log(res);
    return res;
  }
  async getTxsAt(height: string | number) {
    return this.request(this.registry.tx_txs_block, { height });
  }
  async getTx(hash: string) {
    // return this.request(this.registry.tx_hash, { hash });
    const res = await this.queryClient.tx.getTx(hash);
    console.log(res);
    return res;
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
    const paginationKey = page?.key
      ? Buffer.from(page.key, 'base64')
      : undefined;
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
    return this.request(
      this.registry.interchain_security_ccv_provider_validator_consumer_addr,
      { chain_id, provider_address }
    );
  }
}
