import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useApplicationStore = defineStore('applicationsStore', {
  state: () => {
    return {};
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    async fetchApplications() {
      return this.blockchain.rpc?.getApplications();
    },
  },
});
