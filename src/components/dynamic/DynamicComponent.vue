<script lang="ts" setup>
import { fromBinary } from '@cosmjs/cosmwasm-stargate';
import { computed } from 'vue';
import { select, decodeProto } from './index';

const props = defineProps(['value', 'direct']);

const selectValue = computed(() => {
  if (typeof props.value === 'string') {
    try {
      return fromBinary(props.value);
    } catch {}
    return props.value;
  } else if (props.value?.typeUrl) {
    return { typeUrl: props.value.typeUrl, value: decodeProto(props.value) };
  }
  return props.value;
});
</script>
<template>
  <Component :is="select(value, direct)" :value="selectValue"></Component>
</template>
