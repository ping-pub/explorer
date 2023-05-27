<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useFormatter } from '@/stores';
const props = defineProps(['height', 'chain']);

const tab = ref('blocks');

const base = useBaseStore()

const format = useFormatter();

const list = computed(() => {
    // const recents = base.recents
    // return recents.sort((a, b) => (Number(b.block.header.height) - Number(a.block.header.height)))
    return base.recents
})
</script>
<template>
    <div>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'blocks' }"
                @click="tab = 'blocks'">Blocks</a>
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'transactions' }"
                @click="tab = 'transactions'">Transactions</a>
        </div>

        <div v-show="tab === 'blocks'" class="grid xl:!grid-cols-6 md:!grid-cols-4 grid-cols-1 gap-3">

            <RouterLink v-for="item in list"
                class="flex flex-col justify-between rounded p-4 shadow bg-base-100"
                :to="`/${chain}/block/${item.block.header.height}`">
                <div class="flex justify-between">
                    <h3 class="text-md font-bold sm:!text-lg">
                        {{ item.block.header.height }}
                    </h3>
                    <span class="rounded text-xs whitespace-nowrap font-medium text-green-600">
                        {{ format.toDay(item.block?.header?.time, 'from') }}
                    </span>
                </div>
                <div class="flex justify-between tooltip" data-tip="Block Proposor">
                    <div class="mt-2 hidden text-sm sm:!block truncate">
                        <span>{{ format.validator(item.block?.header?.proposer_address) }}</span>
                    </div>
                    <span class="text-right mt-1 whitespace-nowrap"> {{ item.block?.data?.txs.length }} txs </span>
                </div>
            </RouterLink>
        </div>

        <div v-show="tab === 'transactions'" class="bg-base-100 rounded overflow-x-auto">
            <table class="table w-full table-compact">
                <thead>
                    <tr>
                        <th style="position: relative; z-index: 2;">Height</th>
                        <th style="position: relative; z-index: 2;">Hash</th>
                        <th>Messages</th>
                        <th>Fees</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in base.txsInRecents" :index="index">
                        <td class="text-sm text-primary">
                            <RouterLink :to="`/${props.chain}/block/${item.height}`">{{ item.height }}</RouterLink>
                        </td>
                        <td class="truncate text-primary" width="50%">
                            <RouterLink :to="`/${props.chain}/tx/${item.hash}`">{{
                                item.hash
                            }}</RouterLink>
                        </td>
                        <td>{{ format.messages(item.tx.body.messages) }}</td>
                        <td>{{ format.formatTokens(item.tx.authInfo.fee?.amount) }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="p-4">
                <div class="alert relative bg-transparent">
                    <div class="alert  absolute inset-x-0 inset-y-0 w-full h-full bg-info opacity-10"></div>
                    <div class="text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="stroke-current flex-shrink-0 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Only show txs in recent blocks</span>
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
