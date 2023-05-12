<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import { useWasmStore } from './WasmStore';
import { ref } from 'vue';
import type { PaginabledCodeInfos } from './types';

const props = defineProps(['chain']);

const codes = ref({} as PaginabledCodeInfos);

const wasmStore = useWasmStore();
wasmStore.wasmClient.getWasmCodeList().then((x) => {
  codes.value = x;
});
</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
    <h2 class="card-title truncate w-full">Cosmos Wasm Smart Contracts</h2>
    <div class="overflow-x-auto">
      <table class="table w-full mt-4 text-sm">
        <thead>
          <tr>
            <th style="position: relative">Code Id</th>
            <th>Code Hash</th>
            <th>Creator</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in codes.code_infos">
            <td>{{ v.code_id }}</td>
            <td>
              <RouterLink
                :to="`/${props.chain}/cosmwasm/${v.code_id}/contracts`"
                ><div class="text-truncate" style="max-width: 200px">
                  {{ v.data_hash }}
                </div></RouterLink
              >
            </td>
            <td>{{ v.creator }}</td>
            <td>
              {{ v.instantiate_permission?.permission }}
              <span
                >{{ v.instantiate_permission?.address }}
                {{ v.instantiate_permission.addresses.join(', ') }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
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
