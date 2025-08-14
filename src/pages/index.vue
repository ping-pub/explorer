<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useDashboard, LoadingStatus } from '@/stores';
import type { ChainConfig } from '@/types/chaindata';
import ChainSummary from '@/components/ChainSummary.vue';
import AdBanner from '@/components/ad/AdBanner.vue';

import { computed, onMounted, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

const keywords = ref('');
const chains = computed(() => {
  if (keywords.value) {
    const lowercaseKeywords = keywords.value.toLowerCase();

    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) =>
        x.chainName.toLowerCase().indexOf(lowercaseKeywords) > -1 ||
        x.prettyName.toLowerCase().indexOf(lowercaseKeywords) > -1
    );
  } else {
    return Object.values(dashboard.chains);
  }
});

// Featured chains section removed

const chainStore = useBlockchain();
</script>
<template>
  <div class="">
    <div class="flex md:!flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <img class="w-20 h-auto" src="/bryanlabs-logo-transparent.png" alt="BryanLabs Logo" />
      <h1 class="text-primary dark:invert text-3xl md:!text-6xl font-bold">
        Bryanlabs Infrastructure
      </h1>
    </div>
    <div class="text-center text-base">
      <span class="inline-block bg-bryanlabs-green text-white rounded px-3 py-1 mb-2 font-semibold">Blockchain explorer for cosmos chains.</span>
    </div>
    <div v-if="dashboard.status !== LoadingStatus.Loaded" class="flex justify-center">
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>



    <div class="flex items-center rounded-lg bg-base-100 border border-gray-200 dark:border-gray-700 mt-10">
      <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3" />
      <input
        :placeholder="$t('pages.search_placeholder')"
        class="px-4 h-10 bg-transparent flex-1 outline-none text-base"
        v-model="keywords"
      />
      <div class="px-4 text-base hidden md:!block">{{ chains.length }}/{{ dashboard.length }}</div>
    </div>

    <div class="grid grid-cols-1 gap-4 mt-6 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5">
      <ChainSummary v-for="(chain, index) in chains" :key="index" :name="chain.chainName" />
    </div>
  </div>
</template>

<style scoped>
.logo path {
  fill: #171d30;
}
</style>
