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
    console.log(tab.value);
});
function search() {
    if (hashReg.test(hash.value)) {
      vueRouters.push({ path: `/${current}/tx/${hash.value}` });
    }
}
</script>
<template>
    <div>
        <div class="tabs tabs-boxed bg-transparent mb-4">
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'recent' }"
                @click="tab = 'recent'">{{ $t('block.recent') }}</a>
            <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'search' }"
                @click="tab = 'search'">Search</a>
        </div>

        <div v-show="tab === 'recent'" class="bg-base-100 rounded overflow-x-auto">
            <table class="table w-full table-compact">
                <thead class="bg-base-200">
                    <tr>
                        <th style="position: relative; z-index: 2;">{{ $t('account.height') }}</th>
                        <th style="position: relative; z-index: 2;">{{ $t('account.hash') }}</th>
                        <th>{{ $t('account.messages') }}</th>
                        <th>{{ $t('block.fees') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in base.txsInRecents" :index="index" class="hover">
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

        <div v-show="tab === 'search'" class="bg-base-100 rounded overflow-x-auto">
            <div class="p-4">
                <div class="form-control">
                    <input v-model="hash" type="text" class="input input-bordered" placeholder="Search by Tx Hash" @blur="search"/>
                </div>
            </div>
        </div>
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'tx',
        order: 5
      }
    }
  </route>
