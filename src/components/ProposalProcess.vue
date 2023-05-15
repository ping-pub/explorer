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
  <div class="progress rounded-[3px] h-6 text-xs flex items-center">
    <div
      class="h-6 bg-yes flex items-center pl-2 text-white overflow-hidden"
      :style="`width: ${yes}`"
      :title="yes"
    >
      {{ yes }}
    </div>
    <div
      class="h-6 bg-no flex items-center text-white overflow-hidden"
      :style="`width: ${no}`"
      :title="no"
    >
      {{ no }}
    </div>
    <div
      class="h-6 bg-[#B71C1C] flex items-center text-white overflow-hidden"
      :style="`width: ${veto};`"
      :title="veto"
    >
      {{ veto }}
    </div>
    <div
      class="h-6 bg-secondary flex items-center text-white overflow-hidden"
      :style="`width: ${abstain}`"
      :title="abstain"
    >
      {{ abstain }}
    </div>
  </div>
</template>
<style scoped>
.progress {
  overflow: hidden;
  background-color: rgba(128, 128, 128, 0.178);
}
</style>
