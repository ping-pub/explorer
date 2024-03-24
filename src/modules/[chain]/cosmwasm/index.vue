<script lang="ts" setup>
import { useBlockchain, useFormatter, useTxDialog } from '@/stores';
import { useWasmStore } from './WasmStore';
import { onMounted, ref } from 'vue';
import type { PaginabledCodeInfos } from './types';
import { PageRequest } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';
import router from '@/router';

const props = defineProps(['chain']);

const codes = ref({} as PaginabledCodeInfos);

const pageRequest = ref(new PageRequest())
const wasmStore = useWasmStore();
const dialog = useTxDialog()
const creator = ref("")
const field = ref("contract")
const history = ref([])

function pageload(pageNum: number) {
    pageRequest.value.setPage(pageNum)
    wasmStore.wasmClient.getWasmCodeList(pageRequest.value).then((x) => {
        codes.value = x;
    });
}
pageload(1)

onMounted(() => {
    const historyStore = JSON.parse(localStorage.getItem("contract_history") || "{}")
    history.value = historyStore[props.chain] || []
})

function myContracts() {
    if(field.value === "contract")
        router.push(`/${props.chain}/cosmwasm/0/transactions?contract=${creator.value}`)
    else if(field.value === "creator")
        router.push(`/${props.chain}/cosmwasm/${creator.value}/contracts`)
}
const togo = ref("")
function gotoHistory() {
    router.push(`/${props.chain}/cosmwasm/0/transactions?contract=${togo.value}`)
}
</script>
<template>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title truncate w-full mb-4">{{ $t('cosmwasm.title') }}</h2>
        <div class="grid grid-flow-col auto-cols-max gap-4 overflow-hidden">
            <div class="join w-full border border-primary">
                <select v-model="field" class="select select-primary"><option value="contract">Contract</option><option value="creator">Creator</option></select>
                <input v-model="creator" type=text class="input input-bordered w-full join-item" placeholder="address" />
                <button class="join-item btn  btn-primary" @click="myContracts()">{{ $t('cosmwasm.btn_query') }}</button>
            </div>
            <div>
                <select v-model="togo" class="select select-primary" @change="gotoHistory()">
                    <option value="">History</option>
                    <option v-for="(v, index) in history" :key="index" :value="v" >...{{ String(v).substring(45) }}</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="table table-compact w-full mt-4 text-sm">
                <thead class=" bg-base-200">
                    <tr>
                        <th>{{ $t('cosmwasm.code_id') }}</th>
                        <th>{{ $t('cosmwasm.code_hash') }}</th>
                        <th>{{ $t('cosmwasm.creator') }}</th>
                        <th>{{ $t('cosmwasm.permissions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v, index) in codes.code_infos" :key="index">
                        <td>{{ v.code_id }}</td>
                        <td>
                            <RouterLink :to="`/${props.chain}/cosmwasm/${v.code_id}/contracts`"
                                class="truncate max-w-[200px] block text-primary dark:invert" :title="v.data_hash">
                                {{ v.data_hash }}
                            </RouterLink>
                        </td>
                        <td>{{ v.creator }}</td>
                        <td>
                            {{ v.instantiate_permission?.permission }}
                            <span>{{ v.instantiate_permission?.address }}
                                {{ v.instantiate_permission?.addresses.join(', ') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-between">
                <PaginationBar :limit="pageRequest.limit" :total="codes.pagination?.total" :callback="pageload" />
                <label for="wasm_store_code" class="btn btn-primary my-5" @click="dialog.open('wasm_store_code', {})">{{ $t('cosmwasm.btn_up_sc') }}</label>
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
