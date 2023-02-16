import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { osmosis } from 'osmojs';
import { LCDClient } from '@osmonauts/lcd'

// import { LCDClient } from 'osmojs/node_modules/@osmonauts/lcd/types/rest'
//import { LCDQueryClient } from 'osmojs/src/codegen/cosmos/bank/v1beta1/query.lcd'
import { LCDQueryClient } from 'osmojs/main/codegen/cosmos/bank/v1beta1/query.lcd.js'

import type { QueryTotalSupplyRequest, QueryTotalSupplyResponseSDKType } from "osmojs/types/codegen/cosmos/bank/v1beta1/query";

import { useBlockchain } from "./useBlockchain";

export const useBankStore = defineStore('pinia.bank.store', {
    state: () => {
        return {
            totalSupply: {} as QueryTotalSupplyResponseSDKType,
        }
    },
    getters: {
        lcdClient() {
            const requestClient = new LCDClient({restEndpoint: useBlockchain().availableEndpoint})
            console.log(requestClient, 'rest client')
            return new LCDQueryClient( { requestClient })
        },
    },
    actions: {
        async fetchTotalSupply(param: QueryTotalSupplyRequest): Promise<QueryTotalSupplyResponseSDKType> {
            this.totalSupply = await this.lcdClient.totalSupply(param)
            return this.totalSupply
        }
    }
})

