import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import type { PageRequest, PaginatedProposals, GovProposal } from '@/types';
import { LoadingStatus } from './useDashboard';
import { useWalletStore } from './useWalletStore';
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
    },
  },
  actions: {
    initial() {
      this.$reset();
      this.fetchParams();
      this.fetchProposals('2');
    },

    // Cache management
    getCacheKey(status: string) {
      return `gov_proposals_${this.blockchain.chainName}_${status}`;
    },

    getCachedProposals(status: string): PaginatedProposals | null {
      try {
        const cacheKey = this.getCacheKey(status);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp, ttl } = JSON.parse(cached);
          const now = Date.now();
          if (now - timestamp < ttl) {
            console.log(`Using cached proposals for status ${status}`);
            return data;
          } else {
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
        console.warn('Failed to read cached proposals:', error);
      }
      return null;
    },

    setCachedProposals(status: string, data: PaginatedProposals) {
      try {
        const cacheKey = this.getCacheKey(status);
        const cacheData = {
          data,
          timestamp: Date.now(),
          ttl: 24 * 60 * 60 * 1000 // 1 day cache
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Failed to cache proposals:', error);
      }
    },

    async fetchProposals(status: string, pagination?: PageRequest) {
      //if (!this.loading[status]) {
      this.loading[status] = LoadingStatus.Loading;

      // Check cache first
      const cached = this.getCachedProposals(status);

      let proposals;
      let lastKnownProposalId = 0;

      // Always try batch request first, regardless of cache
      try {
        proposals = reactive(
          await this.blockchain.rpc?.getGovProposals(status, pagination)
        );
      } catch (error) {
        console.warn('Batch proposals request failed, falling back to sequential search:', error);

        // If batch fails, use cache if available and resume from last known proposal
        if (cached && cached.proposals.length > 0) {
          proposals = cached;
          // Find the highest proposal ID from cache
          lastKnownProposalId = Math.max(...cached.proposals.map(p => parseInt(p.proposal_id)));
          console.log(`Resuming from proposal ${lastKnownProposalId + 1} using cached data`);
        } else {
          proposals = reactive({
            proposals: [],
            pagination: {
              next_key: undefined,
              total: '0'
            }
          });
        }

        // Fallback: Sequential search with max consecutive failure limit
        const individualProposals: GovProposal[] = [...(proposals.proposals || [])];
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3;
        const statusMap: Record<string, string> = {
          '2': 'PROPOSAL_STATUS_VOTING_PERIOD',
          '3': 'PROPOSAL_STATUS_PASSED',
          '4': 'PROPOSAL_STATUS_REJECTED',
        };
        const statusString = statusMap[status] || status;

        // Sequentially check proposals starting from last known + 1, stopping after maxConsecutiveFailures
        for (let i = lastKnownProposalId + 1; consecutiveFailures < maxConsecutiveFailures; i++) {
          try {
            const proposal = await this.blockchain.rpc?.getGovProposal(i.toString());
            if (proposal?.proposal) {
              consecutiveFailures = 0; // Reset counter on successful request
              if (proposal.proposal.status === statusString) {
                individualProposals.push(proposal.proposal);
              }
            } else {
              consecutiveFailures++;
            }
          } catch (err) {
            consecutiveFailures++;
          }
        }

        // Sort by proposal_id in descending order to match the original behavior
        individualProposals.sort((a, b) => parseInt(b.proposal_id) - parseInt(a.proposal_id));

        proposals = reactive({
          proposals: individualProposals,
          pagination: {
            next_key: undefined,
            total: individualProposals.length.toString()
          }
        });
      }

      // Cache the results before filtering
      this.setCachedProposals(status, proposals);

      //filter spam proposals
      if(proposals?.proposals) {
        proposals.proposals = proposals.proposals.filter((item) => {
          const title = item.content?.title || item.title || ""
          return title.toLowerCase().indexOf("airdrop")===-1
        });
      }

      if (status === '2') {
        proposals?.proposals?.forEach((item) => {
          this.fetchTally(item.proposal_id).then((res) => {
            item.final_tally_result = res?.tally;
          });
          if (this.walletstore.currentAddress) {
            try {
              this.fetchProposalVotesVoter(
                item.proposal_id,
                this.walletstore.currentAddress
              )
                .then((res) => {
                  item.voterStatus = res?.vote?.option || 'VOTE_OPTION_NO_WITH_VETO'
                  // 'No With Veto';
                })
                .catch((reject) => {
                  item.voterStatus = 'VOTE_OPTION_NO_WITH_VETO'
                });
            } catch (error) {
              item.voterStatus = 'VOTE_OPTION_NO_WITH_VETO'
            }
          } else {
            item.voterStatus = 'VOTE_OPTION_NO_WITH_VETO'
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
      return this.blockchain.rpc.getGovProposal(proposalId);
    },
    async fetchProposalDeposits(proposalId: string) {
      return this.blockchain.rpc.getGovProposalDeposits(proposalId);
    },
    async fetchProposalVotes(proposalId: string, page?: PageRequest) {
      return this.blockchain.rpc.getGovProposalVotes(proposalId, page);
    },
    async fetchProposalVotesVoter(proposalId: string, voter: string) {
      return this.blockchain.rpc.getGovProposalVotesVoter(proposalId, voter);
    },
  },
});
