import { defineStore } from "pinia";

import { useBlockchain } from "./useBlockchain";
import { createBankClientForChain } from "@/libs/client";
import { QuerySupplyOfRequest, type QueryTotalSupplyRequest, type QueryTotalSupplyResponseSDKType } from "@ping-pub/codegen/src/cosmos/bank/v1beta1/query";
import type { CoinSDKType } from "@ping-pub/codegen/src/cosmos/base/v1beta1/coin";
import { useStakingStore } from "./useStakingStore";

export const useBankStore = defineStore('bankstore', {
    state: () => {
        return {
            supply: {} as CoinSDKType,
            balances: {} as Record<string, CoinSDKType[]>,
            totalSupply: {supply: []} as QueryTotalSupplyResponseSDKType,
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        },
        client() {
            const chain = useBlockchain()
            return createBankClientForChain(chain.chainName, chain.restClient)
        },
        staking() {
            return useStakingStore()
        }
    },
    actions: {
        initial() {
            this.supply = {} as CoinSDKType
            const denom = this.staking.params.bond_denom || this.blockchain.current.assets[0].base
            this.fetchSupply(denom).then(res => {
                if(res.amount) this.supply = res.amount
            })
        },
        
        // cacheBalance(address: string, balances: CoinSDKType[]) {
        //     if(this.balances[address]) {
        //         this.balances[address] = [...this.balances[address], ... balances]
        //     }else {
        //         this.balances[address] = balances
        //     }
        // },
        // async fetchBalance(param: QueryBalanceRequest) : Promise<QueryBalanceResponseSDKType> {
        //    const response : QueryBalanceResponseSDKType =  await this.lcdClient.balance(param)
        //    if (response.balance) this.cacheBalance(param.address, [response.balance])
        //    return response
        // },
        // async fetchAllBalance(param: QueryAllBalancesRequest) : Promise<QueryAllBalancesResponseSDKType> {
        //     const response : QueryAllBalancesResponseSDKType =  await this.lcdClient.allBalances(param)
        //     if (response.balances) this.cacheBalance(param.address, response.balances)
        //     return response
        //  },
        async fetchTotalSupply(param: QueryTotalSupplyRequest): Promise<QueryTotalSupplyResponseSDKType> {
            const response = await this.client.totalSupply(param)
            this.totalSupply.supply = [...this.totalSupply.supply, ...response.supply]
            this.totalSupply.pagination = response.pagination
            return response
        },
        async fetchSupply(denom: string) {
            return this.client.supplyOf( { denom } )
        }
    }
})

