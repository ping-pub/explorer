import { fetchData } from '@/libs';
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
import { PageRequest,type Coin } from '@/types';

export class BaseRestClient<R extends AbstractRegistry> {
  endpoint: string;
  registry: R;
  constructor(endpoint: string, registry: R) {
    this.endpoint = endpoint;
    this.registry = registry;
  }
  async request<T>(request: Request<T>, args: Record<string, any>, query = '', adapter?: (source: any) => Promise<T> ) {
    let url = `${request.url.startsWith("http")?'':this.endpoint}${request.url}${query}`;
    Object.keys(args).forEach((k) => {
      url = url.replace(`{${k}}`, args[k] || '');
    });
    return fetchData<T>(url, adapter||request.adapter);
  }
}

// dynamic all custom request implementations
function registeCustomRequest() {
  const extensions: Record<string, any> = import.meta.glob('./clients/*.ts', { eager: true });
  Object.values(extensions).forEach(m => {
    if(m.store === 'version') {
      registryVersionProfile(m.name, withCustomRequest(DEFAULT, m.requests))
    } else {
      registryChainProfile(m.name, withCustomRequest(DEFAULT, m.requests));
    }
  });
}
    
registeCustomRequest()

export class CosmosRestClient extends BaseRestClient<RequestRegistry> {
  static newDefault(endpoint: string) {
    return new CosmosRestClient(endpoint, DEFAULT)
  }

  static newStrategy(endpoint: string, chain: any) {
    
    let req
    if(chain) {
      // find by name first
      req = findApiProfileByChain(chain.chainName)
      // if not found. try sdk version
      if(!req && chain.versions?.cosmosSdk) {
        req = findApiProfileBySDKVersion(localStorage.getItem(`sdk_version_${chain.chainName}`) || chain.versions?.cosmosSdk)
      }
    }
    return new CosmosRestClient(endpoint, req || DEFAULT)
  }

  // Auth Module
  async getAuthAccounts(page?: PageRequest) {
    if(!page) page = new PageRequest()
    const query =`?${page.toQueryString()}`;
    return this.request(this.registry.auth_accounts, {}, query);
  }
  async getAuthAccount(address: string) {
    return this.request(this.registry.auth_account_address, { address });
  }
  // Bank Module
  async getBankParams() {
    return this.request(this.registry.bank_params, {});
  }
  async getBankBalances(address: string) {
    return this.request(this.registry.bank_balances_address, { address });
  }
  async getBankDenomMetadata() {
    return this.request(this.registry.bank_denoms_metadata, {});
  }
  async getBankSupply(page?: PageRequest) {    
    if(!page) page = new PageRequest()
    const query =`?${page.toQueryString()}`;
    return this.request(this.registry.bank_supply, {}, query);
  }
  async getBankSupplyByDenom(denom: string) {
    let supply;
    try{
       supply = await this.request(this.registry.bank_supply_by_denom, { denom });
    } catch(err) {
      // will move this to sdk version profile later
      supply = await this.request({url: "/cosmos/bank/v1beta1/supply/by_denom?denom={denom}", adapter } as Request<{ amount: Coin }>, { denom });
    }
    return supply
  }
  // Distribution Module
  async getDistributionParams() {
    return this.request(this.registry.distribution_params, {});
  }
  async getDistributionCommunityPool() {
    return this.request(this.registry.distribution_community_pool, {});
  }
  async getDistributionDelegatorRewards(delegator_addr: string) {
    return this.request(this.registry.distribution_delegator_rewards, {
      delegator_addr,
    });
  }
  async getDistributionValidatorCommission(validator_address: string) {
    return this.request(this.registry.distribution_validator_commission, {
      validator_address,
    });
  }
  async getDistributionValidatorOutstandingRewards(validator_address: string) {
    return this.request(
      this.registry.distribution_validator_outstanding_rewards,
      { validator_address }
    );
  }
  async getDistributionValidatorSlashes(validator_address: string) {
    return this.request(this.registry.distribution_validator_slashes, {
      validator_address,
    });
  }
  // Slashing
  async getSlashingParams() {
    return this.request(this.registry.slashing_params, {});
  }
  async getSlashingSigningInfos() {
    const query = '?pagination.limit=300';
    return this.request(this.registry.slashing_signing_info, {}, query);
  }
  // Gov
  async getParams(subspace: string, key: string) {
    console.log(this.registry.params, subspace, key)
    return this.request(this.registry.params, {subspace, key});
  }
  async getGovParamsVoting() {
    return this.request(this.registry.gov_params_voting, {});
  }
  async getGovParamsDeposit() {
    return this.request(this.registry.gov_params_deposit, {});
  }
  async getGovParamsTally() {
    return this.request(this.registry.gov_params_tally, {});
  }
  async getGovProposals(status: string, page?: PageRequest) {
    if(!page) page = new PageRequest()
    page.reverse = true
    const query =`?proposal_status={status}&${page.toQueryString()}`;
    return this.request(this.registry.gov_proposals, { status }, query);
  }
  async getGovProposal(proposal_id: string) {
    return this.request(this.registry.gov_proposals_proposal_id, {
      proposal_id,
    });
  }
  async getGovProposalDeposits(proposal_id: string) {
    return this.request(this.registry.gov_proposals_deposits, { proposal_id });
  }
  async getGovProposalTally(proposal_id: string) {
    return this.request(this.registry.gov_proposals_tally, { proposal_id }, undefined, (source: any) => {
      return Promise.resolve({ tally: {
        yes: source.tally.yes || source.tally.yes_count,
        abstain: source.tally.abstain || source.tally.abstain_count,
        no: source.tally.no || source.tally.no_count,
        no_with_veto: source.tally.no_with_veto || source.tally.no_with_veto_count,
        },
        });
      }
    );
  }
  async getGovProposalVotes(proposal_id: string, page?: PageRequest) {
    if(!page) page = new PageRequest()
    page.reverse = true
    const query =`?proposal_status={status}&${page.toQueryString()}`;
    return this.request(this.registry.gov_proposals_votes, { proposal_id }, query);
  }
  async getGovProposalVotesVoter(proposal_id: string, voter: string) {
    return this.request(this.registry.gov_proposals_votes_voter, {
      proposal_id,
      voter,
    });
  }
  // staking
  async getStakingDelegations(delegator_addr: string) {
    return this.request(this.registry.staking_deletations, { delegator_addr });
  }
  async getStakingDelegatorRedelegations(delegator_addr: string) {
    return this.request(this.registry.staking_delegator_redelegations, {
      delegator_addr,
    });
  }
  async getStakingDelegatorUnbonding(delegator_addr: string) {
    return this.request(this.registry.staking_delegator_unbonding_delegations, {
      delegator_addr,
    });
  }
  async getStakingDelegatorValidators(delegator_addr: string) {
    return this.request(this.registry.staking_delegator_validators, {
      delegator_addr,
    });
  }
  async getStakingParams() {
    return this.request(this.registry.staking_params, {});
  }
  async getStakingPool() {
    return this.request(this.registry.staking_pool, {});
  }
  async getStakingValidators(status: string, limit = 200) {
    return this.request(this.registry.staking_validators, { status, limit });
  }
  async getStakingValidator(validator_addr: string) {
    return this.request(this.registry.staking_validators_address, {
      validator_addr,
    });
  }
  async getStakingValidatorsDelegations(validator_addr: string, page?: PageRequest) {
    if(!page) {
      page = new PageRequest()
      // page.reverse = true
      page.count_total = true
      page.offset = 0
    } 
    const query =`?${page.toQueryString()}`;
    return this.request(this.registry.staking_validators_delegations, {
      validator_addr,
    }, query);
  }
  async getStakingValidatorsDelegationsDelegator(
    validator_addr: string,
    delegator_addr: string
  ) {
    return this.request(
      this.registry.staking_validators_delegations_delegator,
      { validator_addr, delegator_addr }
    );
  }
  async getStakingValidatorsDelegationsUnbonding(
    validator_addr: string,
    delegator_addr: string
  ) {
    return this.request(
      this.registry.staking_validators_delegations_unbonding_delegations,
      { validator_addr, delegator_addr }
    );
  }

  //tendermint
  async getBaseAbciQuery() {
    return this.request(this.registry.base_tendermint_abci_query, {});
  }
  async getBaseBlockLatest() {
    return this.request(this.registry.base_tendermint_block_latest, {});
  }
  async getBaseBlockAt(height: string | number) {
    return this.request(this.registry.base_tendermint_block_height, { height });
  }
  async getBaseNodeInfo() {
    return this.request(this.registry.base_tendermint_node_info, {});
  }
  async getBaseValidatorsetAt(height: string | number, offset: number) {
    const query = `?pagination.limit=100&pagination.offset=${offset}`
    return this.request(this.registry.base_tendermint_validatorsets_height, {
      height,
    }, query);
  }
  async getBaseValidatorsetLatest(offset: number) {
    const query = `?pagination.limit=100&pagination.offset=${offset}`
    return this.request(this.registry.base_tendermint_validatorsets_latest, {}, query);
  }
  // tx
  async getTxsBySender(sender: string, page?: PageRequest) {
    if(!page) page = new PageRequest()
    const query = `?order_by=2&events=message.sender='${sender}'&pagination.limit=${page.limit}&pagination.offset=${page.offset||0}`;
    return this.request(this.registry.tx_txs, {}, query);
  }
  // query ibc sending msgs
  // ?&pagination.reverse=true&events=send_packet.packet_src_channel='${channel}'&events=send_packet.packet_src_port='${port}'
  // query ibc receiving msgs
  // ?&pagination.reverse=true&events=recv_packet.packet_dst_channel='${channel}'&events=recv_packet.packet_dst_port='${port}'
  async getTxs(query: string, params: any, page?: PageRequest) {
    if(!page) page = new PageRequest()    
    return this.request(this.registry.tx_txs, params, `${query}&${page.toQueryString()}`);
  }
  async getTxsAt(height: string | number) {
    return this.request(this.registry.tx_txs_block, { height });
  }
  async getTx(hash: string) {
    return this.request(this.registry.tx_hash, { hash });
  }

  // mint
  async getMintParam() {
    return this.request(this.registry.mint_params, {});
  }
  async getMintInflation() {
    return this.request(this.registry.mint_inflation, {});
  }
  async getMintAnnualProvisions() {
    return this.request(this.registry.mint_annual_provisions, {});
  }

  // ibc
  async getIBCAppTransferDenom(hash: string) {
    return this.request(this.registry.ibc_app_transfer_denom_traces_hash, {
      hash,
    });
  }
  async getIBCConnections(page?: PageRequest) {
    if(!page) page = new PageRequest()
    const query =`?${page.toQueryString()}`;
    return this.request(this.registry.ibc_core_connection_connections, {}, query);
  }
  async getIBCConnectionsById(connection_id: string) {
    return this.request(
      this.registry.ibc_core_connection_connections_connection_id,
      { connection_id }
    );
  }
  async getIBCConnectionsClientState(connection_id: string) {
    return this.request(
      this.registry.ibc_core_connection_connections_connection_id_client_state,
      { connection_id }
    );
  }
  async getIBCConnectionsChannels(connection_id: string) {
    return this.request(this.registry.ibc_core_channel_connections_channels, {
      connection_id,
    });
  }
  async getIBCChannels() {
    return this.request(this.registry.ibc_core_channel_channels, {});
  }
  async getIBCChannelAcknowledgements(channel_id: string, port_id: string) {
    return this.request(
      this.registry.ibc_core_channel_channels_acknowledgements,
      { channel_id, port_id }
    );
  }
  async getIBCChannelNextSequence(channel_id: string, port_id: string) {
    return this.request(this.registry.ibc_core_channel_channels_next_sequence, {
      channel_id,
      port_id,
    });
  }
  async getInterchainSecurityValidatorRotatedKey(chain_id: string, provider_address: string) {
    return this.request(this.registry.interchain_security_ccv_provider_validator_consumer_addr, {chain_id, provider_address});
  }
}
