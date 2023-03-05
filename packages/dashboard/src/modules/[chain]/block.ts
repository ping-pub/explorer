import { defineStore } from "pinia";
import { createBaseClientForChain } from "@/libs/client";
import { useBlockchain } from "@/stores";
import type { GetLatestBlockResponseSDKType } from "@ping-pub/codegen/src/cosmos/base/tendermint/v1beta1/query";

export const useBlockModule = defineStore('blockModule', {
    state: () => {
        return {
            latest: {} as GetLatestBlockResponseSDKType,
            recents: [] as GetLatestBlockResponseSDKType[]
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createBaseClientForChain(chain.name, chain.restClient)
        }
    },
    actions: {
        async clearRecentBlocks() {
            this.recents = []
        },
        async fetchLatest() {
            this.latest = await this.client.getLatestBlock()
            if(this.recents.length>= 50) {
                this.recents.pop()
            }
            this.recents.push(this.latest)
            return this.latest
        },
        async fetchSync() {
            return this.client.getSyncing()
        },
        async fetchNodeInfo() {
            return this.client.getNodeInfo()
        }
    }
})