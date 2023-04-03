<script lang=ts setup>
import { useBaseStore, useFormatter, useStakingStore } from '@/stores';
import { toBase64, toHex } from '@cosmjs/encoding';
import { pubkeyToAddress } from '@cosmjs/tendermint-rpc';
import type { ValidatorSDKType } from '@ping-pub/codegen/src/cosmos/staking/v1beta1/staking';
import { computed } from '@vue/reactivity';
import { onMounted, ref, type DebuggerEvent } from 'vue';
import { consensusPubkeyToHexAddress } from '@/libs'
const staking = useStakingStore()
const format = useFormatter()

const cache = JSON.parse(localStorage.getItem('avatars')||'{}')
const avatars = ref( cache || {} )
const latest = ref({} as Record<string, number>)
const yesterday = ref({} as Record<string, number>)
const tab = ref('active')
const unbondList = ref([] as ValidatorSDKType[])
const base = useBaseStore()
onMounted(()=> {
  fetchChange(0)
  staking.fetchInacitveValdiators().then(x => {
    unbondList.value = x 
  })
})

function fetchChange(offset: number) {
  const base = useBaseStore()
  const diff = 86400000 / base.blocktime
  base.fetchAbciInfo().then(h => {
    // console.log('block:', h)
    base.fetchValidatorByHeight(h.lastBlockHeight, offset).then(x => {
      x.validators.forEach(v => {
        if(v.pubkey) latest.value[pubkeyToAddress(v.pubkey.algorithm, v.pubkey.data)] = Number(v.votingPower)
      })         
    })
    const height = Number(h.lastBlockHeight) - diff
    base.fetchValidatorByHeight(height > 0 ? height : 1, offset).then(old => {
      old.validators.forEach(v => {
        if(v.pubkey) yesterday.value[pubkeyToAddress(v.pubkey.algorithm, v.pubkey.data)] = Number(v.votingPower)
      })
      // console.log(Object.keys(yesterday.value).map(x => x.toUpperCase()))
    })
  })
}

const change24 = (key: {typeUrl: string, value: Uint8Array}) => {
  // console.log('hex key:', consensusPubkeyToHexAddress(key))
  const txt = toBase64(key.value)
  const n : number = latest.value[txt];
  const o : number = yesterday.value[txt]
  // console.log( txt, n, o)
  return n >0 && o > 0 ? n - o : 0
}

const change24Text = (key?: {typeUrl: string, value: Uint8Array}) => {
  if(!key) return ''
  const v = change24(key)
  return v!==0 ? format.numberAndSign(v) : ''
}

const change24Color = (key?: {typeUrl: string, value: Uint8Array}) => {
  if(!key) return ''
  const v = change24(key)
  if(v > 0) return 'text-success'
  if(v < 0) return 'text-error'
}

const update = (m: DebuggerEvent) => {
    if(m.key === 'validators') {
        loadAvatars()
    }
}

const list = computed(() => {
  // return tab.value === 'active' ? staking.validators: unbondList.value
  return staking.validators
})

const loadAvatars = () => {
    // fetch avatar from keybase
    let promise = Promise.resolve()
    staking.validators.forEach(item => {
        promise = promise.then(() => new Promise(resolve => {
        const identity = item.description?.identity
        if(identity && !avatars.value[identity]){
            staking.keybase(identity).then(d => {
                if (Array.isArray(d.them) && d.them.length > 0) {
                    const uri = String(d.them[0]?.pictures?.primary?.url).replace("https://s3.amazonaws.com/keybase_processed_uploads/", "")
                    if(uri) {
                      avatars.value[identity] = uri
                      localStorage.setItem('avatars', JSON.stringify(avatars.value))
                    }
                }
                resolve()
            })
        }else{
            resolve()
        }
        }))
    })
}

staking.$subscribe((m, s)=> {
    if (Array.isArray(m.events)) {
        m.events.forEach(x => {
            update(x)
        })
    } else {
        update(m.events)
    }
})
const logo = (identity?: string) => {
    if(!identity) return ''
    const url = avatars.value[identity] || ''
    return url.startsWith('http')? url: `https://s3.amazonaws.com/keybase_processed_uploads/${url}`
}
const rank = function(position: number) {
    let sum = 0
    for(let i = 0;i < position; i++) {
      sum += Number(staking.validators[i]?.delegatorShares)
    }
    const percent = (sum / staking.totalPower)

    switch (true) {
        case tab.value ==='active' && percent < 0.33: return 'error'
        case tab.value ==='active' && percent < 0.67: return 'warning'
        default: return 'primary'
    }    
}
</script>
<template>
    <div>
        <VCard>
            <VCardTitle class="d-flex justify-space-between">
                <VBtnToggle v-model="tab" size="small" color="primary">
                    <VBtn value="active" variant="outlined" >Active</VBtn>
                    <VBtn value="inactive" variant="outlined">Inactive</VBtn>
                </VBtnToggle>
                <span class="mt-2">{{ list.length }}/{{ staking.params.maxValidators }}</span>
            </VCardTitle>
        <VTable class="text-no-wrap table-header-bg rounded-0">
            <thead>
          <tr>
            <th
              scope="col"
              style="width: 3rem;"
            >#</th>
            <th scope="col">
              VALIDATOR
            </th>
            <th scope="col" class="text-right">
              VOTING POWER
            </th>
            <th scope="col" class="text-right">
              24h CHANGES
            </th>
            <th scope="col" class="text-right">
              COMMISSION
            </th>
            <th scope="col">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
            <tr
            v-for="(v, i) in list"
            :key="v.operatorAddress"
          >
            <!-- 👉 rank -->
            <td>
              <VChip label :color="rank(i)">
                {{ i + 1 }}
              </VChip>
            </td>

            <!-- 👉 Validator -->
            <td>
              <div class="d-flex align-center overflow-hidden" style="max-width: 400px;">
                <VAvatar
                  variant="tonal"
                  class="me-3"
                  size="34"
                  icon="mdi-help-circle-outline"
                  :image="logo(v.description?.identity)"
                />
                <div class="d-flex flex-column">
                  <h6 class="text-sm">
                    <RouterLink
                      :to="{name: 'chain-staking-validator', params: {validator: v.operatorAddress}}"
                      class="font-weight-medium user-list-name"
                    >
                      {{ v.description?.moniker }}
                    </RouterLink>

                  </h6>
                  <span class="text-xs">{{ v.description?.website || v.description?.identity || '-' }}</span>
                </div>
              </div>
            </td>

            <!-- 👉 Voting Power -->
            <td class="text-right">
                <div class="d-flex flex-column">
                  <h6 class="text-sm font-weight-medium">
                    {{ format.formatToken( {amount: parseInt(v.tokens).toString(), denom: staking.params.bondDenom }, true, "0,0") }}
                  </h6>
                  <span class="text-xs">{{ format.calculatePercent(v.delegatorShares, staking.totalPower) }}</span>
                </div>
            </td>
            <!-- 👉 24h Changes -->
            <td class="text-right text-xs" :class="change24Color(v.consensusPubkey)">
              {{ change24Text(v.consensusPubkey) }} <VChip label v-if="v.jailed" color="error">Jailed</VChip>
            </td>
            <!-- 👉 commission -->
            <td  class="text-right">
              {{ format.formatCommissionRate(v.commission?.commissionRates?.rate) }}
            </td>
            <!-- 👉 Action -->
            <td>
              {{ 2 }}
            </td>
            </tr>
        </tbody>
        </VTable>
        <VDivider/>
        <VCardActions class="py-2">
            <VChip label color="error">Top 33%</VChip> <VChip label color="warning" class="mx-2">Top 67%</VChip>
        </VCardActions>
        </VCard>
    </div>
</template>