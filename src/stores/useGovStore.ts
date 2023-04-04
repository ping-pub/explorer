import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";

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
        async fetchProposals( proposalStatus: ProposalStatus, pagination?: PageRequest ) {
            const param = {
                proposalStatus,
                voter: '',
                depositor: '',
                pagination,
            }
            const proposals = await this.blockchain.rpc.proposals(proposalStatus, '', '')
            console.log(proposals)
            return proposals
        },
        async fetchParams() {
            // this.blockchain.rpc.govParam().then(x => {
            //     this.params.deposit = x.deposit
            // })
        },
        async fetchTally(proposalId: number) {
            return this.blockchain.rpc.tally(proposalId)
        }
    }
})
