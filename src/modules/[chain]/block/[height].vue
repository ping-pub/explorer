<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
import { Icon } from '@iconify/vue';
import TxsElement from '@/components/dynamic/TxsElement.vue';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed } from '@vue/reactivity';
import { onBeforeRouteUpdate } from 'vue-router';
import { useBaseStore, useFormatter } from '@/stores';
import type { Block } from '@/types';
import Countdown from '@/components/Countdown.vue';

const props = defineProps(['height', 'chain']);

const store = useBaseStore();
const format = useFormatter()
const current = ref({} as Block)

const height = computed(() => {
  return Number(current.value.block?.header?.height || props.height || 0);
});

const isFutureBlock = computed({
  get: () => {
    const latest = store.latest?.block?.header.height
    const isFuture = latest ? Number(props.height) > Number(latest): true
    if(!isFuture) store.fetchBlock(props.height).then(x => current.value = x)
    return isFuture
  },
  set: val => {
    console.log(val)
  }
})

const remainingBlocks = computed(() => {
  const latest = store.latest?.block?.header.height
  return latest ? Number(props.height) - Number(latest) : 0
})

const estimateTime = computed(() => {
  const seconds = remainingBlocks.value * Number((store.blocktime / 1000).toFixed()) * 1000
  return seconds
})

const estimateDate = computed(() => {
  return new Date(new Date().getTime() + estimateTime.value)
})

onBeforeRouteUpdate(async (to, from, next) => {
  if (from.path !== to.path) {
    store.fetchBlock(String(to.params.height)).then(x => current.value = x);
    next();
  }
});
</script>
<template>
  <div>
    <div v-if="isFutureBlock" class="text-center pt-28">
      <Countdown :time="estimateTime" css="text-5xl font-sans md:mx-5"/>
      <div class="my-5">Estimated Time: {{ format.toLocaleDate(estimateDate) }}</div>
      <div class="pt-10 flex justify-center">
        <table class="table table-compact rounded-lg">
          <tbody>
            <tr class="hover">
              <td>Countdown For Block:</td><td class="text-right"><span class=" ml-40">#{{ height }}</span></td>
            </tr>
            <tr class="hover">
              <td>Current Height:</td><td class="text-right">#{{ store.latest?.block?.header.height }}</td>
            </tr>
            <tr class="hover">
              <td>Remaining Blocks:</td><td class="text-right">{{ remainingBlocks }}</td>
            </tr>
            <tr class="hover">
              <td>Average Block Time:</td><td class="text-right">{{ (store.blocktime/1000).toFixed(1) }}s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title flex flex-row justify-between">
          <p class="">#{{ current.block?.header?.height }}</p>
          <div class="flex" v-if="props.height">
            <RouterLink :to="`/${store.blockchain.chainName}/block/${height - 1}`"
              class="btn btn-primary btn-sm p-1 text-2xl mr-2">
              <Icon icon="mdi-arrow-left" class="w-full h-full" />
            </RouterLink>
            <RouterLink :to="`/${store.blockchain.chainName}/block/${height + 1}`"
              class="btn btn-primary btn-sm p-1 text-2xl">
              <Icon icon="mdi-arrow-right" class="w-full h-full" />
            </RouterLink>
          </div>
        </h2>
        <div>
          <DynamicComponent :value="current.block_id" />
        </div>
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title flex flex-row justify-between">Block Header</h2>
        <DynamicComponent :value="current.block?.header" />
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title flex flex-row justify-between">Transactions</h2>
        <TxsElement :value="current.block?.data?.txs" />
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
        <h2 class="card-title flex flex-row justify-between">Last Commit</h2>
        <DynamicComponent :value="current.block?.last_commit" />
      </div>
    </div>
  </div>
</template>
