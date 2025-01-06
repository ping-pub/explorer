import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useMintStore = defineStore('mintStore', {
  state: () => {
    return {
      inflation: '0',
      community_tax: '0',
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    initial() {
      this.fetchInflation();
      this.fetchCommunityTax();
    },
    async fetchInflation() {
      try {
        const res = await this.blockchain?.rpc?.getMintInflation().catch(() => {
          this.inflation = '0';
        });

        if (res) {
          this.inflation = res.inflation;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async fetchCommunityTax() {
      try {
        const res = await this.blockchain?.rpc
          ?.getDistributionParams()
          .catch(() => {
            this.community_tax = '0';
          });

        if (res) {
          this.community_tax = res.params.community_tax;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
