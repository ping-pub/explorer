<script lang="ts" setup>
import { useParamStore } from '@/stores';
import { ref, onMounted } from 'vue';
import CardParameter from '@/components/CardParameter.vue';
import ArrayObjectElement from '@/components/dynamic/ArrayObjectElement.vue';
import { formatTitle } from '@/libs/utils';
const store = useParamStore();
const chain = ref(store.chain);
onMounted(() => {
  // fetch the data
  store.initial();
});
</script>
<template>
  <!-- Chain ID -->
  <div class="px-6 pt-3 pb-4">
    <div class="text-base font-semibold mb-3 text-white">
      {{ chain.title }}
    </div>
    <div
      class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-4 2xl:!grid-cols-4 gap-4"
    >
      <div
        v-for="(item, index) of chain.items"
        :key="index"
        class="rounded-lg px-4 py-2 border border-[#383B40]"
      >
        <div class="text-center text-base mb-1 text-main font-semibold">
          {{ item.value }}
        </div>
        <div class="text-center text-xs text-[#B4B7BB]">
          {{ formatTitle(item.subtitle) }}
        </div>
      </div>
    </div>
  </div>
  <div
    class="overflow-hidden grid grid-cols-1 md:!grid-cols-1 lg:!grid-cols-2 2xl:!grid-cols-2 gap-4 mx-4"
  >
    <!-- minting Parameters  -->
    <CardParameter :cardItem="store.mint" />
    <!-- Staking Parameters  -->
    <CardParameter :cardItem="store.staking" />
    <!-- Governance Parameters -->
    <CardParameter :cardItem="store.gov" />
  </div>

  <div class="px-4 pt-3 pb-4">
    <!-- Distribution Parameters -->
    <CardParameter :cardItem="store.distribution" />
    <!-- Slashing Parameters -->
    <CardParameter :cardItem="store.slashing" :grid="5" />
    <!-- Application Version -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-sm mt-6">
      <div class="text-base mb-3 text-white font-semibold">
        {{ store.appVersion?.title }}
      </div>
      <ArrayObjectElement :value="store.appVersion?.items" :thead="false" />
    </div>

    <!-- Node Information -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded-sm mt-6">
      <div class="text-base mb-3 text-white font-semibold">
        {{ store.nodeVersion?.title }}
      </div>
      <ArrayObjectElement :value="store.nodeVersion?.items" :thead="false" />
    </div>
  </div>
</template>

<route>
{
  meta: {
    i18n: 'parameters',
    order: 50
  }
}
</route>
