<script lang="ts" setup>
import { toBase64 } from '@cosmjs/encoding';
import type { PropType } from 'vue';
import { computed } from '@vue/reactivity';
import DynamicComponentVue from './DynamicComponent.vue';
import {select} from './index'
import ArrayBytesElement from './ArrayBytesElement.vue';
import ArrayObjectElement from './ArrayObjectElement.vue';
import TextElement from './TextElement.vue';

const props = defineProps({
  value: { type: Array<Object>},
})

function selectByElement() {
  if(props.value && props.value.length > 0) {
    const [first] = props.value
    switch(true) {
      case first instanceof Uint8Array: 
        return ArrayBytesElement
      default:
        return ArrayObjectElement
    }
  }
  return TextElement
}

</script>
<template>
  <Component :is="selectByElement()" :value="props.value"></Component>
</template>