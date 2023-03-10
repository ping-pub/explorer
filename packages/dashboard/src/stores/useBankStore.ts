import { defineStore } from "pinia";

import { useBlockchain } from "./useBlockchain";
import type { QueryTotalSupplyResponse, QueryTotalSupplyRequest } from "@ping-pub/codegen/src/cosmos/bank/v1beta1/query";
import type { Coin } from "@ping-pub/codegen/src/cosmos/base/v1beta1/coin";
import { useStakingStore } from "./useStakingStore";
import { createRpcQueryExtension } from '@ping-pub/codegen/src/cosmos/bank/v1beta1/query.rpc.Query'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient } from "@cosmjs/stargate";

export const useBankStore = defineStore('bankstore', {
    state: () => {
        return {
            supply: {} as Coin,
            balances: {} as Record<string, Coin[]>,
            totalSupply: {supply: []} as QueryTotalSupplyResponse,
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

