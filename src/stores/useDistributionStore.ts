import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useDistributionStore = defineStore('distributionStore', {
  state: () => {
    return {
      params: {} as {
        community_tax: string;
        base_proposer_reward: string;
        bonus_proposer_reward: string;
        withdraw_addr_enabled: boolean;
      },
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    initial() {
      this.fetchParams();
    },
    async fetchParams() {
      const response = await this.blockchain.rpc?.getDistributionParams();
      if (response?.params) this.params = response.params;
      return this.params;
    },
    async fetchCommunityPool() {
      return this.blockchain.rpc?.getDistributionCommunityPool();
    },
  },
});
