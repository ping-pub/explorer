<script lang="ts" setup>
import { useBlockchain, useFormatter, useTxDialog } from '@/stores';
import { useWasmStore } from './WasmStore';
import { ref } from 'vue';
import type { PaginabledCodeInfos } from './types';
import { PageRequest } from '@/types';
import PaginationBar from '@/components/PaginationBar.vue';
import router from '@/router';
import type {
  QueryCodeResponse,
  QueryCodesResponse,
} from 'cosmjs-types/cosmwasm/wasm/v1/query';
import { toBase64 } from '@cosmjs/encoding';
import { accessTypeToJSON } from 'cosmjs-types/cosmwasm/wasm/v1/types';

const props = defineProps(['chain']);

const codes = ref({} as QueryCodesResponse);

const pageRequest = ref(new PageRequest());
const wasmStore = useWasmStore();
const dialog = useTxDialog();
const creator = ref('');

function pageload(pageNum: number) {
  pageRequest.value.setPage(pageNum);
  wasmStore.wasmClient.getWasmCodeList(pageRequest.value).then((x) => {
    codes.value = x;
  });
}
pageload(1);

function myContracts() {
  router.push(`/${props.chain}/cosmwasm/${creator.value}/contracts`);
}
</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
    <h2 class="card-title truncate w-full">{{ $t('cosmwasm.title') }}</h2>

    <div class="join border border-primary">
      <input
        v-model="creator"
        type="text"
        class="input input-bordered w-40 join-item"
        placeholder="creator address"
      />
      <button class="join-item btn btn-primary" @click="myContracts()">
        {{ $t('cosmwasm.btn_query') }}
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-compact w-full mt-4 text-sm">
        <thead>
          <tr>
            <th>{{ $t('cosmwasm.code_id') }}</th>
            <th>{{ $t('cosmwasm.code_hash') }}</th>
            <th>{{ $t('cosmwasm.creator') }}</th>
            <th>{{ $t('cosmwasm.permissions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, index) in codes.codeInfos" :key="index">
            <td>{{ v.codeId }}</td>
            <td>
              <RouterLink
                :to="`/${props.chain}/cosmwasm/${v.codeId}/contracts`"
                class="truncate max-w-[200px] block text-primary dark:invert"
                :title="toBase64(v.dataHash)"
              >
                {{ toBase64(v.dataHash) }}
              </RouterLink>
            </td>
            <td>{{ v.creator }}</td>
            <td>
              {{ accessTypeToJSON(v.instantiatePermission?.permission) }}
              <span
                >{{ v.instantiatePermission?.address }}
                {{ v.instantiatePermission?.addresses.join(', ') }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between">
        <PaginationBar
          :limit="pageRequest.limit"
          :total="
            codes.pagination?.total ? codes.pagination.total.toString() : '0'
          "
          :callback="pageload"
        />
        <label
          for="wasm_store_code"
          class="btn btn-primary my-5"
          @click="dialog.open('wasm_store_code', {})"
          >{{ $t('cosmwasm.btn_up_sc') }}</label
        >
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
