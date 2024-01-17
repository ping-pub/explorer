<script lang="ts" setup>
import { fromAscii, toBase64, toHex } from '@cosmjs/encoding';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const props = defineProps(['value']);
const format = ref('base64');
const text = computed(() => {
  switch (format.value) {
    case 'hex':
      return toHex(props.value);
    case 'base64':
      return toBase64(props.value);
    default:
      return fromAscii(props.value);
  }
});
function change(value: string) {
  format.value = value;
}
function getClass(value: string) {
  return value === format.value ? 'btn-primary' : '';
}
</script>
<template>
  <div>
    <div>{{ text }}</div>
    <div class="btn-group mt-4" role="group">
      <button
        type="button"
        v-bind:class="getClass('utf8')"
        class="btn btn-sm"
        @click="change('utf8')"
      >
        Utf8
      </button>
      <button
        type="button"
        v-bind:class="getClass('base64')"
        class="btn btn-sm"
        @click="change('base64')"
      >
        Base64
      </button>
      <button
        type="button"
        v-bind:class="getClass('hex')"
        class="btn btn-sm"
        @click="change('hex')"
      >
        Hex
      </button>
    </div>
  </div>
</template>
