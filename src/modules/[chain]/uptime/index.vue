<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {fromBase64, fromBech32, fromHex, toBase64, toBech32, toHex} from '@cosmjs/encoding'
import { useFormatter, useStakingStore, useBaseStore, useBlockchain } from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import type { Commit } from '@/types'
import { consensusPubkeyToHexAddress, valconsToBase64 } from "@/libs";

const stakingStore = useStakingStore();
const baseStore = useBaseStore();
const chainStore = useBlockchain()
const format = useFormatter();
const latest = ref({})
const commits = ref([] as Commit[]);
const keyword = ref("")

const signingInfo = ref({})

const validators = computed(()=> {
  if(keyword) return stakingStore.validators.filter(x => x.description.moniker.indexOf(keyword.value) > -1)
  return stakingStore.validators
})

onMounted(() => {
  baseStore.fetchLatest().then(block => {
    latest.value = block
    commits.value.unshift(block.block.last_commit)
    const height = Number(block.block.header?.height|| 0)
    if(height > 0) {
      // constructs sequence for loading blocks
      let promise = Promise.resolve()
      for (let i = height - 1; i > height - 50; i -= 1) {
        if (i > height - 48 && i > 0) {
          promise = promise.then(() => new Promise(resolve => {
            baseStore.fetchBlock(i).then((x) => {
              commits.value.unshift(x.block.last_commit)
              resolve()
            })
          }))
        }
      }
    }
  });

  chainStore.rpc.getSlashingSigningInfos().then((x)=> {
    x.info?.forEach(i => {
      signingInfo.value[valconsToBase64(i.address)] = i
    })
  })
})

</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="4">Current Height: {{latest.block?.header?.height}} </VCol>
      <VCol cols="12" md="8"><VTextField v-model="keyword" label="Keywords to filter validators" /></VCol>
    </VRow>
    <VRow>
      <VCol v-for="(v, i) in validators" cols="12" md="3" xl="2">
        <div class="d-flex justify-between">
          <span class="text-truncate">{{i + 1}}. {{v.description.moniker}}</span> 
          <VChip v-if="Number(signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]?.missed_blocks_counter || 0) > 0" size="small" class="mb-1" label color="error">{{ signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]?.missed_blocks_counter }}</VChip>
          <VChip v-else size="small" class="mb-1" label color="success">{{ signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]?.missed_blocks_counter }}</VChip>
        </div>
        <UptimeBar :blocks="commits" :validator="toBase64(fromHex(consensusPubkeyToHexAddress(v.consensus_pubkey)))" />
      </VCol>
    </VRow>
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'uptime'
    }
  }
</route>
