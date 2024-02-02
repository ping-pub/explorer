<script lang="ts" setup>
import { fromBase64 } from '@cosmjs/encoding';
import { computed } from 'vue';
import { select, decodeProto } from './index';

const props = defineProps(['value', 'direct']);

const selectValue = computed(() => {
  if (typeof props.value === 'string') {
    try {
      return fromBase64(props.value);
    } catch {}
  } else if (props.value?.typeUrl) {
    return { typeUrl: props.value.typeUrl, value: decodeProto(props.value) };
  }
  return props.value;
});
</script>
<template>
  <Component :is="select(value, direct)" :value="selectValue"></Component>
</template>
