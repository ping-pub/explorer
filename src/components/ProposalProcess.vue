<script lang="ts" setup>
import { useFormatter } from '@/stores';
import type { Tally } from '@/types';
import { computed } from '@vue/reactivity';
import type { PropType } from 'vue';

const props = defineProps({
  tally: { type: Object as PropType<Tally> },
  pool: {
    type: Object as PropType<{
      not_bonded_tokens: string;
      bonded_tokens: string;
    }>,
  },
});
const total = computed(() => props.pool?.bonded_tokens);
const format = useFormatter();
const yes = computed(() =>
  format.calculatePercent(props.tally?.yes, total.value)
);
const no = computed(() =>
  format.calculatePercent(props.tally?.no, total.value)
);
const abstain = computed(() =>
  format.calculatePercent(props.tally?.abstain, total.value)
);
const veto = computed(() =>
  format.calculatePercent(props.tally?.no_with_veto, total.value)
);
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mb-3 text-sm">
    <div class="flex items-center justify-between rounded-sm px-2 relative">
      <div
        class="bg-yes absolute top-0 bottom-0 left-0 right-0 rounded-sm opacity-20 dark:opacity-40"
      ></div>
      <div>YES</div>
      <div class="text-gray-800 dark:text-gray-50">{{ yes }}</div>
    </div>
    <div class="flex items-center justify-between rounded-sm px-2 relative">
      <div
        class="bg-no absolute top-0 bottom-0 left-0 right-0 rounded-sm opacity-20 dark:opacity-40"
      ></div>
      <div>NO</div>
      <div class="text-gray-800 dark:text-gray-50">{{ no }}</div>
    </div>

    <div class="flex items-center justify-between rounded-sm px-2 relative">
      <div
        class="bg-warning absolute top-0 bottom-0 left-0 right-0 rounded-sm opacity-20 dark:opacity-50"
      ></div>
      <div>No With Veto</div>
      <div class="text-gray-800 dark:text-gray-50">{{ veto }}</div>
    </div>

    <div class="flex items-center justify-between rounded-sm px-2 relative">
      <div
        class="bg-gray-500 absolute top-0 bottom-0 left-0 right-0 rounded-sm opacity-20 dark:opacity-40"
      ></div>
      <div>Abstain</div>
      <div class="text-gray-800 dark:text-gray-50">{{ abstain }}</div>
    </div>
  </div>
  <div class="progress rounded-full h-1 text-xs flex items-center">
    <div class="h-1 bg-yes" :style="`width: ${yes}`"></div>
    <div class="h-1 bg-no" :style="`width: ${no}`"></div>
    <div
      class="h-1"
      :style="`width: ${veto}; background-color: #B71C1C;`"
    ></div>
    <div class="h-1 bg-secondary" :style="`width: ${abstain}`"></div>
  </div>
</template>
<style scoped>
.progress {
  overflow: hidden;
  background-color: rgba(128, 128, 128, 0.178);
}
</style>
