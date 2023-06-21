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
    return Object.values(dashboard.chains).filter(
      (x: ChainConfig) => x.chainName.indexOf(keywords.value) > -1
    );
  } else {
    return Object.values(dashboard.chains);
  }
});
const chainStore = useBlockchain()
</script>
<template>
  <div class="">
    <div class="flex md:!flex-row flex-col items-center justify-center mb-6 mt-14 gap-2">
      <div class="w-16 rounded-full">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 150.000000 132.000000"
          preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
          :fill="chainStore.current?.themeColor||'#666CFF'" class=" dark:invert" stroke="none">
            <path d="M500 1310 l-125 -5 -182 -315 c-100 -173 -182 -321 -182 -329 -1 -7
            81 -159 181 -337 l183 -324 372 0 371 0 186 325 c102 179 186 330 186 337 0 7
            -82 157 -182 335 l-183 323 -250 -2 c-137 -1 -306 -5 -375 -8z m588 -454 c61
            -106 112 -197 112 -201 0 -4 -50 -95 -111 -201 l-112 -194 -231 0 -231 0 -105
            181 c-58 100 -109 190 -114 200 -6 14 17 63 104 213 l112 196 232 0 231 0 113
            -194z"/>
            <path d="M591 1001 l-54 -6 -87 -150 -88 -150 176 -3 c97 -1 181 -1 187 2 9 3
            165 267 183 308 4 9 -233 7 -317 -1z"/>
            <path d="M872 824 l-90 -159 36 -66 c113 -201 147 -258 153 -251 8 8 179 302
            179 307 0 2 -37 68 -83 147 -46 78 -88 151 -94 162 -9 16 -24 -5 -101 -140z"/>
            <path d="M360 625 c0 -7 148 -263 172 -297 l19 -28 186 0 c101 0 183 3 181 8
            -1 4 -43 78 -93 165 l-90 157 -187 0 c-104 0 -188 -2 -188 -5z"/>
          </g>
        </svg>
      </div>
      <h1 class="text-primary dark:invert text-3xl md:!text-6xl font-bold">
        {{ $t('pages.title') }}
      </h1>
      <div class="badge badge-primary badge-outline dark:invert mt-1 text-sm md:!mt-8">
        {{ $t('pages.tag') }}
      </div>
    </div>
    <div class="text-center text-base">
      <p class="mb-1">
        {{ $t('pages.slogan') }}
      </p>
      <h2 class="mb-6">{{ $t('pages.description') }}</h2>
    </div>
    <div
      v-if="dashboard.status !== LoadingStatus.Loaded"
      class="flex justify-center"
    >
      <progress class="progress progress-info w-80 h-1"></progress>
    </div>

    <div class="flex items-center rounded-lg bg-base-100  border border-gray-200 dark:border-gray-700 mt-10">
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
  fill: #171d30;
}
</style>
