<script lang="ts" setup>
import { toBase64, toHex } from '@cosmjs/encoding';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const props = defineProps(['value']);
const format = ref('base64');
const text = computed(() => {
  return format.value === 'hex' ? toHex(props.value) : toBase64(props.value);
});
function change() {
  format.value = format.value === 'hex' ? 'base64' : 'hex';
}
</script>
<template>
  <span
    >{{ text }} <VIcon size="12" icon="mdi-cached" @click="change()"
  /></span>
</template>
