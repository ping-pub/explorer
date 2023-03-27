import { defineStore } from "pinia";
import { createBaseClientForChain } from "@/libs/client";
import { useBlockchain } from "@/stores";
import dayjs from "dayjs";
import long from "long";
import { PageRequest } from "@ping-pub/codegen/src/cosmos/base/query/v1beta1/pagination";
import { newPageRequest } from "@/libs";

import { createRpcQueryExtension } from '@ping-pub/codegen/src/cosmos/base/tendermint/v1beta1/query.rpc.Service'
import { Tendermint34Client, type BlockResponse } from "@cosmjs/tendermint-rpc";
import { QueryClient, createProtobufRpcClient, setupBankExtension, Setup } from "@cosmjs/stargate";

export const useBaseStore = defineStore('baseStore', {
    state: () => {
        return {
            earlest: {} as BlockResponse,
            latest: {} as BlockResponse,
            recents: [] as BlockResponse[]
        }
    },
    getters: {
        blocktime(): number {
          if(this.earlest && this.latest) {
            if(this.latest.block?.header?.height !== this.earlest.block?.header?.height) {
                const diff = dayjs(this.latest.block?.header?.time).diff(this.earlest.block?.header?.time)
                return diff
            }
          }
          return 6000  
        },
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        async initial() {
            this.fetchLatest()
        },
        async clearRecentBlocks() {
            this.recents = []
        },  
        async fetchLatest() {
            this.latest = await this.blockchain.rpc.block()            
            if(!this.earlest || this.earlest.block?.header?.chainId != this.latest.block?.header?.chainId) {
                //reset earlest and recents
                this.earlest = this.latest
                this.recents = []
            }
            if(this.recents.length>= 50) {
                this.recents.pop()
            }
            this.recents.push(this.latest)
            return this.latest
        },

        async fetchValidatorByHeight(height?: number, offset = 0) {
             return this.blockchain.rpc.validatorsAtHeight(height)
        },
        async fetchLatestValidators(offset = 0) {
            return this.blockchain.rpc.validatorsAtHeight()
        },
        async fetchBlock(height?: number) {
            return this.blockchain.rpc.block(height)
        },
        async fetchAbciInfo() {
            return this.blockchain.rpc.abciInfo()
        }
        // async fetchNodeInfo() {
        //     return this.blockchain.rpc.no()
        // }
    }
})