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
      lastFetchTime: 0,
      cache: new Map<string, Block>(),
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
      this.cache.clear();
    },
    autoFetch() {
      const now = Date.now();
      if (now - this.lastFetchTime < 5000) {
        setTimeout(() => this.autoFetch(), 5000);
        return;
      }
      
      this.fetchLatest().then((x) => {
        this.latest = x;
        setTimeout(() => this.autoFetch(), 5000);
      }).catch(() => {
        setTimeout(() => this.autoFetch(), 5000);
      });
    },
    async fetchLatest() {
      this.lastFetchTime = Date.now();
      
      try {
        this.latest = await this.blockchain.rpc?.getBaseBlockLatest();
        
        if (this.latest && !this.recents.some(b => b.block_id?.hash === this.latest.block_id?.hash)) {
          if (this.recents.length >= 50) this.recents.shift();
          this.recents.push(this.latest);
        }
        
        return this.latest;
      } catch (error) {
        console.error('Error fetching latest block:', error);
        return this.latest;
      }
    },
    async fetchBlock(height: string) {
      const cachedBlock = this.cache.get(height);
      if (cachedBlock) {
        this.current = cachedBlock;
        return cachedBlock;
      }
      
      try {
        const block = await this.blockchain.rpc?.getBaseBlockAt(height);
        this.current = block;
        
        this.cache.set(height, block);
        
        if (this.cache.size > 100) {
          const oldestKey = Array.from(this.cache.keys())[0];
          this.cache.delete(oldestKey);
        }
        
        return block;
      } catch (error) {
        console.error(`Error fetching block at height ${height}:`, error);
        throw error;
      }
    },
  },
});
