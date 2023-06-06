import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

import { get } from '@/libs/http';
import type { StakingParam, StakingPool, Validator } from '@/types';
import { CosmosRestClient } from '@/libs/client';
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';
import { toHex, fromBase64 } from '@cosmjs/encoding';

export const useStakingStore = defineStore('stakingStore', {
  state: () => {
    return {
      validators: [] as Validator[],
      params: {} as {
        unbonding_time: string;
        max_validators: number;
        max_entries: number;
        historical_entries: number;
        bond_denom: string;
        min_commission_rate: string;
        min_self_delegation: string;
      },
      pool: {} as {
        bonded_tokens: string;
        not_bonded_tokens: string;
      },
    };
  },
  getters: {
    totalPower(): number {
      const sum = (s: number, e: Validator) => {
        return s + parseInt(e.delegator_shares);
      };
      return this.validators ? this.validators.reduce(sum, 0) : 0;
    },
    blockchain() {
      return useBlockchain();
    },
  },
  actions: {
    async init() {
      this.$reset();
      this.fetchPool();
      this.fetchAcitveValdiators();
      return await this.fetchParams();
    },
    async keybase(identity: string) {
      return get(
        `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`
      );
    },
    async fetchParams() {
      const response = await this.blockchain.rpc?.getStakingParams();
      if (response?.params) this.params = response.params;
      return this.params;
    },
    async fetchPool() {
      const response = await this.blockchain.rpc?.getStakingPool();
      if (response) {
        this.pool = response.pool;
      }
    },
    async fetchAcitveValdiators() {
      return this.fetchValidators('BOND_STATUS_BONDED');
    },
    async fetchInacitveValdiators() {
      return this.fetchValidators('BOND_STATUS_UNBONDED');
    },
    async fetchValidator(validatorAddr: string) {
      return this.blockchain.rpc.getStakingValidator(validatorAddr);
    },
    async fetchValidatorDelegation(
      validatorAddr: string,
      delegatorAddr: string
    ) {
      return await this.blockchain.rpc?.getStakingValidatorsDelegationsDelegator(
        validatorAddr,
        delegatorAddr
      );
    },
    async fetchValidators(status: string) {
      if(this.blockchain.isConsumerChain) {
        if(this.blockchain.current?.providerChain.api && this.blockchain.current.providerChain.api.length > 0) {
          const client = CosmosRestClient.newDefault(this.blockchain.current.providerChain.api[0].address)
          // const vals = await client.getBaseValidatorsetLatest(0) 
          const res = await client.getStakingValidators(status)
          const proVals = res.validators.sort(
            (a, b) => Number(b.delegator_shares) - Number(a.delegator_shares)
          )
          if (status === 'BOND_STATUS_BONDED') {
            this.validators = proVals;
          }
          return proVals
        }
      }
      return this.blockchain.rpc?.getStakingValidators(status).then((res) => {
        const vals = res.validators.sort(
          (a, b) => Number(b.delegator_shares) - Number(a.delegator_shares)
        );
        if (status === 'BOND_STATUS_BONDED') {
          this.validators = vals;
        }
        return vals;
      });
    },
  },
});


