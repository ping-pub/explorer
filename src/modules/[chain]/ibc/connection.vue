<script lang="ts" setup>
import PaginationBar from '@/components/PaginationBar.vue';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Connection, type Pagination } from '@/types';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';

import ChainRegistryClient from '@ping-pub/chain-registry-client';
import type { IBCPath } from '@ping-pub/chain-registry-client/dist/types';
import router from '@/router';
import { useIBCModule } from './connStore';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const ibcStore = useIBCModule()
const list = ref([] as Connection[]);
const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)
const tab = ref('registry');

onMounted(() => {
  pageload(1)
  ibcStore.load()
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getIBCConnections(pageRequest.value).then((x) => {
    list.value = x.connections;
    pageResponse.value = x.pagination
    if(x.pagination.total && Number(x.pagination.total) > 0) {
      ibcStore.showConnection(0)
    }
  });
}

</script>
<template>
  <div>
    <div class="bg-[#ffffff] dark:bg-[#222222] px-4 pt-3 pb-4 rounded shadow">
      <div class="flex flex-wrap gap-4  items-center">
        <h2 class="card-title py-4">{{ $t('ibc.title') }}</h2>
        <div class="tabs tabs-boxed dark:bg-[#303030]">
          <a class="tab" :class="{ 'bg-[#ffea6e] text-black': tab === 'registry' }" @click="tab = 'registry'">{{ $t('ibc.registry') }}</a>
          <a class="tab" :class="{ 'bg-[#ffea6e] text-black': tab === 'favorite' }" @click="tab = 'favorite'">{{ $t('module.favorite') }}</a>
        </div>
      </div>
      <div>
        <div v-show="tab === 'registry'" class="flex flex-wrap gap-1 p-4 ">
          <span v-for="s in ibcStore.commonIBCs" class="inline-flex items-center justify-center flex-wrap cursor-pointer select-none text-center transition duration-200 text-purple-400 dark:text-[#ffea6e] hover:text-purple-600 dark:hover:bg-[#202020] dark:hover:text-white dark:hover:shadow-[0_0_10px_3px_rgba(255,234,110,1)] font-bold rounded btn-link mr-1" @click="ibcStore.fetchConnection(s.path)">{{ s.from }}
            &#x21cc; {{ s.to }}</span>
        </div>
        <div v-show="tab === 'favorite'" class="flex flex-wrap gap-1 p-4 ">
          <div class="join border border-[#070707] dark:border-[#ffea6e]">
            <button class="join-item px-2">{{ $t('ibc.connection_id') }}:</button>
            <input v-model="ibcStore.connectionId" type=number class="input  w-40 join-item dark:bg-[#222222] border-s border-[#070707] dark:border-[#ffea6e] " min="0"
              :max="pageResponse.total || 0" :placeholder="`0~${pageResponse.total}`" />
            <button class="join-item inline-flex items-center justify-center flex-wrap cursor-pointer select-none text-center transition duration-200 bg-[#ffea6e] text-black hover:bg-[#ffffff] dark:hover:bg-[#202020] dark:hover:text-white hover:shadow-[0_0_10px_3px_rgba(255,234,110,1)] font-bold px-2" @click="ibcStore.showConnection()">{{ $t('ibc.btn_apply') }}</button>
          </div>
        </div>
      </div>
      <div class="overflow-auto mt-5">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>
