import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import type { Delegation, Coin, UnbondingResponses, DelegatorRewards } from '@/types';
import { useStakingStore } from './useStakingStore';

export const useWalletStore = defineStore('walletStore', {
  state: () => {
    return {
      balances: [] as Coin[],
      delegations: [] as Delegation[],
      unbonding: [] as UnbondingResponses[],
      rewards: {} as DelegatorRewards,
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    connectedWallet() {
      const chainStore = useBlockchain()
      const key = chainStore.defaultHDPath

      const connected = JSON.parse(localStorage.getItem(key)||"{}")
      return connected
    },
    balanceOfStakingToken(): Coin {
      const stakingStore = useStakingStore()
      return this.balances.find( x => x.denom === stakingStore.params.bond_denom) || {amount: "0", denom: stakingStore.params.bond_denom}
    },
    stakingAmount() {
      let amt = 0
      let denom = ''
      this.delegations.forEach((i) => {
        amt += Number(i.balance.amount)
        denom = i.balance.denom
      })
      return {amount: String(amt), denom} 
    },
    rewardAmount() {

      const stakingStore = useStakingStore()
      const reward = this.rewards.total?.find(x => x.denom === stakingStore.params.bond_denom)
      return reward || {amount: "0", denom: stakingStore.params.bond_denom}
    },
    unbondingAmount() {
      let amt = 0
      let denom = ''
      this.unbonding.forEach((i) => {
        i.entries.forEach(e => {
          amt += Number(e.balance)
        })
      })

      const stakingStore = useStakingStore()
      return {amount: String(amt), denom: stakingStore.params.bond_denom} 
    },
    currentAddress() {
      if(this.connectedWallet.cosmosAddress) {
        const {prefix, data} = fromBech32(this.connectedWallet.cosmosAddress);
        const chainStore = useBlockchain()
        return toBech32(chainStore.current?.bech32Prefix || prefix, data)
      } else {
        return ""
      }
    }
  },
  actions: {
    async loadMyAsset() {
      if(!this.currentAddress) return 
      this.blockchain.rpc.getBankBalances(this.currentAddress).then(x => {
        this.balances = x.balances
      })
      this.blockchain.rpc.getStakingDelegations(this.currentAddress).then(x => {
        this.delegations = x.delegation_responses
      })
      this.blockchain.rpc.getStakingDelegatorUnbonding(this.currentAddress).then(x => {
        this.unbonding = x.unbonding_responses
      })
      this.blockchain.rpc.getDistributionDelegatorRewards(this.currentAddress).then(x => {
        this.rewards = x
      })
    },
    myBalance() {
      return this.blockchain.rpc.getBankBalances(this.currentAddress)
    },
    myDelegations() {
      return this.blockchain.rpc.getStakingDelegations(this.currentAddress)
    },
    myUnbonding() {
      return this.blockchain.rpc.getStakingDelegatorUnbonding(this.currentAddress)
    }
  },
});
