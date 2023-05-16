<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { fromHex, toBase64 } from '@cosmjs/encoding';
import { Icon } from '@iconify/vue';
import {
  useFormatter,
  useStakingStore,
  useBaseStore,
  useBlockchain,
useDashboard,
} from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import type { Block, Commit } from '@/types';
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';
import type { SigningInfo } from '@/types/slashing';
import { CosmosRestClient } from '@/libs/client';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const format = useFormatter();
const chainStore = useBlockchain();
const dashboard = useDashboard()
// storage local favorite validator ids
const local = ref(JSON.parse(localStorage.getItem('uptime-validators') || '{}') as Record<string, {name: string, address: string}[]>)
const signingInfo = ref({} as Record<string, SigningInfo[]>);
const selected = ref([] as string[])
const selectChain = ref(chainStore.chainName)
const validators = ref(stakingStore.validators)
const keyword = ref("")

if(local.value) Object.keys(local.value).map(chainName => {
  const chain = dashboard.chains[chainName]
  if(chain && chain.endpoints.rest) {
    const client = CosmosRestClient.newDefault(chain.endpoints.rest[0].address)
    client.getSlashingSigningInfos().then( resp => {
      signingInfo.value[chainName] = resp.info
    })
  }
  if(chainName === selectChain.value) {
    const vals = local.value[chainName]
    if(vals) {
      selected.value = vals.map(x => x.address)
    }
  }

  return chain
})

const filterValidators = computed(() => {
  if(keyword.value) {
    return validators.value.filter(x => x.description.moniker.indexOf(keyword.value) > -1)
  }
  return validators.value
})

const list = computed(() => {
  const list = [] as any[]
  if(local.value) Object.keys(local.value).map( chainName => {
    const vals = local.value[chainName]
    const info = signingInfo.value[chainName]
    if(vals && info) {
      vals.forEach(v => {
        const sigingInfo = info.find(x => valconsToBase64(x.address) === v.address)
        list.push( {
          chainName,
          v,
          sigingInfo,
        })
      })
    }
  })
  return list
})

function add() {
  const newList = [] as { name: string; address: string; }[]
  selected.value.forEach(x => {
    const validator = validators.value.find(v => (consensusPubkeyToHexAddress(v.consensus_pubkey) === x))
    if(validator) newList.push({
      name: validator.description.moniker || x,
      address: x
    })
  })
  if(!local.value) local.value = {}
  local.value[selectChain.value] = newList
  localStorage.setItem("uptime-validators", JSON.stringify(local.value))
}

function changeChain() {
  validators.value = []
  const endpoint = dashboard.chains[selectChain.value].endpoints.rest?.at(0)?.address
  if(!endpoint) return 

  const client = CosmosRestClient.newDefault(endpoint)
  client.getStakingValidators("BOND_STATUS_BONDED").then(x => {
    validators.value = x.validators
  })

  const vals = local.value[selectChain.value]
  if(vals) {
    selected.value = vals.map(x => x.address)
  } else {
    selected.value = []
  }
}

function color(v: string) {
  if(v) {
    const n = Number(v)
    if(n < 10) return " badge-success"
    if(n > 1000) return " badge-error"
    if(n > 0) return " badge-warning"
  }
}

</script>

<template>
  <div>
    <table class="table w-full">
      <thead>
        <tr>
          <th>Blockchain</th>
          <th>Validator</th>
          <th>Missing Blocks</th>
          <th>Signed Blocks</th>
          <th>Last Jailed Time</th>
          <th>Tombstoned</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in list">
          <td class=" capitalize">{{ v.chainName }}</td>
          <td>{{ v.v.name }}</td>
          <td><span class="badge " :class="color( v.sigingInfo?.missed_blocks_counter)">{{ v.sigingInfo?.missed_blocks_counter }}</span></td>
          <td><span v-if="v.sigingInfo">{{ Number(v.sigingInfo.index_offset) - Number(v.sigingInfo.start_height) }}</span></td>
          <td>
            <div v-if="v.sigingInfo && !v.sigingInfo?.jailed_until.startsWith('1970')" class="text-xs flex flex-col">
              <div class="badge">{{ format.toDay(v.sigingInfo.jailed_until, 'from') }}</div>
              <div>{{v.sigingInfo?.jailed_until }}</div>
            </div>
          </td>
          <td class=" capitalize">{{ v.sigingInfo?.tombstoned }}</td>
        </tr>
      </tbody>
    </table>
    
    <label for="add-validator" class="btn btn-primary mt-5">Add Validators</label>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="add-validator" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box relative">
        <label for="add-validator" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Add Validators</h3>
        <div class="py-4 max-h-60 overflow-y-auto">
          <div class="form-control my-5 border-2">
            <div class="input-group input-group-md">
            <select v-model="selectChain" class="select select-bordered capitalize" @change="changeChain">
              <option v-for="v in dashboard.chains" :value="v.chainName">
                {{ v.chainName }}
              </option>
            </select>
              <input v-model="keyword" type="text" class="input w-full" placeholder="keywords to filter validator">
            </div>
          </div>
          <table class="table table-compact w-full hover">
            <thead>
              <tr><th>Validator</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="v in filterValidators">
                <td><label :for="v.operator_address"><div class=" w-full">{{ v.description.moniker }}</div></label></td>
                <td><input :id="v.operator_address" v-model="selected" class="checkbox" type="checkbox" :value="consensusPubkeyToHexAddress(v.consensus_pubkey)"/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-action">
          <label for="add-validator" class="btn" @click="add">add</label>
        </div>
      </div>
    </div>
    <div class="h-6"></div>
  </div>
</template>

