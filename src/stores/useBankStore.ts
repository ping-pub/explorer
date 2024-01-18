import { defineStore } from 'pinia';

import { useBlockchain } from './useBlockchain';
import { useStakingStore } from './useStakingStore';
import type { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import type { DenomTrace } from 'cosmjs-types/ibc/applications/transfer/v1/transfer';

export const useBankStore = defineStore('bankstore', {
  state: () => {
    return {
      supply: {} as Coin | undefined,
      balances: {} as Record<string, Coin[]>,
      totalSupply: { supply: [] as Coin[] },
      ibcDenoms: {} as Record<string, DenomTrace | undefined>,
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    staking() {
      return useStakingStore();
    },
  },
  actions: {
    initial() {
      this.$reset();
      this.supply = {} as Coin;
      const denom =
        this.staking.params.bondDenom ||
        this.blockchain.current?.assets[0].base;
      if (denom) {
        this.blockchain.rpc.getBankSupplyByDenom(denom).then((res) => {
          this.supply = res;
        });
      }
    },
    async fetchSupply(denom: string) {
      return this.blockchain.rpc.getBankSupplyByDenom(denom);
    },
    async fetchDenomTrace(denom: string) {
      const hash = denom.replace('ibc/', '');
      let trace = this.ibcDenoms[hash];
      if (!trace) {
        trace = (await this.blockchain.rpc.getIBCAppTransferDenom(hash))
          .denomTrace;
        this.ibcDenoms[hash] = trace;
      }
      return trace;
    },
  },
});
