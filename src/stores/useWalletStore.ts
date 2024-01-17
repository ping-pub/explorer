import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import type {
  Delegation,
  UnbondingResponses,
  DelegatorRewards,
  WalletConnected,
} from '@/types';
import { useStakingStore } from './useStakingStore';
import router from '@/router';
import type {
  DelegationResponse,
  UnbondingDelegation,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import type {
  QueryDelegationTotalRewardsRequest,
  QueryDelegationTotalRewardsResponse,
} from 'cosmjs-types/cosmos/distribution/v1beta1/query';

export const useWalletStore = defineStore('walletStore', {
  state: () => {
    return {
      balances: [] as Coin[],
      delegations: [] as DelegationResponse[],
      unbonding: [] as UnbondingDelegation[],
      rewards: {} as QueryDelegationTotalRewardsResponse,
      wallet: {} as WalletConnected,
    };
  },
  getters: {
    blockchain() {
      return useBlockchain();
    },
    connectedWallet() {
      // @ts-ignore
      if (this.wallet.cosmosAddress) return this.wallet;
      const chainStore = useBlockchain();
      const key = chainStore.defaultHDPath;
      const connected = JSON.parse(localStorage.getItem(key) || '{}');
      return connected;
    },
    balanceOfStakingToken(): Coin {
      const stakingStore = useStakingStore();
      return (
        this.balances.find(
          (x) => x.denom === stakingStore.params.bondDenom
        ) || { amount: '0', denom: stakingStore.params.bondDenom }
      );
    },
    stakingAmount() {
      const stakingStore = useStakingStore();
      let amt = 0;
      let denom = stakingStore.params.bondDenom;
      this.delegations.forEach((i) => {
        amt += Number(i.balance.amount);
        denom = i.balance.denom;
      });
      return { amount: String(amt), denom };
    },
    rewardAmount() {
      const stakingStore = useStakingStore();
      // @ts-ignore
      const reward = this.rewards.total?.find(
        (x: Coin) => x.denom === stakingStore.params.bondDenom
      );
      return reward || { amount: '0', denom: stakingStore.params.bondDenom };
    },
    unbondingAmount() {
      let amt = 0;
      this.unbonding?.forEach((i) => {
        i.entries.forEach((e) => {
          amt += Number(e.balance);
        });
      });

      const stakingStore = useStakingStore();
      return { amount: String(amt), denom: stakingStore.params.bondDenom };
    },
    currentAddress() {
      if (!this.connectedWallet?.cosmosAddress) return '';
      const { prefix, data } = fromBech32(this.connectedWallet.cosmosAddress);
      const chainStore = useBlockchain();
      return toBech32(chainStore.current?.bech32Prefix || prefix, data);
    },
    shortAddress() {
      const address: string = this.currentAddress;
      if (address.length > 4) {
        return `${address.substring(address.length - 4)}`;
      }
      return '';
    },
  },
  actions: {
    async loadMyAsset() {
      if (!this.currentAddress) return;
      this.blockchain.rpc.getBankBalances(this.currentAddress).then((x) => {
        this.balances = x;
      });
      this.blockchain.rpc
        .getStakingDelegations(this.currentAddress)
        .then((x) => {
          this.delegations = x.delegationResponses;
        });
      this.blockchain.rpc
        .getStakingDelegatorUnbonding(this.currentAddress)
        .then((x) => {
          this.unbonding = x.unbondingResponses;
        });
      this.blockchain.rpc
        .getDistributionDelegatorRewards(this.currentAddress)
        .then((x) => {
          this.rewards = x;
        });
    },
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
    disconnect() {
      const chainStore = useBlockchain();
      const key = chainStore.defaultHDPath;
      localStorage.removeItem(key);
      this.$reset();
    },
    setConnectedWallet(value: WalletConnected) {
      if (value) this.wallet = value;
    },
    suggestChain() {
      // const router = useRouter()
      router.push({ path: '/wallet/keplr' });
    },
  },
});
