import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createMintClientForChain } from "@/libs/client";

export const useMintStore = defineStore('mintStore', {
    state: () => {
        return {
            inflation: "",
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createMintClientForChain(chain.chainName, chain.restClient)
        }
    },
    actions: {
        fetchInflation() {
            this.client.inflation({}).then(x => {
                this.inflation = String(x.inflation)
                console.log(this.inflation)
            })
        }
    }
})