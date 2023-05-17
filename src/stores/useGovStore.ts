import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import type { PageRequest, PaginatedProposals } from '@/types';
import { LoadingStatus } from './useDashboard';
import { useWalletStore } from './useWalletStore'
import { reactive } from 'vue';

export const useGovStore = defineStore('govStore', {
  state: () => {
    return {
      params: {
        deposit: {},
        voting: {},
        tally: {},
      },
      proposals: {} as Record<string, PaginatedProposals>,
      loading: {} as Record<string, LoadingStatus>,
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    walletstore() {
      return useWalletStore();
    }
  },
  actions: {
    initial() {
      this.$reset()
      this.fetchParams();
      this.fetchProposals("2");
    },
    async fetchProposals(status: string, pagination?: PageRequest) {
      if (!this.loading[status]) {
        this.loading[status] = LoadingStatus.Loading;
        const proposals = reactive(
          await this.blockchain.rpc?.getGovProposals(status)
        );
        if (status === '2') {
          proposals?.proposals?.forEach(async (item) => {
            await this.fetchTally(item.proposal_id).then((res) => {
              item.final_tally_result = res?.tally;
            });
            if (this.walletstore.currentAddress) {
              try {
                await this.fetchProposalVotesVoter(item.proposal_id,this.walletstore.currentAddress).then((res) => {
                  item.voterStatus = res?.vote?.option || 'No With Veto'
                });
              } catch (error) {
                item.voterStatus = 'No With Veto'
              }
            } else {
              item.voterStatus = 'No With Veto'
            }
          });
        }
        
        this.loading[status] = LoadingStatus.Loaded;
        this.proposals[status] = proposals;
      }
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
      return this.blockchain.rpc.getGovProposal(proposalId);
    },
    async fetchProposalDeposits(proposalId: string) {
      return this.blockchain.rpc.getGovProposalDeposits(proposalId);
    },
    async fetchProposalVotes(proposalId: string, next_key?: string) {
      return this.blockchain.rpc.getGovProposalVotes(proposalId, next_key);
    },
    async fetchProposalVotesVoter(proposalId: string, voter: string) {
      return this.blockchain.rpc.getGovProposalVotesVoter(proposalId, voter);
    },
  },
});
