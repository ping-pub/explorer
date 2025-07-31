import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing';
import dayjs from 'dayjs';
import type { Block } from '@/types';
import { hashTx } from '@/libs';
import { fromBase64 } from '@cosmjs/encoding';

const FETCH_ALL_BLOCKS = import.meta.env.VITE_FETCH_ALL_BLOCKS || false;
const RECENT_BLOCKS_LIMIT = import.meta.env.VITE_RECENT_BLOCK_LIMIT || 50;

export const useBaseStore = defineStore('baseStore', {
  state: () => {
    return {
      earliest: {} as Block,
      latest: {} as Block,
      recents: [] as Block[],
      theme: (window.localStorage.getItem('theme') || 'dark') as 'light' | 'dark',
      connected: false,
    };
  },
  getters: {
    blocktime(): number {
      if (this.earliest && this.latest) {
        if (this.latest.block?.header?.height !== this.earliest.block?.header?.height) {
          const diff = dayjs(this.latest.block?.header?.time).diff(this.earliest.block?.header?.time);
          const blocks = Number(this.latest.block.header.height) - Number(this.earliest.block.header.height);
          return Math.round(diff / blocks);
        }
      }
      return 1000; // better to start low and increase
    },
    blockchain() {
      return useBlockchain();
    },
    hasRpc(): boolean {
      return this.blockchain?.rpc as unknown as boolean;
    },
    currentChainId(): string {
      return this.latest.block?.header.chain_id || '';
    },
    txsInRecents() {
      const txs = [] as {
        height: string;
        hash: string;
        tx: DecodedTxRaw;
      }[];
      this.recents.forEach((b) =>
        b.block?.data?.txs.forEach((tx: string) => {
          if (tx) {
            const raw = fromBase64(tx);
            try {
              txs.push({
                height: b.block.header.height,
                hash: hashTx(raw),
                tx: decodeTxRaw(raw),
              });
            } catch (e) {
              console.error(e);
            }
          }
        })
      );
      return txs.sort((a, b) => {
        return Number(b.height) - Number(a.height);
      });
    },
  },
  actions: {
    async initial() {
      while (!this.hasRpc) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      this.fetchLatest();
    },
    async clearRecentBlocks() {
      this.recents = [];
    },
    async fetchLatest() {
      if (!this.hasRpc) return this.latest;
      try {
        this.latest = await this.blockchain.rpc?.getBaseBlockLatest();
        this.connected = true;
      } catch (error) {
        console.error('Error fetching latest block:', error);
        this.connected = false;
      }
      if (!this.earliest || this.earliest?.block?.header?.chain_id != this.latest?.block?.header?.chain_id) {
        //reset earliest and recents
        this.earliest = this.latest;
        this.recents = [];
      }
      //check if the block exists in recents
      if (this.recents.findIndex((x) => x?.block_id?.hash === this.latest?.block_id?.hash) === -1) {
        const newBlocks = await this.fetchNewBlocks();
        const combined = [...this.recents, ...newBlocks];
        this.recents = combined.slice(-RECENT_BLOCKS_LIMIT);
      }
      return this.latest;
    },
    /**
     * Fetches all blocks since the last block in recents.
     * Only fetches blocks with height greater than this.recents[-1].block.header.height.
     * Returns an array of new blocks to be added to recents.
     */
    async fetchNewBlocks() {
      if (!this.latest?.block?.header?.height) return [];
      if (!FETCH_ALL_BLOCKS) return [this.latest];
      const oldHeight = Number(this.recents[this.recents.length - 1]?.block?.header?.height);
      const newHeight = Number(this.latest.block.header.height);
      let newBlocks = [];
      // Fetch all blocks between oldHeight+1 and less than newHeight
      for (let h = oldHeight + 1; h < newHeight; h++) {
        const block = await this.fetchBlock(h);
        if (!block?.block?.header?.height) continue; // skip if block not found
        newBlocks.push(block);
      }
      // Add the latest block
      newBlocks.push(this.latest);
      return newBlocks;
    },
    async fetchValidatorByHeight(height?: number, offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetAt(String(height), offset);
    },
    async fetchLatestValidators(offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetLatest(offset);
    },
    async fetchBlock(height?: number | string) {
      try {
        const block = await this.blockchain.rpc.getBaseBlockAt(String(height));
        this.connected = true;
        return block;
      } catch (error) {
        console.error('Error fetching latest block:', error);
        this.connected = false;
      }
      return {} as Block;
    },
    async fetchAbciInfo() {
      return this.blockchain.rpc.getBaseNodeInfo();
    },
    // async fetchNodeInfo() {
    //     return this.blockchain.rpc.no()
    // }
  },
});
