<script lang="ts" setup>
import { fromBase64, toBase64 } from '@cosmjs/encoding';

const props = defineProps({
  value: { type: Array<Uint8Array> },
});
</script>
<template>
  <div>
    <div v-for="(item,index) of props.value" :key="index">
      {{ toBase64(item) }}
    </div>
  </div>
</template>
