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
const target = ref(Number(props.height || 0))

const height = computed(() => {
  return Number(current.value.block?.header?.height || props.height || 0);
});

const isFutureBlock = computed({
  get: () => {
    const latest = store.latest?.block?.header.height
    const isFuture = latest ? target.value > Number(latest) : true
    if (!isFuture && !current.value.block_id) store.fetchBlock(target.value).then(x => current.value = x)
    return isFuture
  },
  set: val => {
    console.log(val)
  }
})

const remainingBlocks = computed(() => {
  const latest = store.latest?.block?.header.height
  return latest ? Number(target.value) - Number(latest) : 0
})

const estimateTime = computed(() => {
  const seconds = remainingBlocks.value * Number((store.blocktime / 1000).toFixed()) * 1000
  return seconds
})

const estimateDate = computed(() => {
  return new Date(new Date().getTime() + estimateTime.value)
})

const edit = ref(false)
const newHeight = ref(props.height)
function updateTarget() {
  target.value = Number(newHeight.value)
  console.log(target.value)
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (from.path !== to.path) {
    store.fetchBlock(String(to.params.height)).then(x => current.value = x);
    next();
  }
});
</script>
<template>
  <div>
    <div v-if="isFutureBlock" class="text-center">
      <div v-if="remainingBlocks > 0">
        <div class="text-primary font-bold text-lg my-10">#{{ target }}</div>
        <Countdown :time="estimateTime" css="md:!text-5xl font-sans md:mx-5" />
        <div class="my-5">{{ $t('block.estimated_time') }}: <span class="text-xl font-bold">{{ format.toLocaleDate(estimateDate) }}</span>
        </div>
        <div class="pt-10 flex justify-center">
          <table class="table w-max rounded-lg bg-base-100">
            <tbody>
              <tr class="hover cursor-pointer" @click="edit = !edit">
                <td>{{ $t('block.countdown_for_block') }}:</td>
                <td class="text-right"><span class="md:!ml-40">{{ target }}</span></td>
              </tr>
              <tr v-if="edit">
                <td colspan="2" class="text-center">
                  <h3 class="text-lg font-bold">{{ $t('block.countdown_for_block_input') }}</h3>
                  <p class="py-4">
                  <div class="join">
                    <input class="input input-bordered join-item" v-model="newHeight" type="number" />
                    <button class="btn btn-primary join-item" @click="updateTarget()">{{ $t('block.btn_update') }}</button>
                  </div>
                  </p>
                </td>
              </tr>
              <tr>
                <td>{{ $t('block.current_height') }}:</td>
                <td class="text-right">#{{ store.latest?.block?.header.height }}</td>
              </tr>
              <tr>
                <td>{{ $t('block.remaining_blocks') }}:</td>
                <td class="text-right">{{ remainingBlocks }}</td>
              </tr>
              <tr>
                <td>{{ $t('block.average_block_time') }}:</td>
                <td class="text-right">{{ (store.blocktime / 1000).toFixed(1) }}s</td>
              </tr>
            </tbody>
          </table>
        </div>

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
        <h2 class="card-title flex flex-row justify-between">{{ $t('block.block_header') }}</h2>
        <DynamicComponent :value="current.block?.header" />
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title flex flex-row justify-between">{{ $t('account.transactions') }}</h2>
        <TxsElement :value="current.block?.data?.txs" />
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
        <h2 class="card-title flex flex-row justify-between">{{ $t('block.last_commit') }}</h2>
        <DynamicComponent :value="current.block?.last_commit" />
      </div>
  </div>
</div></template>
