import { defineStore } from 'pinia';
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing';
import { useBlockchain } from '@/stores';
import { hashTx } from '@/libs';
import type { Block } from '@/types';

export const useBlockModule = defineStore('blockModule', {
  state: () => {
    return {
      latest: {} as Block,
      current: {} as Block,
      recents: [] as Block[],
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    blocktime() {
      if (this.recents.length < 2) return 6000;
      return 6000; // todo later
    },
    txsInRecents() {
      const txs = [] as { hash: string; tx: DecodedTxRaw }[];
      this.recents.forEach((x) =>
        x.block?.data?.txs.forEach((tx: Uint8Array) => {
          if (tx) {
            try {
              txs.push({
                hash: hashTx(tx),
                tx: decodeTxRaw(tx),
              });
            } catch (e) {}
          }
        })
      );
      return txs;
    },
  },
  actions: {
    initial() {
      this.clearRecentBlocks();
      this.autoFetch();
    },
    async clearRecentBlocks() {
      this.recents = [];
    },
    autoFetch() {
      this.fetchLatest().then((x) => {
        const timer = this.autoFetch;
        this.latest = x;
        // if(this.recents.length >= 50) this.recents.pop()
        // this.recents.push(x)
        // setTimeout(timer, 6000)
      });
    },
    async fetchLatest() {
      this.latest = await this.blockchain.rpc?.getBaseBlockLatest();
      if (this.recents.length >= 50) this.recents.shift();
      this.recents.push(this.latest);
      return this.latest;
    },
    async fetchBlock(height: string) {
      this.current = await this.blockchain.rpc?.getBaseBlockAt(height);
      return this.current;
    },
  },
});
