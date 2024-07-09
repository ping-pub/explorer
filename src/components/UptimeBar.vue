<script lang="ts" setup>
import { toHex } from '@cosmjs/encoding';
import type { Commit } from '@cosmjs/tendermint-rpc';
import { toBase64 } from '@injectivelabs/sdk-ts';
import { computed, type PropType } from 'vue';

const props = defineProps({
  blocks: { type: Array as PropType<Commit[]> },
  validator: { type: String },
});

const bars = computed(() => {
  const uptime = Array(50).fill({ height: 0, color: 'bg-secondary' });
  if (!props.blocks) return uptime;
  props.blocks.filter(Boolean).forEach((element) => {
    const has = element.signatures?.findIndex(
      (sig) =>
        sig.validatorAddress &&
        toHex(sig.validatorAddress).toUpperCase() === props.validator
    );

    uptime.push({
      height: element.height,
      color: has > -1 ? 'bg-[rgba(39,120,77,0.50)]' : 'bg-red-500',
      border: has > -1 ? 'border-[#319660]' : 'border-[#FF5252]',
    });
    uptime.shift();
  });
  return uptime;
});
</script>
<template>
  <div class="flex items-center justify-evenly gap-0.5 mb-3">
    <div class="cursor-default" v-for="(item, index) in bars" :key="index">
      <div
        class="tooltip"
        :data-tip="item.height"
        :class="['border', item.color, item.border]"
        style="width: 4px"
      >
        &nbsp;
      </div>
    </div>
  </div>
</template>
