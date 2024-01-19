import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

import { get } from '@/libs/http';
import type { StakingParam, StakingPool } from '@/types';
import { CosmosRestClient } from '@/libs/client';
import {
  consensusPubkeyToHexAddress,
  pubKeyToValcons,
  valconsToBase64,
} from '@/libs';
import {
  toHex,
  fromBase64,
  toBase64,
  fromHex,
  fromBech32,
} from '@cosmjs/encoding';
import { useBaseStore } from './useBaseStore';
import type { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import type { Duration } from 'cosmjs-types/google/protobuf/duration';
import type {
  Pool,
  Validator,
  Params,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import type { Any } from 'cosmjs-types/google/protobuf/any';
import type { JsonObject } from '@cosmjs/cosmwasm-stargate';

export const useStakingStore = defineStore('stakingStore', {
  state: () => {
    return {
      validators: [] as Validator[],
      params: {} as Params,
      pool: {} as Pool,
      keyRotation: {} as Record<string, string>,
      identities: {} as Record<string, JsonObject>,
    };
  },
  getters: {
    totalPower(): number {
      const sum = (s: number, e: Validator) => {
        return s + parseInt(e.delegatorShares);
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
      if (!this.identities[identity]) {
        this.identities[identity] = await get(
          `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`
        );
      }
      return this.identities[identity];
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
      return await this.fetchValidators('BOND_STATUS_BONDED');
    },
    async fetchInacitveValdiators() {
      return await this.fetchValidators('BOND_STATUS_UNBONDED');
    },
    async fetchUnbondingValdiators() {
      return await this.fetchValidators('BOND_STATUS_UNBONDING');
    },
    async fetchValidator(validatorAddr: string) {
      return await this.blockchain.rpc.getStakingValidator(validatorAddr);
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
    async fetchKeyRotation(
      chain_id: string,
      validatorAddr: string
    ): Promise<string> {
      if (this.blockchain.isConsumerChain) {
        if (
          this.blockchain.current?.providerChain.api &&
          this.blockchain.current.providerChain.api.length > 0
        ) {
          const signatures =
            useBaseStore().latest?.block?.lastCommit?.signatures;
          if (signatures) {
            // console.log(signatures)
            const key = toBase64(fromHex(valconsToBase64(validatorAddr)));
            const exists = signatures.findIndex(
              (x) => x.validatorAddress && toBase64(x.validatorAddress) === key
            );
            if (exists < 0) {
              const client = CosmosRestClient.newDefault(
                this.blockchain.current.providerChain.api[0].address
              );
              const res = await client.getInterchainSecurityValidatorRotatedKey(
                chain_id,
                validatorAddr
              );
              if (res.consumerAddress) {
                this.keyRotation[validatorAddr] = res.consumerAddress;
                localStorage.setItem(
                  `key-rotation-${chain_id}`,
                  JSON.stringify(this.keyRotation)
                );
              }
              return res.consumerAddress;
            }
          }
        }
      }
      return '';
    },

    async loadKeyRotationFromLocalstorage(chain_id: string) {
      const keyRotation = localStorage.getItem(`key-rotation-${chain_id}`);
      this.keyRotation = keyRotation ? JSON.parse(keyRotation) : {};
    },

    findRotatedHexAddress(key: Any) {
      const prefix = 'cosmos';
      const conskey = pubKeyToValcons(key, prefix);
      const rotated = this.keyRotation[conskey];
      if (rotated) {
        return valconsToBase64(rotated);
      }
      return consensusPubkeyToHexAddress(key);
    },
    async fetchAllKeyRotation(chain_id: string) {
      for (const val of this.validators) {
        const { prefix } = fromBech32(val.operatorAddress);
        await this.fetchKeyRotation(
          chain_id,
          pubKeyToValcons(val.consensusPubkey!, prefix.replace('valoper', ''))
        );
      }
    },
    async fetchValidators(status: BondStatusString) {
      if (this.blockchain.isConsumerChain) {
        if (
          this.blockchain.current?.providerChain.api &&
          this.blockchain.current.providerChain.api.length > 0
        ) {
          const client = CosmosRestClient.newDefault(
            this.blockchain.current.providerChain.api[0].address
          );
          // provider validators
          const validatorsRes = await client.getStakingValidators(status);
          const proVals = validatorsRes.validators.sort(
            (a, b) => Number(b.delegatorShares) - Number(a.delegatorShares)
          );
          if (status === 'BOND_STATUS_BONDED') {
            this.validators = proVals;
          }

          return proVals;
        }
      }
      const validatorsRes = await this.blockchain.rpc?.getStakingValidators(
        status
      );
      const vals = validatorsRes.validators.sort(
        (a, b) => Number(b.delegatorShares) - Number(a.delegatorShares)
      );
      if (status === 'BOND_STATUS_BONDED') {
        this.validators = vals;
      }
      return vals;
    },
  },
});
