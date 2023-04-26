import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";

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
        staking: {
            title: 'Staking Parameters',
            items: [] as Array<any>,
        },
        distribution: {
            title: 'Distribution Parameters',
            items: [],
        },
        slashing: {
            title: 'Slashing Parameters',
            items: null,
        },
        mint: {
            title: 'Mint Parameters',
            items: null,
        },
        gov: {
            title: 'Governance Parameters',
            items: [],
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
            this.handleStakingParams()
        },
        async handleBaseBlockLatest() {
            try {
                const res =  await this.getBaseTendermintBlockLatest()
                const height = this.chain.items.findIndex(x => x.subtitle === 'height')
                this.chain.title = `Chain ID: ${res.block.header.chain_id}`
                this.chain.items[height].value = res.block.header.height
                console.log(this.chain.items[height].value, 999)
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
            console.log('handleStakingParams', 99999)

            const res = await this.getStakingParams()
            this.staking.items = Object.entries(res.params).map(([key, value]) => ({ subtitle:key,
                value: value }))

            Promise.all([this.getStakingPool(), this.getBankTotal(res?.params.bond_denom)])
                .then(resArr => { 
                    console.log(resArr, 'ddd')  
                })
                // const totalRes = await this.getBankTotal(res?.params.bond_denom)
                // console.log(res, 9999, totalRes)
           
        },
        // normalize(data: {}, title:string) {
        //     if (!data) return null
        //     const items = this.makeItems(data)
        //     return {
        //       title,
        //       items,
        //     }
        //   },
        //   makeItems(data) {
        //     return Object.keys(data).map(k => {
        //       if (isToken(data[k])) {
        //         return { title: tokenFormatter(data[k]), subtitle: k }
        //       }
        //       if (typeof data[k] === 'boolean') {
        //         return { title: data[k], subtitle: k }
        //       }
        //       return { title: this.convert(data[k]), subtitle: k }
        //     })
        //   },
        async getBaseTendermintBlockLatest() {
            return await this.blockchain.rpc.getBaseBlockLatest()
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