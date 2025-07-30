import { defineStore } from 'pinia';
import { useBaseStore, useBlockchain } from '@/stores';

export const useBlockModule = defineStore('blockModule', {
  getters: {
    baseStore() {
      return useBaseStore();
    },
    blockchain() {
      return useBlockchain();
    },
    blocktime() {
      return useBaseStore().blocktime;
    },
    txsInRecents() {
      return useBaseStore().txsInRecents;
    },
    latest(){
      return useBaseStore().latest;
    },
    earliest() {
      return useBaseStore().earliest;
    },
    recents() {
      return useBaseStore().recents;
    }
  },
  actions: {
    initial() {
      this.clearRecentBlocks();
    },
    async clearRecentBlocks() {
      return this.baseStore.clearRecentBlocks()
    },
    async fetchLatest() {
      return this.baseStore.fetchLatest()
    },
    async fetchBlock(height: string) {
      return this.baseStore.fetchBlock(height)
    },
  },
});
