import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createGovRestClientForChain } from "@/libs/client";
import type { ProposalStatus } from "@ping-pub/codegen/src/cosmos/gov/v1/gov";
import type { PageRequest } from "@ping-pub/codegen/src/helpers";
import type { DepositParams, DepositParamsSDKType, TallyParams, TallyParamsSDKType, VotingParams, VotingParamsSDKType } from "@ping-pub/codegen/src/cosmos/gov/v1beta1/gov";

export const useGovStore = defineStore('govStore', {
    state: () => {
        return {
            params: {
                deposit: {} as DepositParamsSDKType,
                voting: {} as VotingParamsSDKType,
                tally: {} as TallyParamsSDKType,
            }
        }
    },
    getters: {
        client() {
            const chain = useBlockchain()
            return createGovRestClientForChain(chain.chainName, chain.restClient)
        }
    },
    actions: {
        initial() {
            this.fetchParams()
        },
        fetchProposals( proposalStatus: ProposalStatus, pagination?: PageRequest ) {
            const param = {
                proposalStatus,
                voter: '',
                depositor: '',
                pagination,
            }
            return this.client.proposals(param)
        },
        fetchParams() {
            this.client.params({paramsType: 'deposit'}).then(x => {
                if(x.deposit_params) this.params.deposit = x.deposit_params
            })
            this.client.params({paramsType: 'voting'}).then(x => {
                if(x.voting_params) this.params.voting = x.voting_params
            })
            this.client.params({paramsType: 'tallying'}).then(x => {
                if(x.tally_params) this.params.tally = x.tally_params
            })
        },
        fetchTally(proposalId: Long) {
            return this.client.tallyResult({proposalId})
        }
    }
})
