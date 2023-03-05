import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createDistributionClientForChain } from "@/libs/client";

export const useDistributionStore = defineStore('distributionStore', {
    state: () => {
        return {
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createDistributionClientForChain(chain.chainName, chain.restClient)
        }
    },
    actions: {
        fetchCommunityPool() {
            return this.client.communityPool()
        }
    }
})