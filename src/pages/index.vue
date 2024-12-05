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
  <div class="mt-20  ">
    <div class="flex h-full  flex-col items-center justify-center mb-6 mt-14 gap-16">
      <div class="rounded-full">
        <img class="mx-auto w-96 h-16" src="../assets/logo.svg" />
      </div>
      <h1 class="text-primary  text-3xl font-bold">
        {{ $t('pages.title') }}
      </h1>
      <div class="text-center text-base">
        <p class="mb-1">
          {{ $t('pages.slogan') }}
        </p>

      </div>
      <!-- Socials -->
      <div class="flex gap-8">
        <a href="https://playonvector.com/" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:globe" class="text-2xl text-primary" />
          <p>Website</p>
        </a>
        <a href="https://x.com/playonvector/" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:x-fill" class="text-2xl text-primary" />
          <p>Twitter</p>
        </a>
        <a href="https://discord.gg/r5JacJAt" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:discord-fill" class="text-2xl text-primary" />
          <p>Discord</p>
        </a>
      </div>
    </div>


  </div>
</template>

<style scoped>
.logo path {
  fill: #212121;
}
</style>
