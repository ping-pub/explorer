import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

export const useSupplierStore = defineStore('suppliersStore', {
  state: () => {
    return {};
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    async fetchSuppliers() {
      return this.blockchain.rpc?.getSuppliers();
    },
  },
});
