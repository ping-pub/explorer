import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createGovRestClientForChain } from "@/libs/client";
import type { ProposalStatus } from "@ping-pub/codegen/src/cosmos/gov/v1/gov";
import type { PageRequest } from "@ping-pub/codegen/src/helpers";

export const useStoreName = defineStore('govStore', {
    state: () => {
        return {
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createGovRestClientForChain(chain.chainName, chain.restClient)
        }
    },
    actions: {
        fetehProposals( proposalStatus: ProposalStatus, pagination?: PageRequest ) {
            const param = {
                proposalStatus,
                voter: '',
                depositor: '',
                pagination,
            }
            return this.client.proposals(param)
        }
    }
})