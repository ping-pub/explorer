<script lang="ts" setup>
import ArrayBytesElement from './ArrayBytesElement.vue';
import ArrayObjectElement from './ArrayObjectElement.vue';
import TextElement from './TextElement.vue';
import ArrayCoinElement from './ArrayCoinElement.vue';
import ArrayStringElement from './ArrayStringElement.vue'

const props = defineProps({
  value: { type: Array<Object> },
});

function selectByElement() {
  if (props.value && props.value.length > 0) {
    const [first] = props.value;
    switch (true) {
      case first instanceof Uint8Array:
        return ArrayBytesElement;
      case typeof first === 'string':
        return ArrayStringElement;
      case Object.keys(first).includes('denom'):
        return ArrayCoinElement;
      default:
        return ArrayObjectElement;
    }
  }
  return TextElement;
}
</script>
<template>
  <Component :is="selectByElement()" :value="props.value"></Component>
</template>
