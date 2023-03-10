import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createMintClientForChain } from "@/libs/client";

import { createRpcQueryExtension } from '@ping-pub/codegen/src/cosmos/mint/v1beta1/query.rpc.Query'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient, setupMintExtension } from "@cosmjs/stargate";

export const useMintStore = defineStore('mintStore', {
    state: () => {
        return {
            inflation: "",
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        async fetchInflation() {
            this.blockchain.rpc.inflation().then(x => {
                this.inflation = String(x)
            }).catch(err => {
                this.inflation = ""
            })
        }
    }
})