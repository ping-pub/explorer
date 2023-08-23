<script lang="ts" setup>
import type { Commit } from '@/types';
import { computed, type PropType } from 'vue';

const props = defineProps({
  blocks: { type: Array as PropType<Commit[]> },
  validator: { type: String },
});

const bars = computed(() => {
  const uptime = Array(50).fill({ height: 0, color: 'bg-secondary' });
  if(!props.blocks) return uptime
  props.blocks.forEach((element) => {
    const has = element.signatures?.findIndex(
      (sig) => sig.validator_address === props.validator
    );
    // console.log(has, props.validato, element)
    uptime.push({
      height: element.height,
      color: has > -1 ? 'bg-green-500' : 'bg-red-500',
    });
    uptime.shift();
  });
  return uptime;
});
</script>
<template>
  <div class="flex items-center justify-evenly gap-0.5">
    <div class="cursor-default" v-for="(item, index) in bars" :key="index">
      <div class="tooltip" 
          :data-tip="item.height" 
          :class="item.color"
          style="width: 4px;"
      >
        &nbsp;
      </div>
    </div>
  </div>
</template>

<style>
  
</style>
