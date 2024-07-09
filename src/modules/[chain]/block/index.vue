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
const lastHeight = ref(Number(base.latest?.block?.header.height || 0) + 10000);
const target = ref(Number(lastHeight.value || 0));
const current = ref({} as BlockResponse);

const list = computed(() => {
  const recents = base.recents;
  return recents.sort(
    (a, b) => Number(b.block.header.height) - Number(a.block.header.height)
  );
});

watchEffect(() => {
  if (base.latest?.block?.header.height && lastHeight.value === 10000) {
    lastHeight.value = Number(base.latest?.block?.header.height || 0) + 10000;
    target.value = Number(lastHeight.value || 0);
  }
});

const remainingBlocks = computed(() => {
  const latest = base.latest?.block?.header.height;
  return latest ? Number(target.value) - Number(latest) : 0;
});

const estimateTime = computed(() => {
  const seconds =
    remainingBlocks.value * Number((base.blocktime / 1000).toFixed()) * 1000;
  return seconds;
});

const estimateDate = computed(() => {
  return new Date(new Date().getTime() + estimateTime.value);
});

const edit = ref(false);
const newHeight = ref(lastHeight.value);
function updateTarget() {
  target.value = Number(newHeight.value);
  console.log(target.value);
}

onBeforeRouteUpdate(async (to, from, next) => {
  if (from.path !== to.path) {
    base.fetchBlock(String(to.params.height)).then((x) => {
      current.value = x;
    });
    next();
  }
});

console.log('item.block?.header', list);
</script>
<template>
  <div class="m-4 md:m-6 border border-base-400 bg-base-100 rounded-2xl">
    <div class="tabs tabs-boxed customTabV2 bg-transparent mb-4 p-6 pb-0">
      <a
        class="tab text-gray-400 capitalize !pb-3"
        :class="{ 'tab-active': tab === 'blocks' }"
        @click="tab = 'blocks'"
        >{{ $t('block.recent') }}</a
      >
      <!-- <RouterLink class="tab text-gray-400 capitalize" :to="`/${chain}/block/${Number(base.latest?.block?.header.height || 0) + 10000
        }`">{{ $t('block.future') }}</RouterLink> -->
      <a
        class="tab text-gray-400 capitalize !pb-2"
        :class="{ 'tab-active': tab === 'future' }"
        @click="tab = 'future'"
        >{{ $t('block.future') }}</a
      >
      <a
        class="tab text-gray-400 capitalize !pb-2"
        :class="{ 'tab-active': tab === 'transactions' }"
        @click="tab = 'transactions'"
        >{{ $t('account.transactions') }}</a
      >
    </div>

    <div v-show="tab === 'blocks'" class="grid grid-cols-1 gap-3">
      <div class="bg-base-100 overflow-x-auto w-full rounded-2xl mb-4">
        <table class="table w-full table-compact">
          <thead class="border border-base-200">
            <tr>
              <th class="text-white text-xs font-bold">#ID</th>
              <th
                class="text-white text-xs font-bold"
                style="position: relative; z-index: 2"
              >
                Block Proposer
              </th>
              <th class="text-white text-xs font-bold">TXS Count</th>
              <th class="text-white text-xs font-bold text-right">
                Created Time
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in list"
              :index="item.block.header.height"
              class="hover:bg-base-300"
            >
              <td>
                <RouterLink
                  :to="`/${chain}/block/${item.block.header.height}`"
                  class="text-link cursor-pointer hover:text-primary"
                >
                  {{ item.block.header.height }}
                </RouterLink>
              </td>
              <td class="text-sm text-link">
                <!-- <RouterLink
                  :to="`/${chain}/staking/${toBase64(
                    item.block?.header?.proposerAddress
                  )}`"
                  class="text-link cursor-pointer hover:text-primary"
                > -->
                <div
                  class="mt-2 hidden text-sm sm:!block truncate text-white font-semibold"
                >
                  <span>{{
                    format.validator(
                      item.block?.header?.proposerAddress &&
                        toBase64(item.block?.header?.proposerAddress)
                    )
                  }}</span>
                </div>
                <!-- </RouterLink> -->
              </td>
              <td>
                <span class="text-right mt-1 whitespace-nowrap text-white">
                  {{ item.block?.txs.length }}
                </span>
              </td>
              <td class="truncate text-right">
                <span
                  class="rounded text-xs whitespace-nowrap font-normal text-[#83838A] text-right"
                >
                  {{
                    format.toDay(item.block?.header?.time.toString(), 'from')
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-show="tab === 'future'"
      class="bg-base-100 rounded-2xl overflow-x-auto"
    >
      <div class="text-center">
        <div v-if="remainingBlocks > 0">
          <div class="text-white font-bold text-lg my-10">#{{ target }}</div>
          <Countdown :time="estimateTime" css="md:mx-3 mx-2" />
          <div class="my-5 text-[#B4B7BB] font-normal text-[14px]">
            {{ $t('block.estimated_time') }}:
            <span class="text-xl font-normal">{{
              format.toLocaleDate(estimateDate)
            }}</span>
          </div>
          <div class="pt-10 flex justify-center">
            <div class="box-content !p-6 rounded-2xl !bg-base">
              <table class="table w-max rounded-2xl">
                <tbody>
                  <tr
                    class="hover hover:brightness-150 rounded cursor-pointer !border-base-300"
                    @click="edit = !edit"
                  >
                    <td>{{ $t('block.countdown_for_block') }}:</td>
                    <td class="text-right">
                      <span class="md:!ml-40">{{ target }}</span>
                    </td>
                  </tr>
                  <tr v-if="edit" class="!border-base-300">
                    <td colspan="2" class="text-center">
                      <h3 class="text-lg font-bold">
                        {{ $t('block.countdown_for_block_input') }}
                      </h3>
                      <div class="py-4">
                        <div class="join">
                          <input
                            class="input input-bordered join-item !bg-base-300"
                            v-model="newHeight"
                            type="number"
                          />
                          <button
                            class="btn btn-primary join-item"
                            @click="updateTarget()"
                          >
                            {{ $t('block.btn_update') }}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.current_height') }}:</td>
                    <td class="text-right">
                      #{{ base.latest?.block?.header.height }}
                    </td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.remaining_blocks') }}:</td>
                    <td class="text-right">{{ remainingBlocks }}</td>
                  </tr>
                  <tr class="!border-base-300">
                    <td>{{ $t('block.average_block_time') }}:</td>
                    <td class="text-right">
                      {{ (base.blocktime / 1000).toFixed(1) }}s
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="tab === 'transactions'"
      class="bg-base-100 overflow-x-auto rounded-2xl"
    >
      <table class="table w-full table-compact">
        <thead class="border border-base-200">
          <tr>
            <th class="text-white text-xs font-bold">
              {{ $t('account.messages') }}
            </th>
            <th
              class="text-white text-xs font-bold"
              style="position: relative; z-index: 2"
            >
              {{ $t('account.hash') }}
            </th>
            <th class="text-white text-xs font-bold">{{ $t('block.fees') }}</th>
            <th
              class="text-white text-xs font-bold"
              style="position: relative; z-index: 2"
            >
              {{ $t('account.height') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in base.txsInRecents"
            :index="index"
            class="hover:bg-base-300"
          >
            <td>
              <span class="bg-[rgba(180,183,187,0.10)] rounded px-2 py-[1px]">
                {{ format.messages(item.tx.body.messages) }}
              </span>
            </td>
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
      <div class="p-4 rounded-2xl">
        <div class="alert relative bg-transparent">
          <div
            class="alert absolute inset-x-0 inset-y-0 w-full h-full bg-info opacity-10"
          ></div>
          <div class="text-info flex gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
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
