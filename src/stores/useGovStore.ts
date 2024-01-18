import { defineStore } from 'pinia';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { useBlockchain } from './useBlockchain';
import type { PageRequest, PaginatedProposals } from '@/types';
import { LoadingStatus } from './useDashboard';
import { useWalletStore } from './useWalletStore';
import { reactive } from 'vue';
import {
  Proposal,
  ProposalStatus,
  TextProposal,
  VoteOption,
} from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import type { QueryProposalsResponse } from 'cosmjs-types/cosmos/gov/v1beta1/query';
import type { GovProposalId } from '@cosmjs/stargate';
import type { PageResponse } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';

type ExtraProposal = Proposal & {
  voterStatus: VoteOption;
};

export interface ExtraQueryProposalsResponse {
  /** proposals defines all the requested governance proposals. */
  proposals: ExtraProposal[];
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse;
}

export const useGovStore = defineStore('govStore', {
  state: () => {
    return {
      params: {
        deposit: {},
        voting: {},
        tally: {},
      },
      proposals: {} as Record<ProposalStatus, ExtraQueryProposalsResponse>,
      loading: {} as Record<string, LoadingStatus>,
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    walletstore() {
      return useWalletStore();
    },
  },
  actions: {
    initial() {
      this.$reset();
      this.fetchParams();
      this.fetchProposals(ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD);
    },
    async fetchProposals(status: ProposalStatus, pagination?: PageRequest) {
      //if (!this.loading[status]) {
      this.loading[status] = LoadingStatus.Loading;
      const proposals = reactive(
        await this.blockchain.rpc?.getGovProposals(status, pagination)
      ) as ExtraQueryProposalsResponse;

      //filter spam proposals
      if (proposals?.proposals) {
        proposals.proposals = proposals.proposals.filter((item) => {
          if (item.content) {
            const proposal = TextProposal.decode(item.content.value);
            Object.assign(item.content, proposal);
            return proposal.title.toLowerCase().indexOf('airdrop') === -1;
          }
          return true;
        });
      }

      if (status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD) {
        proposals?.proposals?.forEach((item) => {
          // this.fetchTally(item.proposalId.toString()).then((res) => {
          //   item.finalTallyResult = res?.tally;
          // });
          if (this.walletstore.currentAddress) {
            try {
              this.fetchProposalVotesVoter(
                item.proposalId.toString(),
                this.walletstore.currentAddress
              )
                .then((res) => {
                  item.voterStatus =
                    res.vote.options[res.vote.options.length].option ||
                    VoteOption.VOTE_OPTION_NO_WITH_VETO;
                  // 'No With Veto';
                })
                .catch((reject) => {
                  item.voterStatus = VoteOption.VOTE_OPTION_NO_WITH_VETO;
                });
            } catch (error) {
              item.voterStatus = VoteOption.VOTE_OPTION_NO_WITH_VETO;
            }
          } else {
            item.voterStatus = VoteOption.VOTE_OPTION_NO_WITH_VETO;
          }
        });
      }

      this.loading[status] = LoadingStatus.Loaded;
      this.proposals[status] = proposals;
      //}
      return this.proposals[status];
    },
    async fetchParams() {
      // this.blockchain.rpc.getGovParamsDeposit().then(x => {
      //     this.params.deposit = x.deposit
      // })
    },
    async fetchTally(proposalId: string) {
      return await this.blockchain.rpc.getGovProposalTally(proposalId);
    },
    async fetchProposal(proposalId: string) {
      return await this.blockchain.rpc.getGovProposal(proposalId);
    },
    async fetchProposalDeposits(proposalId: string) {
      return await this.blockchain.rpc.getGovProposalDeposits(proposalId);
    },
    async fetchProposalVotes(proposalId: GovProposalId, page?: PageRequest) {
      return await this.blockchain.rpc.getGovProposalVotes(proposalId, page);
    },
    async fetchProposalVotesVoter(proposalId: string, voter: string) {
      return await this.blockchain.rpc.getGovProposalVotesVoter(
        proposalId,
        voter
      );
    },
  },
});
