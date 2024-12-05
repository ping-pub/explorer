<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import {
  useDashboard,
  type ChainConfig,
} from '@/stores/useDashboard';

import { computed, onMounted, ref } from 'vue';
import { useBlockchain } from '@/stores';

const dashboard = useDashboard();
const keywords = ref('');

const conf = computed(() => dashboard.chains['chain' || {}]);


</script>
<template>
  <div class="bg-[url('../assets/B.svg')] h-full" >
    <div class="flex h-full  flex-col items-center justify-center mb-6 mt-14 gap-16">
      <div class="rounded-full">
      <img class="mx-auto w-96 h-16" src="../assets/logo.svg" />
      </div>
        <h1 class="text-primary  text-3xl font-bold">
            {{ $t('pages.title') }}
        </h1>
    </div>
    <div class="text-center text-base">
      <p class="mb-1">
        {{ $t('pages.slogan') }}
      </p>
    </div>

  </div>
</template>

<style scoped>
.logo path {
  fill: #212121;
}
</style>
