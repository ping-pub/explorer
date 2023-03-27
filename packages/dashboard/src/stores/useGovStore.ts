import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import { createGovRestClientForChain } from "@/libs/client";
import type { DepositParams, ProposalStatus } from "@ping-pub/codegen/src/cosmos/gov/v1/gov";
import type { PageRequest } from "@ping-pub/codegen/src/helpers";
import { createRpcQueryExtension } from '@ping-pub/codegen/src/cosmos/gov/v1beta1/query.rpc.Query'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient } from "@cosmjs/stargate";

export const useGovStore = defineStore('govStore', {
    state: () => {
        return {
            params: {
                deposit: {} as DepositParams,
                voting: {} as VotingParams,
                tally: {} as TallyParams,
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
