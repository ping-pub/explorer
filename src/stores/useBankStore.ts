import { defineStore } from "pinia";

import { useBlockchain } from "./useBlockchain";
import { useStakingStore } from "./useStakingStore";
import type { Coin } from "@/types";

export const useBankStore = defineStore('bankstore', {
    state: () => {
        return {
            supply: {} as Coin[],
            balances: {} as Record<string, Coin[]>,
            totalSupply: {supply: []} ,
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        },
        staking() {
            return useStakingStore()
        }
    },
    actions: {
        initial() {
            this.$reset()
            this.supply = {} as Coin
            const denom = this.staking.params.bondDenom || this.blockchain.current?.assets[0].base
            if(denom) {
                this.blockchain.rpc.supplyOf(denom).then(res => {
                    if(res.amount) this.supply = res.amount
                })
            }
        },
        // async fetchTotalSupply(param: QueryTotalSupplyRequest): Promise<QueryTotalSupplyResponse> {
        //     const response = await this.blockchain.rpc.(param)
        //     this.totalSupply.supply = [...this.totalSupply.supply, ...response.supply]
        //     this.totalSupply.pagination = response.pagination
        //     return response
        // },
        async fetchSupply(denom: string) {
            return this.blockchain.rpc.supplyOf( denom )
        }
    }
})

