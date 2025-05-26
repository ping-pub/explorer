import { defineStore } from 'pinia';

import { useBlockchain } from './useBlockchain';
import { useStakingStore } from './useStakingStore';
import type { Coin, DenomTrace } from '@/types';

// Burn address for OM tokens
const BURN_ADDRESS = 'mantra1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqcg2my8';

export const useBankStore = defineStore('bankstore', {
  state: () => {
    return {
      supply: {} as Coin,
      burnAddressBalance: {} as Coin,
      balances: {} as Record<string, Coin[]>,
      totalSupply: { supply: [] as Coin[] },
      ibcDenoms: {} as Record<string, DenomTrace>
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
      this.burnAddressBalance = {} as Coin;
      const denom =
        this.staking.params.bond_denom ||
        this.blockchain.current?.assets[0].base;
      if (denom) {
        // Fetch supply and burn address balance in parallel
        Promise.all([
          this.blockchain.rpc.getBankSupplyByDenom(denom),
          this.blockchain.rpc.getBankBalanceByDenom(BURN_ADDRESS, denom)
        ]).then(([supplyRes, burnBalanceRes]) => {
          if (supplyRes.amount) {
            // Store the original supply
            const originalSupply = {...supplyRes.amount};

            // Deduct burn address balance from total supply
            if (burnBalanceRes && burnBalanceRes.balance) {
              const burnAmount = BigInt(burnBalanceRes.balance.amount);
              const totalAmount = BigInt(originalSupply.amount);

              // Ensure burn amount doesn't exceed total supply
              const adjustedAmount = burnAmount > totalAmount ? 0n : totalAmount - burnAmount;
              this.supply = {
                denom: originalSupply.denom,
                amount: adjustedAmount.toString()
              };
              this.burnAddressBalance = burnBalanceRes.balance;
            } else {
              this.supply = originalSupply;
            }
          }
        }).catch(error => {
          console.error('Failed to fetch supply or burn address balance:', error);
          // Fallback to fetching just the supply
          this.blockchain.rpc.getBankSupplyByDenom(denom).then(supplyRes => {
            if (supplyRes.amount) {
              this.supply = supplyRes.amount;
            }
          });
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
          .denom_trace;
        this.ibcDenoms[hash] = trace;
      }
      return trace;
    },
  },
});
