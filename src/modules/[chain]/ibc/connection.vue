<script lang="ts" setup>
import PaginationBar from '@/components/PaginationBar.vue';
import { useBlockchain, useFormatter } from '@/stores';
import { PageRequest, type Connection, type Pagination } from '@/types';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';

import ChainRegistryClient from '@ping-pub/chain-registry-client';
import type { IBCPath } from '@ping-pub/chain-registry-client/dist/types';
import router from '@/router';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const list = ref([] as Connection[]);
const pageRequest = ref(new PageRequest())
const pageResponse = ref({} as Pagination)
const tab = ref('registry');

onMounted(() => {
  pageload(1)
});

function pageload(p: number) {
  pageRequest.value.setPage(p)
  chainStore.rpc.getIBCConnections(pageRequest.value).then((x) => {
    list.value = x.connections;
    pageResponse.value = x.pagination
    if(x.pagination.total && Number(x.pagination.total) > 0) {
      showConnection(0)
    }
  });
}

// Common IBC connections
const paths = ref([] as IBCPath[])
const client = new ChainRegistryClient();
client.fetchIBCPaths().then(res => {
  paths.value = res
});
const connectionId = ref(undefined)
const commonIBCs = computed(() => {
  const a = paths.value.filter(x => x.path.search(chainStore.current?.prettyName || chainStore.chainName) > -1)
  if (a.length === 0) tab.value === 'favorite'
  return a
})

function fetchConnection(path: string) {
  client.fetchIBCPathInfo(path).then(res => {
    const connId = res.chain_1.chain_name === chainStore.current?.prettyName || chainStore.chainName ?
      res.chain_1.connection_id : res.chain_2.connection_id
    showConnection(connId)
  })
}

function showConnection(connId?: string | number) {
  const path = `/${props.chain}/ibc/connection/${connId || `connection-${connectionId.value || 0}`}`
  router.push(path)
}

</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <div class="flex flex-wrap gap-4  items-center">
        <h2 class="card-title py-4">IBC Connections</h2>
        <div class="tabs tabs-boxed">
          <a class="tab" :class="{ 'tab-active': tab === 'registry' }" @click="tab = 'registry'">Registry</a>
          <a class="tab" :class="{ 'tab-active': tab === 'favorite' }" @click="tab = 'favorite'">Favorite</a>
        </div>
      </div>
      <div>
        <div v-show="tab === 'registry'" class="flex flex-wrap gap-1 p-4 ">
          <span v-for="s in commonIBCs" class="btn btn-xs btn-link mr-1" @click="fetchConnection(s.path)">{{ s.from }}
            &#x21cc; {{ s.to }}</span>
        </div>
        <div v-show="tab === 'favorite'" class="flex flex-wrap gap-1 p-4 ">
          <div class="join border border-primary">
            <button class="join-item px-2">Connection Id:</button>
            <input v-model="connectionId" type=number class="input input-bordered w-40 join-item" min="0"
              :max="pageResponse.total || 0" :placeholder="`0~${pageResponse.total}`" />
            <button class="join-item btn  btn-primary" @click="showConnection()">apply</button>
          </div>
        </div>
      </div>
      <div class="overflow-auto mt-5">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>
