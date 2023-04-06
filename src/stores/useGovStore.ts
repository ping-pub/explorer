import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import type { PageRequest } from "@/types";

export const useGovStore = defineStore('govStore', {
    state: () => {
        return {
            params: {
                deposit: {},
                voting: {},
                tally: {},
            }
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        initial() {
            this.fetchParams()
        },
        async fetchProposals( status: string, pagination?: PageRequest ) {
            const proposals = await this.blockchain.rpc.getGovProposals(status)
            return proposals
        },
        async fetchParams() {
            // this.blockchain.rpc.getGovParamsDeposit().then(x => {
            //     this.params.deposit = x.deposit
            // })
        },
        async fetchTally(proposalId: string) {
            return this.blockchain.rpc.getGovProposalTally(proposalId)
        }
    }
})
