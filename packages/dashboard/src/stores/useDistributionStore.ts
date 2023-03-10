import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createDistributionClientForChain } from "@/libs/client";

import { createRpcQueryExtension } from '@ping-pub/codegen/src/cosmos/distribution/v1beta1/query.rpc.Query'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient } from "@cosmjs/stargate";

export const useDistributionStore = defineStore('distributionStore', {
    state: () => {
        return {
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        async fetchCommunityPool() {
            return this.blockchain.rpc.communityPool()
        }
    }
})