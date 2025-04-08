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
        base.appendTxsByPage((base.allTxs.length / base.pageSize) + 1, base.pageSize, chainStore?.current?.transactionService)
    }
}
</script>
<template>
    <div>
        <p class="text-2xl font-bold mb-4">Transactions</p>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'recent' }" @click="tab = 'recent'">{{
                $t('block.recent') }}</a>
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'search' }"
                @click="tab = 'search'">Search</a>
        </div>

        <div v-show="tab === 'recent'" class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-warning overflow-x-auto txsContainer" @scroll="handleScroll"
            style="height: 78vh; overflow: auto;">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                    <Icon icon="mdi:transfer" class="text-2xl text-warning mr-2" />
                    <div class="text-lg font-semibold text-main">{{ $t('tx.tx_hash') }}</div>
                </div>
            </div>
            
            <div class="bg-base-200 rounded-md overflow-auto">
                <table class="table w-full table-compact">
                    <thead class="bg-base-300 sticky top-0">
                        <tr>
                            <th class="bg-base-300">{{ $t('tx.tx_hash') }}</th>
                            <th class="bg-base-300">{{ $t('block.block') }}</th>
                            <th class="bg-base-300">{{ $t('staking.status') }}</th>
                            <th class="bg-base-300">Messages</th>
                            <th class="bg-base-300">{{ $t('account.type') }}</th>
                            <th class="bg-base-300">{{ $t('block.fees') }}</th>
                            <th class="bg-base-300">{{ $t('account.time') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in base.allTxs" :index="index" class="hover:bg-base-300 transition-colors duration-200">
                            <td class="truncate text-warning" style="max-width:25vw">
                                <RouterLink class="truncate hover:underline" :to="`/${props.chain}/tx/${item.hash}`">{{
                                    item.hash
                                }}</RouterLink>
                            </td>
                            <td class="text-sm text-warning">
                                <RouterLink :to="`/${props.chain}/blocks/${item.height}`" class="hover:underline">{{ item.height }}</RouterLink>
                            </td>
                            <td>
                                <span class="text-xs truncate py-1 px-3 rounded-full" 
                                      :class="item.status === 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'">
                                    {{ item.status === 0 ? 'Success' : 'Failed' }}
                                </span>
                            </td>
                            <td>{{ item.messages.length }}</td>
                            <td>{{ format.messages(item.messages) }}</td>
                            <td>{{ format.formatTokens(item.fee.amount) }}</td>
                            <td>{{ format.toDay(item.timestamp, 'from') }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-show="tab === 'search'" class="bg-base-100 px-4 pt-3 pb-4 rounded-md shadow-md border-t-4 border-warning">
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
