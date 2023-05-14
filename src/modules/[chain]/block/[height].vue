<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import TxsElement from '@/components/dynamic/TxsElement.vue';
import { useBlockModule } from './block';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed } from '@vue/reactivity';
import { onBeforeRouteUpdate } from 'vue-router';
import { useBaseStore } from '@/stores';
import { ref } from 'vue';
import type { Block } from '@/types';
const props = defineProps(['height', 'chain']);

const store = useBaseStore();
const tab = ref('summary');
const current = ref({} as Block)
store.fetchBlock(props.height).then(x => current.value = x)

const height = computed(() => {
  return Number(current.value.block?.header?.height || props.height || 0);
});

onBeforeRouteUpdate(async (to, from, next) => {
  if (from.path !== to.path) {
    store.fetchBlock(String(to.params.height)).then(x => current.value = x);
    next();
  }
});
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title flex flex-row justify-between">
        <p class="">#{{ current.block?.header?.height }}</p>
        <div class="" v-if="props.height">
          <RouterLink
            :to="`/${store.blockchain.chainName}/block/${height - 1}`"
            class="btn btn-primary btn-sm p-1 text-2xl mr-2"
          >
            <Icon icon="mdi-arrow-left" class="w-full h-full" />
          </RouterLink>
          <RouterLink
            :to="`/${store.blockchain.chainName}/block/${height + 1}`"
            class="btn btn-primary btn-sm p-1 text-2xl"
          >
            <Icon icon="mdi-arrow-right" />
          </RouterLink>
        </div>
      </h2>
      <div>
        <DynamicComponent :value="current.block_id" />
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title flex flex-row justify-between">Block Header</h2>
      <DynamicComponent :value="current.block?.header" />
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title flex flex-row justify-between">Transactions</h2>
      <TxsElement :value="current.block?.data?.txs" />
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title flex flex-row justify-between">Last Commit</h2>
      <DynamicComponent :value="current.block?.last_commit" />
    </div>
  </div>
</template>
