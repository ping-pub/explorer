<script lang="ts" setup>
import {
  useDashboard,
  LoadingStatus,
  type ChainConfig,
} from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';
import { computed, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

dashboard.$subscribe((mutation, state) => {
  localStorage.setItem('favorite', JSON.stringify(state.favorite));
  // TODO: cause endless loop
  // dashboard.loadingPrices()
});
const keywords = ref('');
const chains = computed(() => {
  if (keywords.value) {
    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) => x.chainName.indexOf(keywords.value) > -1
    );
  } else {
    return Object.values(dashboard.chains);
  }
});
</script>
<template>
  <div class="">
    <div class="flex items-center justify-center mb-6 mt-10">
      <div class="w-8 md:!w-16 rounded-full mr-3">
        <img src="/logo.svg" />
      </div>
      <h1 class="text-primary text-3xl md:!text-6xl font-bold mr-2">
        Ping dashboard
      </h1>
      <div class="badge badge-primary badge-outline mt-1 text-sm md:!mt-8">
        Beta
      </div>
    </div>
    <div class="text-center text-base">
      <p class="mb-1">
        {{ $t('index.slogan') }}
      </p>
      <h2 class="mb-6">Cosmos Ecosystem Blockchains 🚀</h2>
    </div>
    <div
      v-if="dashboard.status !== LoadingStatus.Loaded"
      class="flex justify-center"
    >
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <VTextField
      v-model="keywords"
      variant="underlined"
      :placeholder="$t('index.search_placeholder')"
      style="max-width: 300px"
      app
    >
      <template #append-inner>
        {{ chains.length }}/{{ dashboard.length }}
      </template>
    </VTextField>

    <div
      class="grid grid-cols-2 gap-4 mt-6 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5"
    >
      <ChainSummary
        v-for="(chain, index) in chains"
        :key="index"
        :name="chain.chainName"
      />
    </div>
  </div>
</template>
