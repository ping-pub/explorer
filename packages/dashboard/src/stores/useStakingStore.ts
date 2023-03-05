import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createStakingRestClientForChain } from "@/libs/client";
import type { ParamsSDKType, PoolSDKType } from "@ping-pub/codegen/src/cosmos/staking/v1beta1/staking";

export const useStakingStore = defineStore('stakingStore', {
    state: () => {
        return {
            params: {} as ParamsSDKType,
            pool: {} as PoolSDKType,
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createStakingRestClientForChain(chain.chainName, chain.restClient)
        }
    },
    actions: {
        async init() {
            this.fetchPool()
            return await this.fetchParams()
        },
        async fetchParams() {
            const response = await this.client.params({})
            if(response.params) this.params = response.params
            return this.params
        },
        async fetchPool() {
            const response = await this.client.pool({})
            if(response.pool) {
                this.pool = response.pool
            }
        }
    }
})