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

function loadSigningInfo(chainName: string) {
  const chain = dashboard.chains[chainName]
  if(chain && chain.endpoints.rest) {
    const client = CosmosRestClient.newDefault(chain.endpoints.rest[0].address)
    client.getSlashingSigningInfos().then( resp => {
      signingInfo.value[chainName] = resp.info
    })
  }
}
if(local.value) Object.keys(local.value).map(chainName => {
  loadSigningInfo(chainName)
})

function initial() {
  const vals = local.value[selectChain.value]
  if(vals) {
    selected.value = vals.map(x => x.address)
  }
}

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
  if(!signingInfo.value[selectChain.value]) {
    loadSigningInfo(selectChain.value)
  }
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
    <div class="overflow-x-auto w-full">
      <div class="lg:!flex lg:!items-center lg:!justify-between bg-base-100 p-5">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 sm:!truncate sm:!text-3xl sm:!tracking-tight">{{ $t('uptime.my_validators') }}</h2>
          <div class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                  clip-rule="evenodd" />
                <path
                  d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
              </svg>
              {{ $t('uptime.add_validators_monitor') }}
            </div>
          </div>
        </div>
        <div class="mt-5 flex lg:!ml-4 lg:!mt-0">
          
        </div>
      </div>
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>{{ $t('uptime.no') }}</th>
            <th>Blockchain</th>
            <th>{{ $t('account.validator') }}</th>
            <th>{{ $t('uptime.signed_blocks') }}</th>
            <th>{{ $t('uptime.last_jailed_time') }}</th>
            <th>{{ $t('uptime.tombstoned') }}</th>
            <th>{{ $t('uptime.missing_blocks') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, i) in list" class="hover">
            <td>{{ i+1 }}</td>
            <td class=" capitalize">{{ v.chainName }}</td>
            <td>{{ v.v.name }}</td>
            <td><span v-if="v.sigingInfo">{{ Number(v.sigingInfo.index_offset) - Number(v.sigingInfo.start_height) }}</span></td>
            <td>
              <div v-if="v.sigingInfo && !v.sigingInfo?.jailed_until.startsWith('1970')" class="text-xs flex flex-wrap">
                <div class="mt-1">{{ format.toLocaleDate(v.sigingInfo?.jailed_until) }}</div>
                <div class="badge">{{ format.toDay(v.sigingInfo.jailed_until, 'from') }}</div>
              </div>
            </td>
            <td class=" capitalize">{{ v.sigingInfo?.tombstoned }}</td>
            <td><span v-if="v.sigingInfo" class="badge " :class="color( v.sigingInfo?.missed_blocks_counter)">{{ v.sigingInfo?.missed_blocks_counter }}</span></td>
            <td class=""><RouterLink :to="`/${v.chainName}/uptime/#blocks`" class="btn btn-xs btn-primary">{{ $t('module.blocks') }}</RouterLink></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="text-center">
      <label for="add-validator" class="btn btn-primary mt-5">{{ $t('uptime.add_validators') }}</label>
    </div>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="add-validator" class="modal-toggle" @change="initial" />
    <div class="modal">
      <div class="modal-box relative">
        <label for="add-validator" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">{{ $t('uptime.add_validators') }}</h3>
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
        <div class="py-4 max-h-60 overflow-y-auto">
          
          <table class="table table-compact w-full hover">
            <thead>
              <tr><th>{{ $t('account.validator') }}</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in filterValidators">
                <td><label :for="v.operator_address"><div class=" w-full">{{ i+1 }}. {{ v.description.moniker }}</div></label></td>
                <td><input :id="v.operator_address" v-model="selected" class="checkbox" type="checkbox" :value="consensusPubkeyToHexAddress(v.consensus_pubkey)"/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-action">
          <label class="btn btn-primary" @click="add">{{ $t('uptime.add') }}</label>
        </div>
      </div>
    </div>
    <div class="h-6"></div>
  </div>
</template>

