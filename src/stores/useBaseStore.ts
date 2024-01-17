import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import { decodeTxRaw, type DecodedTxRaw } from '@cosmjs/proto-signing';
import dayjs from 'dayjs';
import type { Block } from '@/types';
import { hashTx } from '@/libs';
import { fromBase64 } from '@cosmjs/encoding';
import { useRouter } from 'vue-router';
import type { BlockResponse } from '@cosmjs/tendermint-rpc';

const compareHashEqual = (
  firstHash: Uint8Array,
  secondHash: Uint8Array
): boolean => {
  for (let i = 0; i < firstHash.length; i++) {
    if (firstHash[i] !== secondHash[i]) {
      return false;
    }
  }
  return true;
};

export const useBaseStore = defineStore('baseStore', {
  state: () => {
    return {
      earlest: {} as BlockResponse,
      latest: {} as BlockResponse,
      recents: [] as BlockResponse[],
      theme: (window.localStorage.getItem('theme') || 'dark') as
        | 'light'
        | 'dark',
      connected: true,
    };
  },
  getters: {
    blocktime(): number {
      if (this.earlest && this.latest) {
        if (
          this.latest.block?.header?.height !==
          this.earlest.block?.header?.height
        ) {
          const diff = dayjs(this.latest.block?.header?.time.toString()).diff(
            this.earlest.block?.header?.time.toString()
          );
          console.log(
            JSON.stringify(this.earlest),
            JSON.stringify(this.latest)
          );
          const blocks =
            Number(this.latest.block.header.height) -
            Number(this.earlest.block.header.height);
          return diff / blocks;
        }
      }
      return 6000;
    },
    blockchain() {
      return useBlockchain();
    },
    currentChainId(): string {
      return this.latest.block?.header.chainId || '';
    },
    txsInRecents() {
      const txs = [] as {
        height: number;
        hash: string;
        tx: DecodedTxRaw;
      }[];
      this.recents.forEach((b) =>
        b.block?.txs.forEach((raw) => {
          if (raw) {
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
      this.fetchLatest();
    },
    async clearRecentBlocks() {
      this.recents = [];
    },
    async fetchLatest() {
      try {
        this.latest = await this.blockchain.rpc?.getBaseBlockLatest();
        this.connected = true;
      } catch (e) {
        this.connected = false;
      }
      if (
        !this.earlest ||
        this.earlest?.block?.header?.chainId !=
          this.latest?.block?.header?.chainId
      ) {
        //reset earlest and recents
        this.earlest = this.latest;
        this.recents = [];
      }
      //check if the block exists in recents
      if (
        this.recents.findIndex((x) => {
          return compareHashEqual(x.blockId.hash, this.latest.blockId.hash);
        }) === -1
      ) {
        if (this.recents.length >= 50) {
          this.recents.shift();
        }
        this.recents.push(this.latest);
      }
      return this.latest;
    },

    async fetchValidatorByHeight(height?: number, offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetAt(String(height), offset);
    },
    async fetchLatestValidators(offset = 0) {
      return this.blockchain.rpc.getBaseValidatorsetLatest(offset);
    },
    async fetchBlock(height?: number | string) {
      return this.blockchain.rpc.getBaseBlockAt(height);
    },
    async fetchAbciInfo() {
      return this.blockchain.rpc.getBaseNodeInfo();
    },
    // async fetchNodeInfo() {
    //     return this.blockchain.rpc.no()
    // }
  },
});
