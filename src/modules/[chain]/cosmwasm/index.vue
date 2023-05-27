<script lang="ts" setup>
import { useBlockchain, useFormatter, useTxDialog } from '@/stores';
import { useWasmStore } from './WasmStore';
import { ref } from 'vue';
import type { PaginabledCodeInfos } from './types';
import { PageRequest } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';

const props = defineProps(['chain']);

const codes = ref({} as PaginabledCodeInfos);

const pageRequest = ref(new PageRequest())
const wasmStore = useWasmStore();
const dialog = useTxDialog()

function pageload(pageNum: number) {
    pageRequest.value.setPage(pageNum)
    wasmStore.wasmClient.getWasmCodeList(pageRequest.value).then((x) => {
        codes.value = x;
    });
}
pageload(1)
</script>
<template>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title truncate w-full">Cosmos Wasm Smart Contracts</h2>
        <div class="overflow-x-auto">
            <table class="table table-compact w-full mt-4 text-sm">
                <thead>
                    <tr>
                        <th>Code Id</th>
                        <th>Code Hash</th>
                        <th>Creator</th>
                        <th>Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, index) in codes.code_infos" :key="index">
                        <td>{{ v.code_id }}</td>
                        <td>
                            <RouterLink :to="`/${props.chain}/cosmwasm/${v.code_id}/contracts`"
                                class="truncate max-w-[200px] block text-primary" :title="v.data_hash">
                                {{ v.data_hash }}
                            </RouterLink>
                        </td>
                        <td>{{ v.creator }}</td>
                        <td>
                            {{ v.instantiate_permission?.permission }}
                            <span>{{ v.instantiate_permission?.address }}
                                {{ v.instantiate_permission.addresses.join(', ') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-between">
                <PaginationBar :limit="pageRequest.limit" :total="codes.pagination?.total" :callback="pageload" />
                <label for="wasm_store_code" class="btn btn-primary my-5" @click="dialog.open('wasm_store_code', {})">Upload
                    Smart
                    Contract</label>
            </div>
        </div>
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'cosmwasm'
      }
    }
</route>
