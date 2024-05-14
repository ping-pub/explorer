import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useGatewayStore = defineStore('gatewayStore', {
  state: () => {
    return {};
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    async fetchGateways() {
      return this.blockchain.rpc?.getGateways();
    },
  },
});
