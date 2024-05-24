<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import {
  useDashboard,
  LoadingStatus,
  type ChainConfig,
} from '@/stores/useDashboard';
import ChainSummary from '@/components/ChainSummary.vue';
import { computed, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();

const keywords = ref('');
const chains = computed(() => {
  if (keywords.value) {
    const lowercaseKeywords = keywords.value.toLowerCase();

    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) => x.chainName.toLowerCase().indexOf(lowercaseKeywords) > -1 
      || x.prettyName.toLowerCase().indexOf(lowercaseKeywords) > -1
    );
  } else {
    return Object.values(dashboard.chains);
  }
});

const featured = computed(() => {
  const names = ["cosmos", "osmosis", "akash", "secret", "evmos", "injective", "dydx", "noble"];
  return chains.value
    .filter(x => names.includes(x.chainName))
    .sort((a, b)=> (names.indexOf(a.chainName) - names.indexOf(b.chainName)))
})

const chainStore = useBlockchain()
</script>
<template>
  <div class="">
    <div class="flex md:!flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <div class="w-16 rounded-full">
          <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165.79 167.16">
              <g id="Layer_1-2">
              <ellipse cx="82.9" cy="83.58" rx="78.65" ry="79.34" style="fill: #ffea6e;"/>
              <path d="m82.9,167.16C37.19,167.16,0,129.67,0,83.58S37.19,0,82.9,0s82.89,37.49,82.89,83.58-37.18,83.58-82.89,83.58Zm0-158.68C41.9,8.48,8.49,42.17,8.49,83.58s33.38,75.09,74.41,75.09,74.4-33.68,74.4-75.09S123.93,8.48,82.9,8.48Z" style="fill: #101111;"/>
              <rect x="31.69" y="97.23" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="42.02" y="107.5" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="52.36" y="97.23" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="62.7" y="107.5" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="72.97" y="97.23" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="83.31" y="107.5" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="93.65" y="97.23" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="114.26" y="97.23" width="10.27" height="10.27" style="fill: #101414;"/>
              <rect x="103.99" y="107.5" width="10.27" height="10.27" style="fill: #101414;"/>
              <path d="m131.81,107.5h-6.88l-2.55,21.73c-.24,3,2.54,5.55,6.06,5.55s6.29-2.55,6.05-5.55l-2.68-21.73Zm-3.37,24.64c-1.91,0-3.45-1.53-3.46-3.44s1.53-3.45,3.44-3.46c1.91,0,3.45,1.53,3.46,3.44h0c0,1.91-1.53,3.45-3.43,3.46,0,0,0,0-.01,0Z" style="fill: #101414;"/>
              <path d="m106.39,63.26l10.71-6.07c-2-6.77-6.08-12-10.42-12.16-6.52-.31-11.58,10.71-11.5,19.41.08,9.11,5.82,20,12.05,19.31,4.57-.5,8.92-7.19,10-16.17l-10.84-4.32Z" style="fill: #101111;"/>
              <path d="m59.75,63.26l10.71-6.07c-2-6.77-6.08-12-10.42-12.16-6.52-.31-11.58,10.71-11.5,19.41.08,9.11,5.82,20,12,19.31,4.57-.5,8.92-7.19,10-16.17l-10.79-4.32Z" style="fill: #101111;"/>
              </g>
          </svg>
      </div>
      <h1 class="text-black dark:text-white text-3xl md:!text-5xl font-bold">
        {{ $t('pages.title') }}
      </h1>
    </div>
    <div
      v-if="dashboard.status !== LoadingStatus.Loaded"
      class="flex justify-center"
    >
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <div v-if="featured.length>0" class="text-center text-base mt-6 text-[#222222] dark:text-whisper">
      <h2 class="mb-6"> Featured Blockchains 🔥 </h2>
    </div>

    <div v-if="featured.length>0"
      class="grid grid-cols-1 text-white200 gap-4 mt-6 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5"
    >
    <ChainSummary
        v-for="(chain, index) in featured"
        :key="index"
        :name="chain.chainName"
      />
    </div>

    <div class="text-center text-base mt-6 text-[#222222] dark:text-whisper">
      <h2 class="mb-6">{{ $t('pages.description') }}</h2>
    </div>

    <div class="flex items-center rounded-lg  dark:bg-[#101414]  border border-gray-200 dark:border-gray-700 mt-10">
      <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3"/>
      <input :placeholder="$t('pages.search_placeholder')" class="px-4 h-10 bg-transparent flex-1 outline-none text-base" v-model="keywords" />
      <div class="px-4 text-base hidden md:!block">{{ chains.length }}/{{ dashboard.length }}</div>
    </div>

    <div
      class="grid grid-cols-1 gap-4 mt-6 md:!grid-cols-3 lg:!grid-cols-4 2xl:!grid-cols-5"
    >
      <ChainSummary
        v-for="(chain, index) in chains"
        :key="index"
        :name="chain.chainName"
      />
    </div>
  </div>
</template>

<style scoped>
 .logo path{
  fill: #212121;
}
</style>
