import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import { fromBech32, toBech32 } from '@cosmjs/encoding';

export const useWalletStore = defineStore('walletStore', {
  state: () => {
    return {};
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    connectedWallet() {
      const chainStore = useBlockchain();
      const key = chainStore.defaultHDPath;

      const connected = JSON.parse(localStorage.getItem(key) || '{}');
      return connected;
    },
    currentAddress() {
      if (!this.connectedWallet?.cosmosAddress) return '';
      const { prefix, data } = fromBech32(this.connectedWallet.cosmosAddress);
      const chainStore = useBlockchain();
      return toBech32(chainStore.current?.bech32Prefix || prefix, data);
    },
  },
  actions: {
    myBalance() {
      return this.blockchain.rpc.getBankBalances(this.currentAddress);
    },
    myDelegations() {
      return this.blockchain.rpc.getStakingDelegations(this.currentAddress);
    },
    myUnbonding() {
      return this.blockchain.rpc.getStakingDelegatorUnbonding(
        this.currentAddress
      );
    },
  },
});
