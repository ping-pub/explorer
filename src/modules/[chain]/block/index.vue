<script lang="ts" setup>
import Countdown from '@/components/Countdown.vue';
import { useBaseStore, useFormatter } from '@/stores';
import { toBase64 } from '@cosmjs/encoding';
import type { BlockResponse } from '@cosmjs/tendermint-rpc';
import { computed, ref } from '@vue/reactivity';
import { watchEffect } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
const props = defineProps(['chain']);

const base = useBaseStore();
const format = useFormatter();
const tab = ref('blocks');
const lastHeight = ref(Number(base.latest?.block?.header.height || 0) + 10000)
const target = ref(Number(lastHeight.value || 0))
const current = ref({} as BlockResponse)

const list = computed(() => {
  const recents = base.recents;
  console.log('first', recents)
  return recents.sort(
    (a, b) => Number(b.block.header.height) - Number(a.block.header.height)
  );

});

watchEffect(() => {
  if (base.latest?.block?.header.height && lastHeight.value === 10000) {
    lastHeight.value = Number(base.latest?.block?.header.height || 0) + 10000
    target.value = Number(lastHeight.value || 0)
  }
});

const remainingBlocks = computed(() => {
  const latest = base.latest?.block?.header.height
  return latest ? Number(target.value) - Number(latest) : 0
})

const estimateTime = computed(() => {
  const seconds = remainingBlocks.value * Number((base.blocktime / 1000).toFixed()) * 1000
  return seconds
})

const estimateDate = computed(() => {
  return new Date(new Date().getTime() + estimateTime.value)
})

const edit = ref(false)
const newHeight = ref(lastHeight.value)
function updateTarget() {
  target.value = Number(newHeight.value)
  console.log(target.value)
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (from.path !== to.path) {
    base.fetchBlock(String(to.params.height)).then(x => {
      current.value = x;
    });
    next();
  }
});

</script>
<template>
  <div class="m-4 md:m-6 border border-base-400 bg-base-500 rounded-2xl">
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'blocks' }" @click="tab = 'blocks'">{{
        $t('block.recent') }}</a>
      <!-- <RouterLink class="tab text-gray-400 uppercase" :to="`/${chain}/block/${Number(base.latest?.block?.header.height || 0) + 10000
        }`">{{ $t('block.future') }}</RouterLink> -->
      <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'future' }" @click="tab = 'future'">{{
        $t('block.future') }}</a>
      <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'transactions' }"
        @click="tab = 'transactions'">{{ $t('account.transactions') }}</a>
    </div>

    <div v-show="tab === 'blocks'" class="grid xl:!grid-cols-6 md:!grid-cols-4 grid-cols-1 gap-3">
      <!-- <RouterLink v-for="item in list" class="flex flex-col justify-between rounded p-4 shadow bg-base-100"
        :to="`/${chain}/block/${item.block.header.height}`">
        <div class="flex justify-between">
          <h3 class="text-md font-bold sm:!text-lg">
            {{ item.block.header.height }}
          </h3>
          <span class="rounded text-xs whitespace-nowrap font-medium text-green-600">
            {{ format.toDay(item.block?.header?.time.toString(), 'from') }}
          </span>
        </div>
        <div class="flex justify-between tooltip" data-tip="Block Proposor">
          <div class="mt-2 hidden text-sm sm:!block truncate">
            <span>{{
              format.validator(
                item.block?.header?.proposerAddress &&
                toBase64(item.block?.header?.proposerAddress)
              )
            }}</span>
          </div>
          <span class="text-right mt-1 whitespace-nowrap">
            {{ item.block?.txs.length }} txs
          </span>
        </div>
      </RouterLink> -->
      
    </div>

    <div v-show="tab === 'future'" class="bg-base-100 rounded overflow-x-auto">
      <div class="text-center">
        <div v-if="remainingBlocks > 0">
          <div class="text-white font-bold text-lg my-10">#{{ target }}</div>
          <Countdown :time="estimateTime" css="md:mx-3 mx-2" />
          <div class="my-5 text-[#B4B7BB] font-normal text-[14px]">{{ $t('block.estimated_time') }}: <span
              class="text-xl font-normal">{{ format.toLocaleDate(estimateDate) }}</span>
          </div>
          <div class="pt-10 flex justify-center">
            <div class=" box-content !p-6 rounded-2xl !bg-base">
              <table class="table w-max rounded-2xl">
                <tbody>
                  <tr class="hover hover:brightness-150 rounded cursor-pointer !border-base-300" @click="edit = !edit">
                    <td>{{ $t('block.countdown_for_block') }}:</td>
                    <td class="text-right"><span class="md:!ml-40">{{ target }}</span></td>
                  </tr>
                  <tr v-if="edit" class="!border-base-300">
                    <td colspan="2" class="text-center">
                      <h3 class="text-lg font-bold">{{ $t('block.countdown_for_block_input') }}</h3>
                      <p class="py-4">
                      <div class="join">
                        <input class="input input-bordered join-item !bg-base-300" v-model="newHeight" type="number" />
                        <button class="btn btn-primary join-item" @click="updateTarget()">{{ $t('block.btn_update')
                          }}</button>
                      </div>
                      </p>
                    </td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.current_height') }}:</td>
                    <td class="text-right">#{{ base.latest?.block?.header.height }}</td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.remaining_blocks') }}:</td>
                    <td class="text-right">{{ remainingBlocks }}</td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.average_block_time') }}:</td>
                    <td class="text-right">{{ (base.blocktime / 1000).toFixed(1) }}s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-show="tab === 'transactions'" class="bg-base-100    rounded overflow-x-auto">
      <table class="table w-full table-compact">
        <thead class="bg-base-200">
          <tr>
            <th>{{ $t('account.messages') }}</th>
            <th style="position: relative; z-index: 2">
              {{ $t('account.hash') }}
            </th>
            <th>{{ $t('block.fees') }}</th>
            <th style="position: relative; z-index: 2">
              {{ $t('account.height') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in base.txsInRecents" :index="index" class="hover">
            <td>{{ format.messages(item.tx.body.messages) }}</td>
            <td class="truncate text-link" width="50%">
              <RouterLink :to="`/${props.chain}/tx/${item.hash}`">{{
                item.hash
                }}</RouterLink>
            </td>
            <td>{{ format.formatTokens(item.tx.authInfo.fee?.amount) }}</td>
            <td class="text-sm text-link">
              <RouterLink :to="`/${props.chain}/block/${item.height}`">{{
                item.height
                }}</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="p-4">
        <div class="alert relative bg-transparent">
          <div class="alert absolute inset-x-0 inset-y-0 w-full h-full bg-info opacity-10"></div>
          <div class="text-info flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ $t('block.only_tx') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks',
        order: 5
      }
    }
  </route>
