import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useMintStore = defineStore('mintStore', {
  state: () => {
    return {
      inflation: '0',
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
  },
});
