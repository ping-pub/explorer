<script lang="ts" setup>
import PaginationBar from '@/components/PaginationBar.vue';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type PaginatedTxs } from '@/types';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useWasmStore } from '../WasmStore';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { useRoute } from 'vue-router';

const chainStore = useBlockchain();
const format = useFormatter();
const wasmStore = useWasmStore();

const route  = useRoute()
const page = ref(new PageRequest())

const txs = ref<PaginatedTxs>({ txs: [], tx_responses: [], pagination: { total: "0" } });
const info = ref<any>(null);

onMounted(() => {
    const address = String(route.query.contract)
    wasmStore.wasmClient.getWasmContracts(address).then((x) => {
        info.value = x.contract_info;
    });
    chainStore.rpc.getTxs("?order_by=2&events=execute._contract_address='{address}'", { address }, page.value).then(res => {
        txs.value = res
    })
})

function pageload(pageNum: number) {
    page.value.setPage(pageNum)
    const address = String(route.query.contract)
    chainStore.rpc.getTxs("?order_by=2&events=execute._contract_address='{address}'", { address }, page.value).then(res => {
        txs.value = res
    })
}
</script>
<template>
    <div>
        <h2 class="card-title truncate w-full">
            <RouterLink to="contracts"><span class="btn btn-sm"> &lt; </span> </RouterLink>{{ $t('cosmwasm.contract_detail') }} 
        </h2>
        <DynamicComponent :value="info" />
        
        <h2 class="card-title truncate w-full mt-4">Transactions</h2>
        <table class="table">
            <thead>
                <tr>
                    <td> {{ $t('ibc.height') }}</td>
                    <td>{{ $t('ibc.txhash') }}</td>
                    <td> {{ $t('ibc.messages') }}</td>
                    <td>{{ $t('ibc.time') }}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="resp in txs?.tx_responses">
                    <td>{{ resp.height }}</td>
                    <td>
                        <div class="text-xs truncate text-primary dark:invert">
                            <RouterLink :to="`/${chainStore.chainName}/tx/${resp.txhash}`">{{ resp.txhash }}</RouterLink>
                        </div>
                    </td>
                    <td>
                        <div class="flex">
                            {{ format.messages(resp.tx.body.messages) }}
                            <Icon v-if="resp.code === 0" icon="mdi-check" class="text-success text-lg" />
                            <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
                        </div>
                    </td>
                    <td>{{ format.toLocaleDate(resp.timestamp) }}</td>
                </tr>
            </tbody>
        </table>
        <PaginationBar :limit="page.limit" :total="txs.pagination?.total" :callback="pageload" />
    </div>
</template>