<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import type { PaginatedTxs } from '@/types';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const props = defineProps(['chain']);
const vueRouters = useRouter();
const tab = ref('recent');

const base = useBaseStore()
const chainStore = useBlockchain()

const format = useFormatter();
const hashReg = /^[A-Z\d]{64}$/;
const hash = ref('');
const current = chainStore?.current?.chainName || '';
onMounted(() => {
    tab.value = String(vueRouters.currentRoute.value.query.tab || 'recent');
    base.getAllTxs(chainStore?.current?.transactionService)
});
function search() {
    if (hashReg.test(hash.value)) {
        vueRouters.push({ path: `/${current}/tx/${hash.value}` });
    }
}

function handleScroll() {
    const container = document.querySelector('.txsContainer') as HTMLDivElement;
    // Check if the scroll is at the bottom
    let isAtBottom = container.scrollTop + container.clientHeight + 1 >= container.scrollHeight;
    if (isAtBottom) {
        base.appendTxsByPage(Math.ceil(base.allTxs.length / base.pageSize) + 1, base.pageSize, chainStore?.current?.transactionService)
    }
}
</script>
<template>
    <div>
        <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff;]">Transactions</p>
        <!-- <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'recent' }" @click="tab = 'recent'">{{
                $t('block.recent') }}</a>
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'search' }"
                @click="tab = 'search'">Search</a>
        </div> -->

        <div v-show="tab === 'recent'"
            class="bg-[#EFF2F5;] dark:bg-base-100 px-0.5 pt-0.5 pb-4 rounded-xl shadow-md overflow-x-auto txsContainer"
            @scroll="handleScroll" style="height: 78vh; overflow: auto;">

            <div class="bg-base-200 rounded-md overflow-auto">
                <table class="table w-full table-compact">
                    <thead class="bg-white sticky top-0">
                        <tr class="border-b-[0px]">
                            <th class="bg-white dark:bg-base-100">{{ $t('tx.tx_hash') }}</th>
                            <th class="bg-white dark:bg-base-100">{{ $t('block.block') }}</th>
                            <th class="bg-white dark:bg-base-100">{{ $t('staking.status') }}</th>
                            <th class="bg-white dark:bg-base-100">Messages</th>
                            <th class="bg-white dark:bg-base-100">{{ $t('account.type') }}</th>
                            <th class="bg-white dark:bg-base-100">{{ $t('block.fees') }}</th>
                            <th class="bg-white dark:bg-base-100">{{ $t('account.time') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in base.allTxs" :index="index"
                            class="hover:bg-base-300 transition-colors rounded-xl duration-200 border-b-[0px]">
                            <td class="dark:bg-base-200 bg-white truncate dark:text-warning text-[#153cd8;]"
                                style="max-width:25vw">
                                <RouterLink class="truncate hover:underline" :to="`/${props.chain}/tx/${item.hash}`">{{
                                    item.hash
                                    }}</RouterLink>
                            </td>
                            <td class="dark:bg-base-200 bg-white text-sm dark:text-warning text-[#153cd8;]">
                                <RouterLink :to="`/${props.chain}/blocks/${item.block_height}`" class="hover:underline">
                                    {{ item.block_height }}</RouterLink>
                            </td>
                            <td class="dark:bg-base-200 bg-white text-[#60BC29;]">
                                <span class="text-xs truncate py-1 px-3 rounded-full"
                                    :class="item.status ? 'bg-[#60BC29]/10 text-[#60BC29]' : 'bg-[#E03834]/10 text-[#E03834]'">
                                    {{ item.status ? 'Success' : 'Failed' }}
                                </span>
                            </td>
                            <td class="dark:bg-base-200 bg-white text-[#171C1F;]">{{ item.messages?.length }}</td>
                            <td class="dark:bg-base-200 bg-white dark:text-base-100 text-[#171C1F;]">{{ item.type }}
                            </td>
                            <td class="dark:bg-base-200 bg-white dark:text-base-100 text-[#171C1F;]">{{
                                format.formatTokens(typeof item.fee === 'string' ? [] : item.fee?.amount || [], true,
                                '0,0.[00]') }}</td>
                            <td class="dark:bg-base-200 bg-white dark:text-base-100 text-[#171C1F;]">{{
                                format.toDay(item.timestamp, 'from') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-show="tab === 'search'"
            class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-warning">
            <div class="flex items-center mb-4">
                <Icon icon="mdi:magnify" class="text-2xl text-warning mr-2" />
                <div class="text-lg font-semibold text-main">Search Transactions</div>
            </div>

            <div class="bg-base-200 p-4 rounded-md">
                <div class="form-control">
                    <input v-model="hash" type="text" class="input input-bordered" placeholder="Search by Tx Hash"
                        @blur="search" />
                </div>
            </div>
        </div>
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'tx',
        order: 3
      }
    }
  </route>
