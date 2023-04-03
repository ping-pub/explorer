import { defineStore } from "pinia";
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing'
import { createBaseClientForChain } from "@/libs/client";
import { useBlockchain } from "@/stores";
import type { GetLatestBlockResponse, GetLatestBlockResponseSDKType } from "@ping-pub/codegen/src/cosmos/base/tendermint/v1beta1/query";
import { hashTx } from "@/libs";

export const useBlockModule = defineStore('blockModule', {
    state: () => {
        return {
            latest: {} as GetLatestBlockResponse,
            current: {} as GetLatestBlockResponse,
            recents: [] as GetLatestBlockResponse[]
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        },
        blocktime() {
            if(this.recents.length<2) return 6000
            return 6000 // todo later
        },
        txsInRecents() {
            const txs = [] as {hash:string, tx: DecodedTxRaw}[]
            this.recents.forEach((x:GetLatestBlockResponse) => x.block?.data?.txs.forEach((tx:Uint8Array) => txs.push({
                hash: hashTx(tx),
                tx :decodeTxRaw(tx)
            })))
            return txs
        }
    },
    actions: {
        initial() {
            this.clearRecentBlocks()
            this.autoFetch()            
        },
        async clearRecentBlocks() {
            this.recents = []
        },
        autoFetch() {
            this.fetchLatest().then(x => {
                const timer = this.autoFetch
                this.latest = x;
                // if(this.recents.length >= 50) this.recents.pop()
                // this.recents.push(x)
                // setTimeout(timer, 6000)
            })
        },
        async fetchLatest() {
            this.latest = await this.blockchain.rpc.block()
            if(this.recents.length >= 50) this.recents.shift()
            this.recents.push(this.latest)
            return this.latest
        },
        async fetchBlock(height?: number) {
            this.current = await this.blockchain.rpc.block(height)
            return this.current
        },
    }
})

