import { defineStore } from "pinia";

import type { QuerySupplyOfRequest, QueryTotalSupplyRequest, QueryBalanceRequest,QueryAllBalancesRequest, QueryAllBalancesResponseSDKType, QueryBalanceResponseSDKType, QueryTotalSupplyResponseSDKType } from "osmojs/types/codegen/cosmos/bank/v1beta1/query";

import { useBlockchain } from "./useBlockchain";
import type { CoinSDKType } from "osmojs/types/codegen/cosmos/base/v1beta1/coin";

export const useBankStore = defineStore('bankstore', {
    state: () => {
        return {
            balances: {} as Record<string, CoinSDKType[]>,
            totalSupply: {supply: []} as QueryTotalSupplyResponseSDKType,
        }
    },
    // getters: {
    //     lcdClient() {
    //         return new client.bank.LCDQueryClient( {
    //             requestClient: useBlockchain().restClient
    //         })
    //     },
    // },
    // actions: {
    //     cacheBalance(address: string, balances: CoinSDKType[]) {
    //         if(this.balances[address]) {
    //             this.balances[address] = [...this.balances[address], ... balances]
    //         }else {
    //             this.balances[address] = balances
    //         }
    //     },
    //     async fetchBalance(param: QueryBalanceRequest) : Promise<QueryBalanceResponseSDKType> {
    //        const response : QueryBalanceResponseSDKType =  await this.lcdClient.balance(param)
    //        if (response.balance) this.cacheBalance(param.address, [response.balance])
    //        return response
    //     },
    //     async fetchAllBalance(param: QueryAllBalancesRequest) : Promise<QueryAllBalancesResponseSDKType> {
    //         const response : QueryAllBalancesResponseSDKType =  await this.lcdClient.allBalances(param)
    //         if (response.balances) this.cacheBalance(param.address, response.balances)
    //         return response
    //      },
    //     async fetchTotalSupply(param: QueryTotalSupplyRequest): Promise<QueryTotalSupplyResponseSDKType> {
    //         const response = await this.lcdClient.totalSupply(param)
    //         this.totalSupply.supply = [...this.totalSupply.supply, ...response.supply]
    //         this.totalSupply.pagination = response.pagination
    //         return response
    //     },
    // }
})

