import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient, setupBankExtension, setupDistributionExtension, setupGovExtension, setupMintExtension, setupStakingExtension } from "@cosmjs/stargate";
import { cosmos } from '@ping-pub/codegen/src/index'
import type { BondStatus } from "@ping-pub/codegen/src/cosmos/staking/v1beta1/staking";
import long from "long";
import type { ProposalStatus } from "@ping-pub/codegen/src/cosmos/gov/v1/gov";

export declare type BondStatusString = keyof Pick<typeof BondStatus, "BOND_STATUS_BONDED" | "BOND_STATUS_UNBONDED" | "BOND_STATUS_UNBONDING"> | "";

export class RPCClient {
    tmClient?: Tendermint34Client;
    queryClient?: QueryClient;
    endpoint: string;
    constructor(endpoint: string) {
        this.endpoint = endpoint
    }
    async getTMClient() {
        if(this.tmClient) {
            return this.tmClient
        } else {
            return await Tendermint34Client.connect(this.endpoint)
        }
    }
    async getQueryClient() {
        if(this.queryClient) {
            return this.queryClient
        } else {
            return new QueryClient(await this.getTMClient())
        }
    }
    async supplyOf(denom: string) {
        return cosmos.bank.v1beta1.createRpcQueryExtension(await this.getQueryClient()).supplyOf({denom})
    }
    async balance(address: string, denom: string) {
        return cosmos.bank.v1beta1.createRpcQueryExtension(await this.getQueryClient()).balance({address, denom})
    }
    async allBalance(address: string) {
        return cosmos.bank.v1beta1.createRpcQueryExtension(await this.getQueryClient()).allBalances({address})
    }
    async block(height?: number) {
        return (await this.getTMClient()).block(height)
    }
    async abciInfo() {
        return (await this.getTMClient()).abciInfo()
    }
    async status() {
        return (await this.getTMClient()).status()
    }
    async validatorsAtHeight(height?: number) {
        return (await this.getTMClient()).validatorsAll(height)
    }
    
    async proposal(id: number) {
        return cosmos.gov.v1beta1.createRpcQueryExtension(await this.getQueryClient()).proposal({proposalId: long.fromNumber(id)})
    }
    async tally(id: number) {
        return cosmos.gov.v1beta1.createRpcQueryExtension(await this.getQueryClient()).tallyResult({proposalId: long.fromNumber(id)})
    }
    async proposals(proposalStatus: ProposalStatus, depositor: string, voter: string, ) {
        return cosmos.gov.v1beta1.createRpcQueryExtension(await this.getQueryClient()).proposals({proposalStatus, depositor, voter, })
    }
    async govParam() {
        const gov = cosmos.gov.v1beta1.createRpcQueryExtension(await this.getQueryClient())
        const deposit = (await gov.params({paramsType: 'deposit'})).depositParams
        const voting = (await gov.params({paramsType: 'voting'})).votingParams
        const tally =  (await gov.params({paramsType: 'tallying'})).tallyParams
        return {
            deposit, voting, tally
        }
    }
    async communityPool() {
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).communityPool()
    }
    async distributionParam() {
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).params()
    }
    async validatorCommission(validatorAddress: string) {
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).validatorCommission({validatorAddress})
    }
    async validatorOutstandingRewards(validatorAddress: string) {
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).validatorOutstandingRewards({validatorAddress})
    }
    async validatorSlashes(validatorAddress: string, start: number, end: number) {
        const startingHeight = long.fromNumber(start)
        const endingHeight = long.fromNumber(end)
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).validatorSlashes({validatorAddress, startingHeight, endingHeight})
    }
    async delegationRewards(delegatorAddress: string, validatorAddress: string) {
        return cosmos.distribution.v1beta1.createRpcQueryExtension(await this.getQueryClient()).delegationRewards({delegatorAddress, validatorAddress})
    }
    async stakingPool() {
        return cosmos.staking.v1beta1.createRpcQueryExtension(await this.getQueryClient()).pool()
    }
    async validator(validatorAddr: string) {
        return cosmos.staking.v1beta1.createRpcQueryExtension(await this.getQueryClient()).validator({validatorAddr})
    }
    async validators(status: BondStatusString, key?: Uint8Array) {
        return cosmos.staking.v1beta1.createRpcQueryExtension(await this.getQueryClient()).validators({status})
    }
    async stakingParams() {
        return cosmos.staking.v1beta1.createRpcQueryExtension(await this.getQueryClient()).params()
    }
    async historicalInfo(height: number) {
        return cosmos.staking.v1beta1.createRpcQueryExtension(await this.getQueryClient()).historicalInfo({height: long.fromNumber(height)})
    }
    async mintParams() {
        return cosmos.mint.v1beta1.createRpcQueryExtension(await this.getQueryClient()).params()
    }
    async inflation() {
        return cosmos.mint.v1beta1.createRpcQueryExtension(await this.getQueryClient()).inflation()
    }

    
}