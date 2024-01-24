<script lang="ts" setup>
import { useBaseStore } from '@/stores';
import { JsonViewer } from 'vue3-json-viewer';
import { fromAscii, toBase64, toHex } from '@cosmjs/encoding';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { parseJSONRecursive } from '@/libs/utils';
import { fromBinary } from '@cosmjs/cosmwasm-stargate';

const baseStore = useBaseStore();

const props = defineProps(['value']);
const format = ref('base64');
const text = computed(() => {
  switch (format.value) {
    case 'hex':
      return toHex(props.value);
    case 'base64':
      return toBase64(props.value);
    default:
      try {
        const jsonValue = fromBinary(toBase64(props.value));
        console.log('computed', jsonValue);
        return parseJSONRecursive(jsonValue);
      } catch (ex) {
        return 'Invalid Utf8';
      }
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
    <div>
      <JsonViewer
        v-if="typeof text === 'object'"
        :value="text"
        :theme="baseStore.theme || 'dark'"
        style="background: transparent"
        copyable
        boxed
        sort
        :expand-depth="5"
      />
      <span v-else>
        {{ text }}
      </span>
    </div>
    <div class="btn-group mt-4 inline-block" role="group">
      <button
        type="button"
        v-bind:class="getClass('utf8')"
        class="btn btn-xs"
        @click="change('utf8')"
      >
        Utf8
      </button>
      <button
        type="button"
        v-bind:class="getClass('base64')"
        class="btn btn-xs"
        @click="change('base64')"
      >
        Base64
      </button>
      <button
        type="button"
        v-bind:class="getClass('hex')"
        class="btn btn-xs"
        @click="change('hex')"
      >
        Hex
      </button>
    </div>
  </div>
</template>
