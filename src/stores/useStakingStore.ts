import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';

import { get } from '@/libs/http';
import type { StakingParam, StakingPool, Validator } from '@/types';
import { CosmosRestClient } from '@/libs/client';
import { consensusPubkeyToHexAddress, pubKeyToValcons, valconsToBase64 } from '@/libs';
import { toHex, fromBase64, toBase64, fromHex, fromBech32 } from '@cosmjs/encoding';
import { useBaseStore } from './useBaseStore';

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
      keyRotation: {} as Record<string, string>,
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
      return this.fetchValidators('BOND_STATUS_BONDED', 500);
    },
    async fetchInacitveValdiators() {
      return this.fetchValidators('BOND_STATUS_UNBONDED');
    },    
    async fetchUnbondingValdiators() {
      return this.fetchValidators('BOND_STATUS_UNBONDING');
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
    async fetchKeyRotation(chain_id: string, validatorAddr: string ) : Promise<string> {
      if(this.blockchain.isConsumerChain) {
        if(this.blockchain.current?.providerChain.api && this.blockchain.current.providerChain.api.length > 0) {
          const signatures = useBaseStore().latest?.block?.last_commit.signatures
          if(signatures) {
            // console.log(signatures)
            const key = toBase64(fromHex(valconsToBase64(validatorAddr)))
            const exists = signatures.findIndex((x) => x.validator_address === key)
            if(exists < 0) {

              const client = CosmosRestClient.newDefault(this.blockchain.current.providerChain.api[0].address)
              const res = await client.getInterchainSecurityValidatorRotatedKey(chain_id, validatorAddr);
              if(res.consumer_address) {
                this.keyRotation[validatorAddr] = res.consumer_address
                localStorage.setItem(`key-rotation-${chain_id}`, JSON.stringify(this.keyRotation))
              }
              return res.consumer_address
            }
          }
        }
      }
      return ""
    },

    async loadKeyRotationFromLocalstorage(chain_id: string) {
      const keyRotation = localStorage.getItem(`key-rotation-${chain_id}`)
      this.keyRotation = keyRotation ? JSON.parse(keyRotation) : {}
    },

    findRotatedHexAddress(key: {
      "@type": string;
      key: string;
    }) {

      const prefix  = "cosmos"
      const conskey = pubKeyToValcons(key, prefix)
      const rotated = this.keyRotation[conskey]
      if(rotated) {
        return valconsToBase64(rotated)
      }
      return consensusPubkeyToHexAddress(key)

    },
    async fetchAllKeyRotation(chain_id: string) {
      for(const val of this.validators) {
        const { prefix } = fromBech32(val.operator_address)
        console.log(val, prefix)
        await this.fetchKeyRotation(chain_id, pubKeyToValcons(val.consensus_pubkey, prefix.replace('valoper','valcons')))
      }
    },
    async fetchValidators(status: string, limit = 300) {
      if(this.blockchain.isConsumerChain) {
        if(this.blockchain.current?.providerChain.api && this.blockchain.current.providerChain.api.length > 0) {
          const client = CosmosRestClient.newDefault(this.blockchain.current.providerChain.api[0].address)
          // provider validators
          const res = await client.getStakingValidators(status, limit)
          const proVals = res.validators.sort(
            (a, b) => Number(b.delegator_shares) - Number(a.delegator_shares)
          )
          if (status === 'BOND_STATUS_BONDED') {
            this.validators = proVals;
          }

          return proVals
        }
      }
      return this.blockchain.rpc?.getStakingValidators(status, limit).then((res) => {
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


