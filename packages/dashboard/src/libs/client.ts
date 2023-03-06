import { LCDQueryClient as BankRestClient} from '@ping-pub/codegen/src/cosmos/bank/v1beta1/query.lcd'
import { LCDQueryClient as BaseRestClient} from '@ping-pub/codegen/src/cosmos/base/tendermint/v1beta1/query.lcd'
import { LCDQueryClient as MintRestClient} from '@ping-pub/codegen/src/cosmos/mint/v1beta1/query.lcd'
import { LCDQueryClient as DistributionRestClient} from '@ping-pub/codegen/src/cosmos/distribution/v1beta1/query.lcd'
import { LCDQueryClient as GovRestClient} from '@ping-pub/codegen/src/cosmos/gov/v1beta1/query.lcd'
import { LCDQueryClient as StakingRestClient} from '@ping-pub/codegen/src/cosmos/staking/v1beta1/query.lcd'
import { LCDQueryClient as SlashingRestClient} from '@ping-pub/codegen/src/cosmos/slashing/v1beta1/query.lcd'
import type { LCDClient } from '@osmonauts/lcd'

const mint: Record<string, typeof MintRestClient> = {}

function createMintClient<A extends MintRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createMintClientForChain(chainName: string, lcd: LCDClient) {
    return createMintClient(mint[chainName] || MintRestClient, lcd)
}

const bank: Record<string, typeof BankRestClient> = {}

function createBankClient<A extends BankRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createBankClientForChain(chainName: string, lcd: LCDClient) {
    return createBankClient(bank[chainName] || BankRestClient, lcd)
}

const base: Record<string, typeof BaseRestClient> = {}

function createBaseClient<A extends BaseRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createBaseClientForChain(chainName: string, lcd: LCDClient) {
    return createBaseClient(base[chainName] || BaseRestClient, lcd)
}

const distribution: Record<string, typeof DistributionRestClient> = {}

function createDistributionClient<A extends DistributionRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createDistributionClientForChain(chainName: string, lcd: LCDClient) {
    return createDistributionClient(distribution[chainName] || DistributionRestClient, lcd)
}

const gov: Record<string, typeof GovRestClient> = {}

function createGovClient<A extends GovRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createGovRestClientForChain(chainName: string, lcd: LCDClient) {
    return createGovClient(gov[chainName] || GovRestClient, lcd)
}

const staking: Record<string, typeof StakingRestClient> = {}

function createStakingClient<A extends StakingRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createStakingRestClientForChain(chainName: string, lcd: LCDClient) {
    return createStakingClient(staking[chainName] || StakingRestClient, lcd)
}

const slasing: Record<string, typeof SlashingRestClient> = {}

function createSlashingClient<A extends SlashingRestClient, B extends LCDClient>(c: new (rest: { requestClient: B}) => A, requestClient: B): A {
    return new c({requestClient});
}
export function createSlashingRestClientForChain(chainName: string, lcd: LCDClient) {
    return createSlashingClient(slasing[chainName] || SlashingRestClient, lcd)
}
