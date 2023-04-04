import { fetchData } from '@/libs';
import { DEFAULT } from '@/libs'
import { adapter, type Request, type RequestRegistry } from './registry';

export class CosmosRestClient {
    endpoint: string;
    registry: RequestRegistry;
    constructor(endpoint: string) {
        this.endpoint = endpoint
        this.registry = DEFAULT
    }
    async request<T>(request: Request<T>, args: Record<string, any>, query="") {
        let url = `${this.endpoint}${request.url}${query}`
        Object.keys(args).forEach(k => {
            url = url.replace(`{${k}}`, args[k])
        })
        return fetchData<T>(url, adapter)
    }
    // Auth Module
    async getAuthAccounts() {
        return this.request(this.registry.auth_accounts, {})
    }
    async getAuthAccount(address: string) {
        return this.request(this.registry.auth_account_address, {address})
    }
    // Bank Module
    async getBankParams() {
        return this.request(this.registry.bank_params, {})
    }
    async getBankBalances(address: string) {
        return this.request(this.registry.bank_balances_address, {address})
    }
    async getBankDenomMetadata() {
        return this.request(this.registry.bank_denoms_metadata, {})
    }
    async getBankSupply() {
        return this.request(this.registry.bank_supply, {})
    }
    async getBankSupplyByDenom(denom: string) {
        return this.request(this.registry.bank_supply_by_denom, {denom})
    }
    // Distribution Module
    async getDistributionParams() {
        return this.request(this.registry.distribution_params, {})
    }
    async getDistributionValidatorCommission(validator_address: string) {
        return this.request(this.registry.distribution_validator_commission, {validator_address})
    }
    async getDistributionValidatorOutstandingRewards(validator_address: string) {
        return this.request(this.registry.distribution_validator_outstanding_rewards, {validator_address})
    }
    async getDistributionValidatorSlashes(validator_address: string) {
        return this.request(this.registry.distribution_validator_slashes, {validator_address})
    }
    // Slashing
    async getSlashingParams() {
        return this.request(this.registry.slashing_params, {})
    }
    async getSlashingSigningInfos() {
        return this.request(this.registry.slashing_signing_info, {})
    }
    // Gov
    async getGovParamsVoting() {
        return this.request(this.registry.gov_params_voting, {})
    }
    async getGovParamsDeposit() {
        return this.request(this.registry.gov_params_deposit, {})
    }
    async getGovParamsTally() {
        return this.request(this.registry.gov_params_tally, {})
    }
    async getGovProposals() {
        return this.request(this.registry.gov_proposals, {})
    }
    async getGovProposal(proposal_id: string) {
        return this.request(this.registry.gov_proposals_proposal_id, {proposal_id})
    }
    async getGovProposalDeposits(proposal_id: string) {
        return this.request(this.registry.gov_proposals_deposits, {proposal_id})
    }
    async getGovProposalTally(proposal_id: string) {
        return this.request(this.registry.gov_proposals_tally, {proposal_id})
    }
    async getGovProposalVotes(proposal_id: string) {
        return this.request(this.registry.gov_proposals_votes, {proposal_id})
    }
    async getGovProposalVotesVoter(proposal_id: string, voter: string ) {
        return this.request(this.registry.gov_proposals_votes_voter, {proposal_id, voter})
    }
    // staking
    async getStakingDelegations(delegator_addr: string) {
        return this.request(this.registry.staking_deletations, {delegator_addr})
    }
    async getStakingDelegatorRedelegations(delegator_addr: string) {
        return this.request(this.registry.staking_delegator_redelegations, {delegator_addr})
    }
    async getStakingDelegatorUnbonding(delegator_addr: string) {
        return this.request(this.registry.staking_delegator_unbonding_delegations, {delegator_addr})
    }
    async getStakingDelegatorValidators(delegator_addr: string) {
        return this.request(this.registry.staking_delegator_validators, {delegator_addr})
    }
    async getStakingParams() {
        return this.request(this.registry.staking_params, {})
    }
    async getStakingPool() {
        return this.request(this.registry.staking_pool, {})
    }
    async getStakingValidators() {
        return this.request(this.registry.staking_validators, {})
    }
    async getStakingValidator(validator_addr: string) {
        return this.request(this.registry.staking_validators_address, {validator_addr})
    }
    async getStakingValidatorsDelegations(validator_addr: string) {
        return this.request(this.registry.staking_validators_delegations, {validator_addr})
    }
    async getStakingValidatorsDelegationsDelegator(validator_addr: string, delegator_addr: string) {
        return this.request(this.registry.staking_validators_delegations_delegator, {validator_addr, delegator_addr})
    }
    async getStakingValidatorsDelegationsUnbonding(validator_addr: string, delegator_addr: string) {
        return this.request(this.registry.staking_validators_delegations_unbonding_delegations, {validator_addr, delegator_addr})
    }

    //tendermint 
    async getBaseAbciQuery() {
        return this.request(this.registry.base_tendermint_abci_query, {})
    }
    async getBaseBlockLatest() {
        return this.request(this.registry.base_tendermint_block_latest, {})
    }
    async getBaseBlockAt(height: string|number) {
        return this.request(this.registry.base_tendermint_block_height, {height})
    }
    async getBaseNodeInfo() {
        return this.request(this.registry.base_tendermint_node_info, {})
    }
    async getBaseValidatorsetAt(height: string|number) {
        return this.request(this.registry.base_tendermint_validatorsets_height, {height})
    }
    async getBaseValidatorsetLatest() {
        return this.request(this.registry.base_tendermint_block_latest, {})
    }
    // tx
    async getTxsBySender(sender: string) {
        const query = `?events=message.sender='${sender}'&pagination.reverse=true`
        return this.request(this.registry.tx_txs, {}, query)
    }
    async getTxsAt(height: string|number) {
        return this.request(this.registry.tx_txs_block, {height})
    }
    async getTx(hash: string) {
        return this.request(this.registry.tx_hash, {})
    }

}
