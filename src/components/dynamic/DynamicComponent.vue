<script lang="ts" setup>
import { select, decodeProto } from './index';

const props = defineProps(['value', 'direct']);
if (props.value.typeUrl) {
  props.value.value = decodeProto(props.value);
}
</script>
<template>
  <Component :is="select(value, direct)" :value="value"></Component>
</template>
