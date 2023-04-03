import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";

export const useMintStore = defineStore('mintStore', {
    state: () => {
        return {
            inflation: "0",
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        initial() {
            this.fetchInflation()
        },
        async fetchInflation() {
            this.blockchain.rpc.inflation().then(x => {
                this.inflation = x.inflation
            }).catch(() => {
                this.inflation = "0"
            })
        }
    }
})