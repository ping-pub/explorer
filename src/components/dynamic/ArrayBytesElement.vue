<script lang="ts" setup>
import { fromBase64, toBase64 } from '@cosmjs/encoding';

const props = defineProps({
  value: { type: Array<Uint8Array>},
})

</script>
<template>
  <div>
    <div v-for="v in props.value">
      {{ toBase64(v) }}
    </div>
  </div>
</template>