import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import type { PageRequest, PaginatedProposals } from "@/types";
import { LoadingStatus } from "./useDashboard";

export const useGovStore = defineStore('govStore', {
    state: () => {
        return {
            params: {
                deposit: {},
                voting: {},
                tally: {},
            },
            proposals: {} as Record<string, PaginatedProposals>,
            loading: {} as Record<string, LoadingStatus>
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
            if(!this.loading[status]) {
                this.loading[status] = LoadingStatus.Loading
                const proposals = await this.blockchain.rpc.getGovProposals(status)
                this.loading[status] = LoadingStatus.Loaded
                this.proposals[status] = proposals

            if(status === '2') {
                proposals.proposals.forEach(x1 => {
                    this.fetchTally(x1.proposal_id).then(t => {
                        x1.final_tally_result = t.tally
                        this.proposals[status] = proposals 
                    })
                })
            }
            }
            return this.proposals[status]
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
