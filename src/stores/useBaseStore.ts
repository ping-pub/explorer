import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import dayjs from 'dayjs';
import type { Block } from '@/types';

export const useBaseStore = defineStore('baseStore', {
  state: () => {
    return {
      earlest: {} as Block,
      latest: {} as Block,
      recents: [] as Block[],
    };
  },
  getters: {
    blocktime(): number {
      if (this.earlest && this.latest) {
        if (
          this.latest.block?.header?.height !==
          this.earlest.block?.header?.height
        ) {
          const diff = dayjs(this.latest.block?.header?.time).diff(
            this.earlest.block?.header?.time
          );
          return diff;
        }
      }
      return 6000;
    },
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    async initial() {
      this.fetchLatest();
    },
    async clearRecentBlocks() {
      this.recents = [];
    },
    async fetchLatest() {
      this.latest = await this.blockchain.rpc.getBaseBlockLatest();
      if (
        !this.earlest ||
        this.earlest.block?.header?.chain_id !=
          this.latest.block?.header?.chain_id
      ) {
        //reset earlest and recents
        this.earlest = this.latest;
        this.recents = [];
      }
      if (this.recents.length >= 50) {
        this.recents.pop();
      }
      this.recents.push(this.latest);
      return this.latest;
    },

    async fetchValidatorByHeight(height?: number, offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetAt(String(height), offset);
    },
    async fetchLatestValidators(offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetLatest(offset);
    },
    async fetchBlock(height?: number) {
      return this.blockchain.rpc.getBaseBlockAt(String(height));
    },
    async fetchAbciInfo() {
      return this.blockchain.rpc.getBaseNodeInfo();
    },
    // async fetchNodeInfo() {
    //     return this.blockchain.rpc.no()
    // }
  },
});
