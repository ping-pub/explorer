import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { percent,formatNumber,formatTokenAmount } from '@/libs/utils'
export interface stakingItem {
    unbonding_time: string
    max_validators: number
    max_entries:number
    historical_entries:number
    bond_denom: string
    min_commission_rate: string
    min_self_delegation:string
}

export const useParamStore = defineStore("paramstore", {
    state: () => ({
        latestTime: '',
        chain: {
            title: '',
            class: 'border-primary',
            items: [
                { subtitle: 'height', icon: 'BoxIcon', color: 'light-success', value: '' },
                { subtitle: 'bonded_and_supply', icon: 'DollarSignIcon', color: 'light-danger', value: '' },
                { subtitle: 'bonded_ratio', icon: 'PercentIcon', color: 'light-warning', value: '' },
                { subtitle: 'inflation', icon: 'TrendingUpIcon', color: 'light-primary', value: '' },
            ],
        },
        mint: {
            title: 'Mint Parameters',
            items: [] as Array<any>,
        },
        staking: {
            title: 'Staking Parameters',
            items: [] as Array<any>,
        },
        distribution: {
            title: 'Distribution Parameters',
            items: [] as Array<any>,
        },
        slashing: {
            title: 'Slashing Parameters',
            items: [] as Array<any>,
        },
        gov: {
            title: 'Governance Parameters',
            items: [] as Array<any>,
        },
    }),
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        initial() {
            this.handleBaseBlockLatest()
            this.handleMintParam()
            this.handleStakingParams()
        },
        async handleBaseBlockLatest() {
            try {
                const res =  await this.getBaseTendermintBlockLatest()
                const height = this.chain.items.findIndex(x => x.subtitle === 'height')
                this.chain.title = `Chain ID: ${res.block.header.chain_id}`
                this.chain.items[height].value = res.block.header.height
                console.log(res, 999)
                // if (timeIn(res.block.header.time, 3, 'm')) {
                //   this.syncing = true
                // } else {
                //   this.syncing = false
                // }
                // this.latestTime = toDay(res.block.header.time, 'long')
                this.latestTime = res.block.header.time
            } catch (error) {
                console.warn(error)
            }
        },
        async handleStakingParams() {
            const res = await this.getStakingParams()
            const bond_denom = res?.params.bond_denom
            this.staking.items = Object.entries(res.params).map(([key, value]) => ({ subtitle:key,
                value: value })).filter((item: any) => {
                    if (!['min_commission_rate','min_self_delegation'].includes(item.subtitle)) return item 
                 })
            Promise.all([this.getStakingPool(), this.getBankTotal(bond_denom)])
                .then(resArr => { 
                    const pool = resArr[0]?.pool
                    const amount =resArr[1]?.amount?.amount
                    const assets = this.blockchain.current?.assets
                    const bondedAndSupply = this.chain.items.findIndex(x => x.subtitle === 'bonded_and_supply')
                    this.chain.items[bondedAndSupply].value = `${formatNumber(formatTokenAmount(assets,pool.bonded_tokens, 2, bond_denom, false), true, 0)}/${formatNumber(formatTokenAmount(assets,amount, 2, bond_denom, false), true, 0)}`
                    const bondedRatio = this.chain.items.findIndex(x => x.subtitle === 'bonded_ratio')
                    this.chain.items[bondedRatio].value = `${percent(Number(pool.bonded_tokens) /Number(amount)) }%`
                })
        },
        async handleMintParam() {
            const res = await this.getMintParam()
            console.log(res, 'mint')

        },
        async getBaseTendermintBlockLatest() {
            return await this.blockchain.rpc.getBaseBlockLatest()
        },
        async getMintParam() {
            return await this.blockchain.rpc.getMintParam()
        },
        async getStakingParams() {
            return await this.blockchain.rpc.getStakingParams()
        },
        async getStakingPool(){
            return await this.blockchain.rpc.getStakingPool()
        },
        async getBankTotal(denom: string){
            return await this.blockchain.rpc.getBankSupplyByDenom(denom)
            // if (compareVersions(this.config.sdk_version, '0.46.2') > 0) {
            //     return this.get(`/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`).then(data => commonProcess(data).amount)
            //   }
            //   if (compareVersions(this.config.sdk_version, '0.40') < 0) {
            //     return this.get(`/supply/total/${denom}`).then(data => ({ amount: commonProcess(data), denom }))
            //   }
            //   return this.get(`/cosmos/bank/v1beta1/supply/${denom}`).then(data => commonProcess(data).amount)
        }
    }




})