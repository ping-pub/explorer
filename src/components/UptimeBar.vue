<script lang="ts" setup>
import type { Commit } from '@/types';

const props = defineProps({
  blocks: { type: Array as PropType<Commit[]> },
  validator: { type: String },
});

const bars = computed(() => {
  const uptime = Array(50).fill({ height: 0, color: 'bg-secondary' });
  props.blocks.forEach((element) => {
    const has = element.signatures?.findIndex(
      (sig) => sig.validator_address === props.validator
    );
    // console.log(has, props.validato, element)
    uptime.push({
      height: element.height,
      color: has > -1 ? 'bg-success' : 'bg-error',
    });
    uptime.shift();
  });
  return uptime;
});
</script>
<template>
  <div class="d-flex items-center justify-evenly">
    <div class="cursor-default"  v-for="(item, index) in bars" :key="index">
      <div class="tooltip" :data-tip="item.height">
        <span
          :class="item.color"
          class="rounded"
          style="width: 1.5%"
        >&nbsp;
        </span>
      </div>
    </div>
  </div>
</template>
